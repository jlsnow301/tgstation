import type { sendAct } from './act';

export type BinaryIO = 0 | 1;

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

export type Config = {
  client: Client;
  interface: IFace;
  refreshing: BinaryIO;
  status: number;
  title: string;
  user: User;
  window: TguiWindow;
};

type DebugState = {
  debugLayout: boolean;
  kitchenSink: boolean;
};

export type BackendState<TData> = {
  act: typeof sendAct;
  config: Config;
  data: TData;
  debug: DebugState;
  outgoingPayloadQueues: Record<string, string[]>;
  shared: Record<string, any>;
  /** A timestamp. */
  suspended: number;
  suspending: BinaryIO;
};
