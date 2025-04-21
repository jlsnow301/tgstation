import { Callback } from 'common/dispatch';

import { ping } from './actions/ping';
import { suspendFinish, suspendStart } from './actions/suspend';
import { gameUpdate } from './actions/update';

export const listeners = new Map<string, Callback>([
  ['update', gameUpdate],
  ['ping', ping],
  ['suspendStart', suspendStart],
  ['suspend', suspendFinish],
]);
