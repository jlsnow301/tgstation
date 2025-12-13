import * as z from 'zod';
import { chatRenderer } from './renderer';

const sequences: number[] = [];
const sequences_requested: number[] = [];

const messageSchema = z.object({
  sequence: z.number().int().nonnegative(),
  content: z.any(),
});

type ChatMessage = z.infer<typeof messageSchema>;

function pushMessage(message: ChatMessage) {
  sequences.push(message.sequence);
  chatRenderer.processBatch([message.content]);
}

export function chatMessage(payload: string) {
  let message: ChatMessage;
  try {
    const parsed = JSON.parse(payload);
    message = messageSchema.parse(parsed);
  } catch (err) {
    console.error(err);
    return;
  }

  if (sequences.includes(message.sequence)) {
    return;
  }

  const sequences_count = sequences.length;
  if (sequences_count <= 0) {
    pushMessage(message);
    return;
  }

  if (sequences_requested.includes(message.sequence)) {
    sequences_requested.splice(
      sequences_requested.indexOf(message.sequence),
      1,
    );
    pushMessage(message);
    return;
  }

  // if we are receiving a message we requested, we can stop reliability checks
  const expected_sequence = sequences[sequences_count - 1] + 1;
  if (message.sequence !== expected_sequence) {
    for (
      let requesting = expected_sequence;
      requesting < message.sequence;
      requesting++
    ) {
      sequences_requested.push(requesting);
      Byond.sendMessage('chat/resend', requesting);
    }
  }

  pushMessage(message);
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
