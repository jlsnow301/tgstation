import type { Store } from 'common/redux';
import { storage } from 'common/storage';
import DOMPurify from 'dompurify';
import { loadChat } from './actions';
import { MAX_PERSISTED_MESSAGES } from './constants';
import { createMessage, serializeMessage } from './model';
import { chatRenderer } from './renderer';
import { selectChat } from './selectors';

// List of blacklisted tags
const FORBID_TAGS = ['a', 'iframe', 'link', 'video'];

export async function saveChatToStorage(store: Store) {
  const state = selectChat(store.getState());
  const fromIndex = Math.max(
    0,
    chatRenderer.messages.length - MAX_PERSISTED_MESSAGES,
  );
  const messages = chatRenderer.messages
    .slice(fromIndex)
    .map((message) => serializeMessage(message));
  storage.set('chat-state', state);
  storage.set('chat-messages', messages);
}

export async function loadChatFromStorage(store: Store) {
  const [state, messages] = await Promise.all([
    storage.get('chat-state'),
    storage.get('chat-messages'),
  ]);
  // Discard incompatible versions
  if (state && state.version <= 4) {
    store.dispatch(loadChat());
    return;
  }
  if (messages) {
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
  }
  store.dispatch(loadChat(state));
}
