import { create } from 'zustand';

type State = {
  outgoingPayloadQueues: Record<string, any[]>;
};

type Action = {
  updatePayloadQues: (newQueue: State['outgoingPayloadQueues']) => void;
};

export const useChunkingStore = create<State & Action>()((set) => ({
  outgoingPayloadQueues: {},
  updatePayloadQues: (newQueue) => set({ outgoingPayloadQueues: newQueue }),
}));
