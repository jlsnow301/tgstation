import { create } from 'zustand';

export type QueueState = {
  outgoingPayloadQueues: Record<string, string[]>;
};

type Action = {
  create: (newQueue: QueueState['outgoingPayloadQueues']) => void;
  dequeue: (id: string) => void;
  remove: (id: string) => void;
  reset: () => void;
};

export const useChunkingStore = create<QueueState & Action>()((set) => ({
  outgoingPayloadQueues: {},

  create: (newQueue) =>
    set((state) => {
      const { outgoingPayloadQueues } = state;

      return {
        outgoingPayloadQueues: {
          ...outgoingPayloadQueues,
          ...newQueue,
        },
      };
    }),

  dequeue: (id) =>
    set((state) => {
      const { outgoingPayloadQueues } = state;
      const { [id]: targetQueue, ...otherQueues } = outgoingPayloadQueues;
      const [_, ...rest] = targetQueue || [];

      return {
        outgoingPayloadQueues: rest.length
          ? {
              ...otherQueues,
              [id]: rest,
            }
          : otherQueues,
      };
    }),

  remove: (id) =>
    set((state) => {
      const { outgoingPayloadQueues } = state;
      const { [id]: _, ...otherQueues } = outgoingPayloadQueues;
      return {
        outgoingPayloadQueues: otherQueues,
      };
    }),

  reset: () => set({ outgoingPayloadQueues: {} }),
}));
