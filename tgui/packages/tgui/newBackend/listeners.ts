import { Callback } from 'common/dispatch';

import {
  acknowledgeChunk,
  createQueue,
  oversizeResponse,
} from './callbacks/chunking';
import { ping } from './callbacks/ping';
import { suspendFinish, suspendStart } from './callbacks/suspend';
import { handleUpdate } from './callbacks/update';

export const listeners = new Map<string, Callback<unknown>>([
  ['acknowledgeChunk', acknowledgeChunk],
  ['createQueue', createQueue],
  ['oversizeResponse', oversizeResponse],
  ['ping', ping],
  ['suspend', suspendFinish],
  ['suspendStart', suspendStart],
  ['update', handleUpdate],
]);
