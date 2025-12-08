/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import { store } from '../events/store';
import { connectionLostAtAtom, roundRestartedAtAtom } from './atoms';
import { CONNECTION_LOST_AFTER } from './constants';

let lastPingedAt: number;

setInterval(() => {
  const connectionLostAt = store.get(connectionLostAtAtom);
  if (!connectionLostAt) return;

  const pingsAreFailing =
    lastPingedAt && Date.now() >= lastPingedAt + CONNECTION_LOST_AFTER;
  if (!connectionLostAt && pingsAreFailing) {
    connectionLost();
  }
  if (connectionLostAt && !pingsAreFailing) {
    connectionRestored();
  }
}, 1000);

export function setLastPing() {
  lastPingedAt = Date.now();
}

export function roundrestart() {
  store.set(roundRestartedAtAtom, Date.now());
}

function connectionLost() {
  store.set(connectionLostAtAtom, Date.now());
}

function connectionRestored() {
  store.set(connectionLostAtAtom, null);
}
