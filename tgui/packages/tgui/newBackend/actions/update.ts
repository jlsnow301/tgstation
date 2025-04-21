import { ByondMessage } from 'common/dispatch';
import { deepEqual } from 'fast-equals';

import { type ConfigState, useConfigStore } from '../stores/config';
import { type GameState, useGameStore } from '../stores/game';
import { type QueueState, useChunkingStore } from '../stores/queues';
import { type SharedState, useSharedStore } from '../stores/shared';
import { type WindowState } from '../stores/window';

type UpdatePayload = ConfigState &
  GameState &
  QueueState &
  SharedState &
  WindowState & {
    static_data: Record<string, unknown>;
  };

export function gameUpdate(message: ByondMessage) {
  const payload = message.payload as UpdatePayload | undefined;
  if (!payload) return;

  if (!deepEqual(payload.config, useConfigStore.getState().config)) {
    useConfigStore.getState().updateConfig(payload.config);
  }

  const updateData = { ...payload.data, ...payload.static_data };
  if (!deepEqual(updateData, useGameStore.getState().data)) {
    useGameStore.getState().updateData(updateData);
  }

  if (
    !deepEqual(
      payload.outgoingPayloadQueues,
      useChunkingStore.getState().outgoingPayloadQueues,
    )
  ) {
    useChunkingStore.getState().updateQueue(payload.outgoingPayloadQueues);
  }

  if (
    payload.shared &&
    !deepEqual(payload.shared, useSharedStore.getState().shared)
  ) {
    useSharedStore.setState(() => ({ shared: payload.shared }));
  }
}
