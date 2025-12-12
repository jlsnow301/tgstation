import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { connectionLostAtAtom } from './atoms';
import { CONNECTION_LOST_AFTER } from './constants';

let lastPingedAt: number;

export function setLastPing() {
  lastPingedAt = Date.now();
}

/** React hook to periodically get UI status */
export function useKeepAlive() {
  const [connectionLostAt, setConnectionLostAt] = useAtom(connectionLostAtAtom);

  useEffect(() => {
    const interval = setInterval(() => {
      const pingsAreFailing =
        lastPingedAt && Date.now() >= lastPingedAt + CONNECTION_LOST_AFTER;
      if (!connectionLostAt && pingsAreFailing) {
        setConnectionLostAt(Date.now());
      }
      if (connectionLostAt && !pingsAreFailing) {
        setConnectionLostAt(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);
}
