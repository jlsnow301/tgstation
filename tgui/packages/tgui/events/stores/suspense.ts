import { create } from 'zustand';

type BinaryIO = 0 | 1;

export type WindowState = {
  suspending: BinaryIO;
  suspended: number;
};

type Action = {
  updateSuspended: (suspended: BinaryIO) => void;
  updateSuspending: (suspending: BinaryIO) => void;
  reset: () => void;
};

export const useWindowStore = create<WindowState & Action>()((set) => ({
  suspended: Date.now(),
  suspending: 0,

  updateSuspended: (suspended) => set({ suspended }),

  updateSuspending: (suspending) => set({ suspending }),

  reset: () =>
    set({
      suspending: 0,
      suspended: Date.now(),
    }),
}));
