import { create } from 'zustand';

export type SharedState = {
  shared: Record<string, any>;
};

type Action = {
  updateShared: (update: SharedState['shared']) => void;
  reset: () => void;
};

export const useSharedStore = create<SharedState & Action>()((set) => ({
  shared: {},
  updateShared: (shared) => set({ shared }),
  reset: () => set({ shared: {} }),
}));
