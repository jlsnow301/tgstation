import { create } from 'zustand';

type BinaryIO = 0 | 1;

type Client = {
  address: string;
  ckey: string;
  computer_id: string;
};

type IFace = {
  layout: string;
  name: string;
};

type TguiWindow = {
  fancy: BinaryIO;
  key: string;
  locked: BinaryIO;
  scale: BinaryIO;
  size: [number, number];
};

type User = {
  name: string;
  observer: number;
};

type Config = {
  client: Client;
  interface: IFace;
  refreshing: BinaryIO;
  status: number;
  title: string;
  user: User;
  window: TguiWindow;
};

export type ConfigState = {
  config: Config;
};

type Action = {
  updateConfig: (update: ConfigState['config']) => void;
  setFancy: (fancy: BinaryIO) => void;
  reset: () => void;
};

export const useConfigStore = create<ConfigState & Action>()((set) => ({
  config: {} as Config,

  updateConfig: (config) => set({ config }),

  reset: () =>
    set((state) => ({
      config: { ...state.config, title: '', status: 1 } as Config,
    })),

  setFancy: (fancy: BinaryIO) =>
    set((state) => ({
      config: { ...state.config, window: { ...state.config.window, fancy } },
    })),
}));
