import { perf } from 'common/perf';
import { deepEqual } from 'fast-equals';

import { setupDrag } from '../../drag';
import { logger } from '../../logging';
import { resumeRenderer } from '../../renderer';
import { type QueueState, useChunkingStore } from '../stores/chunking';
import { type ConfigState, useConfigStore } from '../stores/config';
import { type GameState, useGameStore } from '../stores/game';
import { type SharedState, useSharedStore } from '../stores/shared';
import { useWindowStore, type WindowState } from '../stores/suspense';

interface UpdatePayload
  extends ConfigState,
    GameState,
    QueueState,
    SharedState,
    WindowState {
  static_data: Record<string, unknown>;
}

export function update(payload: UpdatePayload) {
  setFancy(payload);
  updateData(payload);
  if (useWindowStore.getState().suspended) {
    resume(payload);
  }
}

/** Resumes the tgui window if suspended */
function resume(payload: UpdatePayload) {
  // Show the payload
  logger.log('backend/update', payload);
  // Signal renderer that we have resumed
  resumeRenderer();
  // Setup drag
  setupDrag();
  // We schedule this for the next tick here because resizing and unhiding
  // during the same tick will flash with a white background.
  setTimeout(() => {
    perf.mark('resume/start');
    // Doublecheck if we are not re-suspended.
    const suspended = useWindowStore.getState().suspended;
    if (suspended) {
      return;
    }

    Byond.winset(Byond.windowId, {
      'is-visible': true,
    });
    Byond.sendMessage('visible');
    perf.mark('resume/finish');

    if (process.env.NODE_ENV !== 'production') {
      logger.log('visible in', perf.measure('render/finish', 'resume/finish'));
    }
  });
}

/** React to changes in fancy mode */
function setFancy(payload: UpdatePayload) {
  const fancy = payload.config?.window?.fancy;
  const fancyState = useConfigStore.getState().config.window?.fancy;

  if (fancyState !== fancy) {
    useConfigStore.getState().setFancy(fancy);
    Byond.winset(Byond.windowId, {
      titlebar: !fancy,
      'can-resize': !fancy,
    });
  }
}

/** Delegates update data to the appropriate store */
function updateData(payload: UpdatePayload) {
  const configState = useConfigStore.getState();
  if (!deepEqual(payload.config, configState.config)) {
    configState.updateConfig(payload.config);
  }

  const updateData = { ...payload.data, ...payload.static_data };
  const gameState = useGameStore.getState();
  // If the data has changed, we update it in the game store.
  if (!deepEqual(updateData, gameState.data)) {
    gameState.updateData(updateData);
  }

  const chunkingState = useChunkingStore.getState();
  if (
    !deepEqual(
      payload.outgoingPayloadQueues,
      chunkingState.outgoingPayloadQueues,
    )
  ) {
    chunkingState.create(payload.outgoingPayloadQueues);
  }

  if (payload.shared) {
    const newShared = {} as Record<string, unknown>;

    for (const key in payload.shared) {
      const value = payload.shared[key];
      if (value === '') {
        newShared[key] = undefined;
      } else {
        newShared[key] = JSON.parse(value);
      }
    }
    useSharedStore.getState().updateShared(newShared);
  }
}
