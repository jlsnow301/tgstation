import { create } from 'zustand';

export type GameState = {
  data: Record<string, any>;
};

type Action = {
  updateData: (update: GameState['data']) => void;
};

export const useGameStore = create<GameState & Action>()((set) => ({
  data: {},
  updateData: (data) => set({ data }),
}));
