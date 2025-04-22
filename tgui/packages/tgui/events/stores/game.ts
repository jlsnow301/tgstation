import { create } from 'zustand';

export type GameState = {
  data: Record<string, any>;
  static_data: Record<string, any>;
};

type Action = {
  fullUpdate: (both: GameState) => void;
  updateData: (update: GameState['data']) => void;
  reset: () => void;
};

export const useGameStore = create<GameState & Action>()((set) => ({
  data: {},
  static_data: {},

  fullUpdate: (all) => set({ data: all.data, static_data: all.static_data }),
  updateData: (data) => set({ data }),

  reset: () => set({ data: {}, static_data: {} }),
}));
