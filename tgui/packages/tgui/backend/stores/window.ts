import { create } from 'zustand';

type BinaryIO = 0 | 1;

type TguiWindow = {
  suspending: BinaryIO;
  suspended: BinaryIO;
};

type State = {
  window: TguiWindow;
};

type Action = {
  updateWindow: (update: State['window']) => void;
};

export const useWindowStore = create<State & Action>()((set) => ({
  window: {} as TguiWindow,
  updateWindow: (window) => set({ window }),
}));
