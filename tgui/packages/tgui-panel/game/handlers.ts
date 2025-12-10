/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import { store } from '../events/store';
import { connectionLostAtAtom, roundRestartedAtAtom } from './atoms';

export let lastPingedAt: number;

export function setLastPing() {
  lastPingedAt = Date.now();
}

export function roundrestart() {
  store.set(roundRestartedAtAtom, Date.now());
}

export function connectionLost() {
  store.set(connectionLostAtAtom, Date.now());
}

export function connectionRestored() {
  store.set(connectionLostAtAtom, null);
}
