import { storage } from 'common/storage';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { settingsAtom } from '../settings/atoms';
import { chatAtom } from './atom';
import { MAX_PERSISTED_MESSAGES, MESSAGE_SAVE_INTERVAL } from './constants';
import { loadChatFromStorage } from './helpers';
import { serializeMessage } from './model';
import { chatRenderer } from './renderer';

let initialized = false;

export function useChatPersistance() {
  const chat = useAtomValue(chatAtom);
  const settings = useAtomValue(settingsAtom);

  useEffect(() => {
    let saveInterval: NodeJS.Timeout;

    if (!initialized && settings.initialized) {
      saveInterval = setInterval(() => {
        saveChatToStorage();
      }, MESSAGE_SAVE_INTERVAL);

      initialized = true;
      loadChatFromStorage();
    }

    return () => {
      if (saveInterval) {
        clearInterval(saveInterval);
      }
    };
  }, [settings.initialized]);

  function saveChatToStorage(): void {
    const fromIndex = Math.max(
      0,
      chatRenderer.messages.length - MAX_PERSISTED_MESSAGES,
    );

    const messages = chatRenderer.messages
      .slice(fromIndex)
      .map((message) => serializeMessage(message));

    storage.set('chat-state', chat);
    storage.set('chat-messages', messages);
  }
}
