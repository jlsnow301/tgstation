import { create } from 'zustand';

type State = {
  shared: Record<string, any>;
};

type Action = {
  updateShared: (update: State['shared']) => void;
};

export const useSharedStore = create<State & Action>()((set) => ({
  shared: {},
  updateShared: (shared) => set({ shared }),
}));
