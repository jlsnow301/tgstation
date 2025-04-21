import { ByondMessage } from 'common/dispatch';
import { throttle } from 'tgui-core/timer';

import { focusMap } from '../../focus';
import { logger } from '../../logging';
import { suspendRenderer } from '../../renderer';
import { useChunkingStore } from '../stores/chunking';
import { useConfigStore } from '../stores/config';
import { useGameStore } from '../stores/game';
import { useSharedStore } from '../stores/shared';
import { useWindowStore } from '../stores/window';

let suspendInterval: NodeJS.Timeout | null = null;

const TWO_SECONDS = 2000;

const suspend = throttle(() => {
  Byond.sendMessage('suspend');
}, TWO_SECONDS);

/** Signals Byond to dismiss the window */
export function suspendStart() {
  if (suspendInterval) return;

  logger.log(`suspending (${Byond.windowId})`);

  suspend();
  suspendInterval = setInterval(suspend, TWO_SECONDS);
}

type SuspendFinishPayload = {
  timestamp: number;
};

/** Resets all state and refocuses window */
export function suspendFinish(message: ByondMessage<SuspendFinishPayload>) {
  const {
    payload: { timestamp },
  } = message;

  suspendRenderer();

  useConfigStore.getState().reset();
  useGameStore.getState().reset();
  useSharedStore.getState().reset();
  useChunkingStore.getState().reset();
  useWindowStore.getState().reset(timestamp);

  if (suspendInterval) clearInterval(suspendInterval);

  Byond.winset(Byond.windowId, {
    'is-visible': false,
  });

  focusMap();
}
