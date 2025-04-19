import { create } from 'zustand';

type State = {
  data: Record<string, any>;
};

type Action = {
  updateData: (update: State['data']) => void;
};

export const useGameStore = create<State & Action>()((set) => ({
  data: {},
  updateData: (data) => set({ data }),
}));
