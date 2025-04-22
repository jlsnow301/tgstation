import { create } from 'zustand';

export type DebugState = {
  kitchenSink: boolean;
  debugLayout: boolean;
};

type Action = {
  toggleKitchenSink: () => void;
  toggleDebugLayout: () => void;
  reset: () => void;
};

export const useDebugStore = create<DebugState & Action>()((set) => ({
  kitchenSink: false,
  debugLayout: false,

  toggleKitchenSink: () =>
    set((state) => ({
      kitchenSink: !state.kitchenSink,
    })),

  toggleDebugLayout: () =>
    set((state) => ({
      debugLayout: !state.debugLayout,
    })),

  reset: () =>
    set({
      kitchenSink: false,
      debugLayout: false,
    }),
}));
