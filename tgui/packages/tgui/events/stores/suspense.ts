import { create } from 'zustand';

type BinaryIO = 0 | 1;

export type WindowState = {
  suspending: BinaryIO;
  suspended: number;
};

type Action = {
  updateSuspending: (suspending: BinaryIO) => void;
  updateSuspended: (suspended: BinaryIO) => void;
  reset: () => void;
};

export const useWindowStore = create<WindowState & Action>()((set) => ({
  suspending: 0,
  suspended: Date.now(),

  updateSuspending: (suspending) => set({ suspending }),

  updateSuspended: (suspended) => set({ suspended }),

  reset: () =>
    set({
      suspending: 0,
      suspended: Date.now(),
    }),
}));
