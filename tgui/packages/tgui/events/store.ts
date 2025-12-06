import { atom, createStore } from 'jotai';
import type { BinaryIO, Config } from './types';

export const chunkingAtom = atom<Record<string, any>>({});
export const configAtom = atom<Config>({} as Config);
export const debugLayoutAtom = atom(false);
export const gameDataAtom = atom<Record<string, any>>({});
export const gameStaticDataAtom = atom<Record<string, any>>({});
export const kitchenSinkAtom = atom(false);
export const outgoingPayloadQueuesAtom = atom<Record<string, string[]>>({});
export const sharedAtom = atom<Record<string, any>>({});
export const suspendedAtom = atom<number>(0);
export const suspendingAtom = atom<BinaryIO>(0);

export const backendStateAtom = atom((get) => ({
  config: get(configAtom),
  data: {
    ...get(gameDataAtom),
    ...get(gameStaticDataAtom),
  },
  debug: {
    debugLayout: get(debugLayoutAtom),
    kitchenSink: get(kitchenSinkAtom),
  },
  outgoingPayloadQueues: get(outgoingPayloadQueuesAtom),
  shared: get(sharedAtom),
  staticData: get(gameStaticDataAtom),
  suspended: get(suspendedAtom),
  suspending: get(suspendingAtom),
}));

export const store = createStore();

export function resetStore() {
  store.set(chunkingAtom, {});
  store.set(configAtom, {} as Config);
  store.set(debugLayoutAtom, false);
  store.set(gameDataAtom, {});
  store.set(gameStaticDataAtom, {});
  store.set(kitchenSinkAtom, false);
  store.set(outgoingPayloadQueuesAtom, {});
  store.set(sharedAtom, {});
  store.set(suspendedAtom, 0);
  store.set(suspendingAtom, 0);
}
