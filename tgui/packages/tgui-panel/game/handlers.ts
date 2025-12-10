/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import { store } from '../events/store';
import { roundRestartedAtAtom } from './atoms';

export function roundrestart() {
  store.set(roundRestartedAtAtom, Date.now());
}
