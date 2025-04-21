import { create } from 'zustand';

type BinaryIO = 0 | 1;

export type WindowState = {
  suspending: BinaryIO;
  suspended: number;
};

type Action = {
  updateSuspending: (suspending: BinaryIO) => void;
  updateSuspended: (suspended: BinaryIO) => void;
  reset: (timestamp: number) => void;
};

export const useWindowStore = create<WindowState & Action>()((set) => ({
  suspending: 0,
  suspended: 0,
  updateSuspending: (suspending) => set({ suspending }),
  updateSuspended: (suspended) => set({ suspended }),
  reset: (timestamp: number) =>
    set({
      suspending: 0,
      suspended: timestamp,
    }),
}));
