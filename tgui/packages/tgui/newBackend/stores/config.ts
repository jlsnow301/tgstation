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
};

export const useConfigStore = create<ConfigState & Action>()((set) => ({
  config: {} as Config,
  updateConfig: (config) => set({ config }),
}));
