import { sendAct } from '../backend';
import { useChunkingStore } from './stores/chunking';
import { useConfigStore } from './stores/config';
import { useDebugStore } from './stores/debug';
import { useGameStore } from './stores/game';
import { useSharedStore } from './stores/shared';
import { useWindowStore } from './stores/suspense';

export function useBackend<TData extends Record<string, unknown>>() {
  const config = useConfigStore((state) => state.config);
  const data = useGameStore((state) => state.data);

  const debugLayout = useDebugStore((state) => state.debugLayout);
  const kitchenSink = useDebugStore((state) => state.kitchenSink);

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
    debugLayout,
    kitchenSink,
    shared,
    outgoingPayloadQueues,
    suspending,
    suspended,
  };
}
