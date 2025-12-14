import { storage } from 'common/storage';
import DOMPurify from 'dompurify';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import * as z from 'zod';
import {
  allChatAtom,
  chatLoadedAtom,
  chatPagesAtom,
  chatPagesRecord,
  currentPageIdAtom,
  mainPage,
  scrollTrackingAtom,
  versionAtom,
} from './atom';
import { MAX_PERSISTED_MESSAGES, MESSAGE_SAVE_INTERVAL } from './constants';
import { createMessage, serializeMessage } from './model';
import { chatRenderer } from './renderer';

// List of blacklisted tags
const FORBID_TAGS = ['a', 'iframe', 'link', 'video'];

const storedSettingsSchema = z.object({
  version: z.number(),
  scrollTracking: z.boolean(),
  currentPageId: z.string(),
  pages: z.array(z.string()),
  pagesById: z.record(z.string(), z.any()),
});

/**
 * Custom hook that initializes chat from local storage and periodically saves
 * it back
 */
export function useChatPersistance() {
  const allChat = useAtomValue(allChatAtom);
  const [version, setVersion] = useAtom(versionAtom);
  const [, setScrollTracking] = useAtom(scrollTrackingAtom);
  const [, setChatPages] = useAtom(chatPagesAtom);
  const [, setCurrentPageId] = useAtom(currentPageIdAtom);
  const [, setChatPagesRecord] = useAtom(chatPagesRecord);

  const [loaded, setLoaded] = useAtom(chatLoadedAtom);

  /** Loads or periodically saves chat + chat settings */
  useEffect(() => {
    let saveInterval: NodeJS.Timeout;
    if (!loaded) {
      console.log('Initializing chat');
      saveInterval = setInterval(saveChatToStorage, MESSAGE_SAVE_INTERVAL);

      loadChatFromStorage();
      setLoaded(true);
    }

    return () => {
      if (saveInterval) {
        clearInterval(saveInterval);
      }
    };
  }, []);

  function saveChatToStorage(): void {
    const fromIndex = Math.max(
      0,
      chatRenderer.messages.length - MAX_PERSISTED_MESSAGES,
    );

    const messages = chatRenderer.messages
      .slice(fromIndex)
      .map((message) => serializeMessage(message));

    storage.set('chat-state', allChat);
    storage.set('chat-messages', messages);
  }

  async function loadChatFromStorage(): Promise<void> {
    const [state, messages] = await Promise.all([
      storage.get('chat-state'),
      storage.get('chat-messages'),
    ]);

    // Discard incompatible versions
    if (messages) {
      handleMessages(messages);
    }

    if (state && 'version' in state && state.version <= 4) return;
    handleSettings(state);
  }

  function handleMessages(messages: any[]): void {
    for (const message of messages) {
      if (message.html) {
        message.html = DOMPurify.sanitize(message.html, {
          FORBID_TAGS,
        });
      }
    }

    const batch = [
      ...messages,
      createMessage({
        type: 'internal/reconnected',
      }),
    ];

    chatRenderer.processBatch(batch, {
      prepend: true,
    });

    console.log(`Restored chat with ${messages.length} messages`);
  }

  function handleSettings(state: z.infer<typeof storedSettingsSchema>): void {
    let parsed;
    try {
      parsed = storedSettingsSchema.parse(state);
    } catch (err) {
      console.error(err);
      return;
    }

    // Validate version and/or migrate state
    if (parsed.version !== version) return;

    // Enable any filters that are not explicitly set, that are
    // enabled by default on the main page.
    for (const id of parsed.pages) {
      const page = parsed.pagesById[id];
      const filters = page.acceptedTypes;

      const defaultFilters = mainPage.acceptedTypes;
      for (const type of Object.keys(defaultFilters)) {
        if (filters[type] === undefined) {
          filters[type] = defaultFilters[type];
        }
      }
      // Reset page message counts
      page.unreadCount = 0;
    }

    setVersion(parsed.version);
    setScrollTracking(parsed.scrollTracking);
    setChatPages(parsed.pages);
    setCurrentPageId(parsed.currentPageId);
    setChatPagesRecord(parsed.pagesById);

    chatRenderer.changePage(parsed.pages[0]);
    chatRenderer.onStateLoaded();
    console.log('Restored chat settings: ', parsed);
  }
}
