import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { isEscape, KEY } from 'tgui-core/keys';
import { BooleanLike } from 'tgui-core/react';

import { Channel, ChannelIterator } from './ChannelIterator';
import { ChatHistory } from './ChatHistory';
import { LineLength, RADIO_PREFIXES, WindowSize } from './constants';
import { windowClose, windowOpen, windowSet } from './helpers';
import { Dragzone } from './TguiSay';
import { byondMessages } from './timers';

type ByondOpen = {
  channel: Channel;
};

type ByondProps = {
  maxLength: number;
  lightMode: BooleanLike;
};

const CHANNEL_REGEX = /^[:.]\w\s/;

const initialState = {
  buttonContent: '',
  currentPrefix: null as keyof typeof RADIO_PREFIXES | null,
  size: WindowSize.Small,
  maxLength: 1024,
  lightMode: false,
  value: '',
};

export function NewSay() {
  const innerRef = useRef<HTMLTextAreaElement>(null);
  const channelIterator = useRef<ChannelIterator>(new ChannelIterator());
  const chatHistory = useRef<ChatHistory>(new ChatHistory());
  const messages = useRef<typeof byondMessages>(byondMessages);

  const [buttonContent, setButtonContent] = useState<string>('');
  const [currentPrefix, setCurrentPrefix] = useState<
    keyof typeof RADIO_PREFIXES | null
  >(null);
  const [size, setSize] = useState<WindowSize>(WindowSize.Small);
  const [maxLength, setMaxLength] = useState<number>(1024);
  const [lightMode, setLightMode] = useState<BooleanLike>(false);
  const [value, setValue] = useState<string>('');

  function handleArrowKeys(direction: KEY.Up | KEY.Down) {
    const chat = chatHistory.current;
    const iterator = channelIterator.current;

    if (direction === KEY.Up) {
      if (chat.isAtLatest() && value) {
        // Save current message to temp history if at the most recent message
        chat.saveTemp(value);
      }
      // Try to get the previous message, fall back to the current value if none
      const prevMessage = chat.getOlderMessage();

      if (prevMessage) {
        setButtonContent(chat.getIndex().toString());
        setSize(prevMessage.length);
        setValue(prevMessage);
      }
    } else {
      const nextMessage = chat.getNewerMessage() || chat.getTemp() || '';

      const newContent = chat.isAtLatest()
        ? iterator.current()
        : chat.getIndex().toString();

      setButtonContent(newContent);
      setSize(nextMessage.length);
      setValue(nextMessage);
    }
  }

  function handleBackspaceDelete() {
    const chat = chatHistory.current;
    const iterator = channelIterator.current;

    // User is on a chat history message
    if (!chat.isAtLatest()) {
      chat.reset();
      setButtonContent(currentPrefix ?? iterator.current());

      // Empty input, resets the channel
    } else if (!!currentPrefix && iterator.isSay() && value?.length === 0) {
      setCurrentPrefix(null);
      setButtonContent(iterator.current());
    }

    handleResize();
  }

  function handleClose() {
    const chat = chatHistory.current;
    const iterator = channelIterator.current;

    innerRef.current?.blur();
    unloadChat();
    chat.reset();
    iterator.reset();
    windowClose();
  }

  function handleEnter() {
    const chat = chatHistory.current;
    const iterator = channelIterator.current;
    const prefix = currentPrefix ?? '';

    if (value?.length && value.length < maxLength) {
      chat.add(value);
      Byond.sendMessage('entry', {
        channel: iterator.current(),
        entry: iterator.isSay() ? prefix + value : value,
      });
    }

    handleClose();
  }

  function handleForceSay() {
    const iterator = channelIterator.current;
    const msg = messages.current;

    // Only force say if we're on a visible channel and have typed something
    if (!value || iterator.isVisible()) return;

    const prefix = currentPrefix ?? '';
    const grunt = iterator.isSay() ? prefix + value : value;

    msg.forceSayMsg(grunt, iterator.current());
    unloadChat();
  }

  function handleIncrementChannel() {
    const iterator = channelIterator.current;
    const msg = messages.current;

    // Binary talk is a special case, tell byond to show thinking indicators
    if (iterator.isSay() && currentPrefix === ':b ') {
      msg.channelIncrementMsg(true);
    }

    setCurrentPrefix(null);
    iterator.next();

    // If we've looped onto a quiet channel, tell byond to hide thinking indicators
    if (!iterator.isVisible()) {
      msg.channelIncrementMsg(false);
    }

    setButtonContent(iterator.current());
  }

  function handleInput() {
    const iterator = channelIterator.current;
    const msg = messages.current;

    // If we're typing, send the message
    if (iterator.isVisible() && currentPrefix !== ':b ') {
      msg.typingMsg();
    }

    handleResize();

    // Is there a value? Is it long enough to be a prefix?
    if (!value || value.length < 3) {
      return;
    }

    if (!CHANNEL_REGEX.test(value)) {
      return;
    }

    // Is it a valid prefix?
    const prefix = value
      .slice(0, 3)
      ?.toLowerCase()
      ?.replace('.', ':') as keyof typeof RADIO_PREFIXES;
    if (!RADIO_PREFIXES[prefix] || prefix === currentPrefix) {
      return;
    }

    // If we're in binary, hide the thinking indicator
    if (prefix === ':b ') {
      Byond.sendMessage('thinking', { visible: false });
    }

    iterator.set(Channel.Say);
    setCurrentPrefix(prefix);
    setButtonContent(RADIO_PREFIXES[prefix]);
    setValue(value.slice(3));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    switch (event.key) {
      case KEY.Up:
      case KEY.Down:
        event.preventDefault();
        handleArrowKeys(event.key);
        break;

      case KEY.Delete:
      case KEY.Backspace:
        handleBackspaceDelete();
        break;

      case KEY.Enter:
        event.preventDefault();
        handleEnter();
        break;

      case KEY.Tab:
        event.preventDefault();
        handleIncrementChannel();
        break;

      default:
        if (isEscape(event.key)) {
          handleClose();
        }
    }
  }

  function handleOpen(data: ByondOpen) {
    setTimeout(() => {
      innerRef.current?.focus();
    }, 0);

    const { channel } = data;
    const iterator = channelIterator.current;
    // Catches the case where the modal is already open
    if (iterator.isSay()) {
      iterator.set(channel);
    }

    setButtonContent(iterator.current());
    windowOpen(iterator.current());
  }

  function handleProps(data: ByondProps) {
    setMaxLength(data.maxLength);
    setLightMode(!!data.lightMode);
  }

  function handleResize() {
    const len = value?.length || 0;

    let newSize: WindowSize;
    if (len > LineLength.Medium) {
      newSize = WindowSize.Large;
    } else if (len <= LineLength.Medium && len > LineLength.Small) {
      newSize = WindowSize.Medium;
    } else {
      newSize = WindowSize.Small;
    }

    if (size !== newSize) {
      setSize(newSize);
      windowSet(newSize);
    }
  }

  function unloadChat() {
    const iterator = channelIterator.current;

    setCurrentPrefix(null);
    setSize(WindowSize.Small);
    setValue('');
    setButtonContent(iterator.current());
  }

  useEffect(() => {
    Byond.subscribeTo('props', handleProps);
    Byond.subscribeTo('force', handleForceSay);
    Byond.subscribeTo('open', handleOpen);
  }, []);

  const theme =
    (lightMode && 'lightMode') ||
    (currentPrefix && RADIO_PREFIXES[currentPrefix]) ||
    channelIterator.current.current();

  return (
    <div className={`window window-${theme} window-${size}`}>
      <Dragzone position="top" theme={theme} />
      <div className="center">
        <Dragzone position="left" theme={theme} />
        <div className="input">
          <button
            className={`button button-${theme}`}
            onClick={handleIncrementChannel}
            type="button"
          >
            {buttonContent}
          </button>
          <textarea
            className={`textarea textarea-${theme}`}
            maxLength={maxLength}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            ref={innerRef}
          />
        </div>
        <Dragzone position="right" theme={theme} />
      </div>
      <Dragzone position="bottom" theme={theme} />
    </div>
  );
}
