import { atom } from 'jotai';

export const roundRestartedAtAtom = atom<number | null>(null);
export const connectionLostAtAtom = atom<number | null>(null);

//------- Convenience --------------------------------------------------------//

export const gameAtom = atom((get) => ({
  roundRestartedAt: get(roundRestartedAtAtom),
  connectionLostAt: get(connectionLostAtAtom),
}));
