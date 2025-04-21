import { create } from 'zustand';

export type SharedState = {
  shared: Record<string, any>;
};

type Action = {
  updateShared: (update: SharedState['shared']) => void;
};

export const useSharedStore = create<SharedState & Action>()((set) => ({
  shared: {},
  updateShared: (shared) => set({ shared }),
}));
