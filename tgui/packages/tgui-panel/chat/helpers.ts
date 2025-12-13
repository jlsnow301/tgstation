import { storage } from 'common/storage';
import DOMPurify from 'dompurify';
import { createMessage } from './model';
import { chatRenderer } from './renderer';

// List of blacklisted tags
const FORBID_TAGS = ['a', 'iframe', 'link', 'video'];

export async function loadChatFromStorage(): Promise<void> {
  const [state, messages] = await Promise.all([
    storage.get('chat-state'),
    storage.get('chat-messages'),
  ]);

  // Discard incompatible versions
  if (state && state.version <= 4) return;
  if (!messages) return;

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

export function chatRebuild() {
  chatRenderer.rebuildChat();
}

export function chatSaveToDisk() {
  chatRenderer.saveToDisk();
}

export function chatClear() {
  chatRenderer.clearChat();
}
