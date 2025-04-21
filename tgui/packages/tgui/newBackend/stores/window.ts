import { create } from 'zustand';

type BinaryIO = 0 | 1;

export type WindowState = {
  suspending: BinaryIO;
  suspended: BinaryIO;
};

type Action = {
  updateSuspending: (suspending: BinaryIO) => void;
  updateSuspended: (suspended: BinaryIO) => void;
};

export const useWindowStore = create<WindowState & Action>()((set) => ({
  suspending: 0,
  suspended: 0,
  updateSuspending: (suspending) => set({ suspending }),
  updateSuspended: (suspended) => set({ suspended }),
}));
