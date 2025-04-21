import { create } from 'zustand';

export type QueueState = {
  outgoingPayloadQueues: Record<string, string[]>;
};

type Action = {
  updateQueue: (newQueue: QueueState['outgoingPayloadQueues']) => void;
  reset: () => void;
};

export const useChunkingStore = create<QueueState & Action>()((set) => ({
  outgoingPayloadQueues: {},
  updateQueue: (newQueue) => set({ outgoingPayloadQueues: newQueue }),
  reset: () => set({ outgoingPayloadQueues: {} }),
}));
