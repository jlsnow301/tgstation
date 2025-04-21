import { ByondMessage } from 'common/dispatch';
import { perf } from 'common/perf';
import { deepEqual } from 'fast-equals';

import { setupDrag } from '../../drag';
import { logger } from '../../logging';
import { resumeRenderer } from '../../renderer';
import { type QueueState, useChunkingStore } from '../stores/chunking';
import { type ConfigState, useConfigStore } from '../stores/config';
import { type GameState, useGameStore } from '../stores/game';
import { type SharedState, useSharedStore } from '../stores/shared';
import { useWindowStore, type WindowState } from '../stores/window';

interface UpdatePayload
  extends ConfigState,
    GameState,
    QueueState,
    SharedState,
    WindowState {
  static_data: Record<string, unknown>;
}

export function handleUpdate(message: ByondMessage<UpdatePayload>) {
  const { payload } = message;
  const { suspended } = useWindowStore.getState();

  setFancy(payload);
  updateData(payload);
  if (suspended) {
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
    const { suspended } = useWindowStore.getState();
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
    logger.log('changing fancy mode to', fancy);
    useConfigStore.getState().setFancy(fancy);
    Byond.winset(Byond.windowId, {
      titlebar: !fancy,
      'can-resize': !fancy,
    });
  }
}

/** Delegates update data to the appropriate store */
function updateData(payload: UpdatePayload) {
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
    useChunkingStore.getState().create(payload.outgoingPayloadQueues);
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
    useSharedStore.setState(() => ({ shared: newShared }));
  }
}
