import { chatRenderer } from '../../chat/renderer';

type ChatPayload = {
  sequence: number;
  content: string;
};

const sequences: number[] = [];
const sequences_requested: number[] = [];

export function chatMessage(payload: ChatPayload) {
  const parsed = JSON.parse(payload as any).catch((err) => {
    console.error('Failed to parse chat message payload:', err);
    return null;
  });

  const sequence: number = parsed.sequence;
  if (sequences.includes(sequence)) {
    return;
  }

  const sequence_count = sequences.length;
  seq_check: if (sequence_count > 0) {
    if (sequences_requested.includes(sequence)) {
      sequences_requested.splice(sequences_requested.indexOf(sequence), 1);
      // if we are receiving a message we requested, we can stop reliability checks
      break seq_check;
    }

    // cannot do reliability if we don't have any messages
    const expected_sequence = sequences[sequence_count - 1] + 1;
    if (sequence !== expected_sequence) {
      for (
        let requesting = expected_sequence;
        requesting < sequence;
        requesting++
      ) {
        sequences_requested.push(requesting);
        Byond.sendMessage('chat/resend', requesting);
      }
    }
  }

  chatRenderer.processBatch([parsed.content]);
  sequences.push(sequence);
  return;
}
