import { chunkingAtom, store } from '../store';

type CreateQueuePayload = {
  id: string;
  chunks: string[];
};

export function createQueue(payload: CreateQueuePayload): void {
  const { id, chunks } = payload;

  store.set(chunkingAtom, (prev) => ({
    ...prev,
    [id]: chunks,
  }));
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
    store.set(chunkingAtom, (prev) => {
      const { [id]: _, ...otherQueues } = prev;
      return otherQueues;
    });
  }
}

export function acknowledgeChunk(payload: OversizePayload): void {
  const { id } = payload;

  store.set(chunkingAtom, (prev) => {
    const { [id]: targetQueue, ...otherQueues } = prev;
    const [_, ...rest] = targetQueue || [];

    return rest.length
      ? {
          ...otherQueues,
          [id]: rest,
        }
      : otherQueues;
  });
  nextChunk(id);
}

function nextChunk(id: string): void {
  const queues = store.get(chunkingAtom);
  const chunk = queues[id]?.[0];

  if (chunk) {
    Byond.sendMessage('payloadChunk', {
      id,
      chunk,
    });
  }
}
