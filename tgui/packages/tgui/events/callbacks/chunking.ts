import { useChunkingStore } from '../stores/chunking';

type CreateQueuePayload = {
  id: string;
  chunks: string[];
};

export function createQueue(payload: CreateQueuePayload): void {
  const { id, chunks } = payload;

  useChunkingStore.getState().create({
    [id]: chunks,
  });
}

type OversizePayload = {
  allow: boolean;
  id: string;
};

export function oversizeResponse(payload: OversizePayload): void {
  const { allow, id } = payload;

  if (allow) {
    nextChunk(id);
  } else {
    useChunkingStore.getState().remove(id);
  }
}

export function acknowledgeChunk(payload: OversizePayload): void {
  const { id } = payload;

  useChunkingStore.getState().dequeue(id);
  nextChunk(id);
}

function nextChunk(id: string): void {
  const chunk = useChunkingStore.getState().outgoingPayloadQueues[id][0];

  Byond.sendMessage('payloadChunk', {
    id,
    chunk,
  });
}
