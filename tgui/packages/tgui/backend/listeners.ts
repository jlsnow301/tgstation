import { Callback } from 'common/dispatch';
import { deepEqual } from 'fast-equals';

import { useGameStore } from './stores/game';

export const listeners = new Map<string, Callback>([
  [
    'update',
    (message) => {
      if (!message.payload.data) return;
      const newState = message.payload.data;

      if (!deepEqual(newState, useGameStore.getState())) {
        useGameStore.setState(() => ({ data: newState }));
      }
    },
  ],
]);
