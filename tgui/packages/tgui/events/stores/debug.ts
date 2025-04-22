import { create } from 'zustand';

export type DebugState = {
  debugLayout: boolean;
  kitchenSink: boolean;
};

type Action = {
  toggleDebugLayout: () => void;
  toggleKitchenSink: () => void;
  reset: () => void;
};

export const useDebugStore = create<DebugState & Action>()((set) => ({
  debugLayout: false,
  kitchenSink: false,

  toggleDebugLayout: () =>
    set((state) => ({
      debugLayout: !state.debugLayout,
    })),

  toggleKitchenSink: () =>
    set((state) => ({
      kitchenSink: !state.kitchenSink,
    })),

  reset: () =>
    set({
      debugLayout: false,
      kitchenSink: false,
    }),
}));
