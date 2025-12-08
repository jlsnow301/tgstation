import { atom } from 'jotai';

export const roundIdAtom = atom<number | null>(null);
export const roundTimeAtom = atom<number | null>(null);
export const roundRestartedAtAtom = atom<number | null>(null);
export const connectionLostAtAtom = atom<number | null>(null);

//------- Convenience --------------------------------------------------------//

export const gameAtom = atom((get) => ({
  roundId: get(roundIdAtom),
  roundTime: get(roundTimeAtom),
  roundRestartedAt: get(roundRestartedAtAtom),
  connectionLostAt: get(connectionLostAtAtom),
}));
