import { atom, createStore } from 'jotai';
import type { Meta } from './types';

// Audio
export const playingAtom = atom(false);
export const visibleAtom = atom(false);
export const metaAtom = atom<Meta | null>(null);

export const store = createStore();

