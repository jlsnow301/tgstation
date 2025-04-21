import { Callback } from 'common/dispatch';

import { gameUpdate } from './actions/update';

export const listeners = new Map<string, Callback>([['update', gameUpdate]]);
