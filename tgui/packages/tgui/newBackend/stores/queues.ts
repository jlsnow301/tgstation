import { create } from 'zustand';

export type QueueState = {
  outgoingPayloadQueues: Record<string, any[]>;
};

type Action = {
  updatePayloadQues: (newQueue: QueueState['outgoingPayloadQueues']) => void;
};

export const useChunkingStore = create<QueueState & Action>()((set) => ({
  outgoingPayloadQueues: {},
  updatePayloadQues: (newQueue) => set({ outgoingPayloadQueues: newQueue }),
}));
