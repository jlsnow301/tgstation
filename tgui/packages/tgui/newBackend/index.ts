import { sendAct } from '../backend';
import { useChunkingStore } from './stores/chunking';
import { useConfigStore } from './stores/config';
import { useGameStore } from './stores/game';
import { useSharedStore } from './stores/shared';
import { useWindowStore } from './stores/window';

export function useNewBackend<TData extends Record<string, unknown>>() {
  const config = useConfigStore((state) => state.config);
  const data = useGameStore((state) => state.data);
  const outgoingPayloadQueues = useChunkingStore(
    (state) => state.outgoingPayloadQueues,
  );
  const shared = useSharedStore((state) => state.shared);
  const suspending = useWindowStore((state) => state.suspending);
  const suspended = useWindowStore((state) => state.suspended);

  return {
    act: sendAct,
    config,
    data: data as TData,
    shared,
    outgoingPayloadQueues,
    suspending,
    suspended,
  };
}
