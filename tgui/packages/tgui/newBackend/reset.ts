import { useConfigStore } from './stores/config';
import { useGameStore } from './stores/game';
import { useChunkingStore } from './stores/queues';
import { useSharedStore } from './stores/shared';

export function resetStores() {
  useConfigStore.getState().reset();
  useGameStore.getState().reset();
  useSharedStore.getState().reset();
  useChunkingStore.getState().reset();
}
