import { atom, createStore } from 'jotai';

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

export const chunkingAtom = atom<Record<string, any>>({});
export const configAtom = atom<Config>({} as Config);
export const debugLayoutAtom = atom(false);
export const gameDataAtom = atom<Record<string, any>>({});
export const gameStaticDataAtom = atom<Record<string, any>>({});
export const kitchenSinkAtom = atom(false);
export const outgoingPayloadQueuesAtom = atom<Record<string, string[]>>({});
export const sharedAtom = atom<Record<string, any>>({});
export const suspendedAtom = atom<number>(Date.now());
export const suspendingAtom = atom<BinaryIO>(0);

export const store = createStore();
