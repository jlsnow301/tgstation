import { ByondMessage } from 'common/dispatch';
import { deepEqual } from 'fast-equals';

import { logger } from '../../logging';
import { type ConfigState, useConfigStore } from '../stores/config';
import { type GameState, useGameStore } from '../stores/game';
import { type QueueState, useChunkingStore } from '../stores/queues';
import { type SharedState, useSharedStore } from '../stores/shared';
import { useWindowStore, type WindowState } from '../stores/window';

type UpdatePayload = ConfigState &
  GameState &
  QueueState &
  SharedState &
  WindowState;

export function gameUpdate(message: ByondMessage) {
  const payload = message.payload as UpdatePayload | undefined;
  if (!payload) return;

  if (!deepEqual(payload.config, useConfigStore.getState().config)) {
    logger.log('config');
    useConfigStore.setState(() => ({ config: payload.config }));
  }

  if (!deepEqual(payload.data, useGameStore.getState().data)) {
    logger.log('data');
    useGameStore.setState(() => ({ data: payload.data }));
  }

  if (
    !deepEqual(
      payload.outgoingPayloadQueues,
      useChunkingStore.getState().outgoingPayloadQueues,
    )
  ) {
    logger.log('outgoingPayloadQueues');
    useChunkingStore.setState(() => ({
      outgoingPayloadQueues: payload.outgoingPayloadQueues,
    }));
  }

  if (!deepEqual(payload.shared, useSharedStore.getState().shared)) {
    logger.log('shared');
    useSharedStore.setState(() => ({ shared: payload.shared }));
  }

  if (payload.suspending !== useWindowStore.getState().suspending) {
    logger.log('suspending');
    useWindowStore.setState(() => ({ suspending: payload.suspending }));
  }

  if (payload.suspended !== useWindowStore.getState().suspended) {
    logger.log('suspended');
    useWindowStore.setState(() => ({ suspended: payload.suspended }));
  }
}
