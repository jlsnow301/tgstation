import { ByondMessage } from 'common/dispatch';

import { useChunkingStore } from '../stores/chunking';

type CreatePayload = {
  id: string;
  chunks: string[];
};

export function createQueue(message: ByondMessage<CreatePayload>) {
  const {
    payload: { id, chunks },
  } = message;

  useChunkingStore.getState().create({ [id]: chunks });
}

type OversizePayload = {
  allow: boolean;
  id: string;
};

export function oversizeResponse(message: ByondMessage<OversizePayload>) {
  const {
    payload: { allow, id },
  } = message;

  if (allow) {
    nextChunk(id);
  } else {
    useChunkingStore.getState().remove(id);
  }
}

export function acknowledgeChunk(message: ByondMessage<OversizePayload>) {
  const {
    payload: { id },
  } = message;

  useChunkingStore.getState().dequeue(id);
  nextChunk(id);
}

function nextChunk(id: string) {
  const chunk = useChunkingStore.getState().outgoingPayloadQueues[id][0];

  Byond.sendMessage('payloadChunk', {
    id,
    chunk,
  });
}
