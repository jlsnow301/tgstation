import { z } from '@zod/mini';

import { logger } from '../logging';
import { useConfigStore } from './stores/config';
import { useGameStore } from './stores/game';
import { useChunkingStore } from './stores/queues';
import { useSharedStore } from './stores/shared';
import { useWindowStore } from './stores/window';

export function useBackend<TData>(schema?: z.ZodMiniJSONSchema) {
  const config = useConfigStore((state) => state.config);
  const data = useGameStore((state) => state.data);
  const outgoingPayloadQueues = useChunkingStore(
    (state) => state.outgoingPayloadQueues,
  );
  const shared = useSharedStore((state) => state.shared);
  const suspending = useWindowStore((state) => state.window.suspending);
  const suspended = useWindowStore((state) => state.window.suspended);

  if (schema) {
    const result = schema.safeParse(data);
    if (!result.success) {
      logger.log('Invalid data received from backend', result.error.message);
    }
  }

  return {
    config,
    data: data as TData, // if you insist!
    shared,
    outgoingPayloadQueues,
    suspending,
    suspended,
  };
}
