import { useEffect } from 'react';
import { store } from '../events/store';
import { connectionLostAtAtom } from './atoms';
import { CONNECTION_LOST_AFTER } from './constants';
import { connectionLost, connectionRestored, lastPingedAt } from './handlers';

/** React hook to periodically get UI status */
export function useKeepAlive() {
  useEffect(() => {
    const interval = setInterval(() => {
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

    return () => clearInterval(interval);
  }, []);
}
