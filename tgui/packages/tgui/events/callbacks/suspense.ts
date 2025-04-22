import { focusMap } from '../../focus';
import { logger } from '../../logging';
import { suspendRenderer } from '../../renderer';
import { useChunkingStore } from '../stores/chunking';
import { useConfigStore } from '../stores/config';
import { useDebugStore } from '../stores/debug';
import { useGameStore } from '../stores/game';
import { useSharedStore } from '../stores/shared';
import { useWindowStore } from '../stores/suspense';

let suspendInterval: NodeJS.Timeout | null = null;

const TWO_SECONDS = 2000;

function suspendMsg(): void {
  Byond.sendMessage('suspend');
}

/** Signals Byond to dismiss the window */
export function suspendStart(): void {
  if (suspendInterval) clearInterval(suspendInterval);

  logger.log(`suspending (${Byond.windowId})`);
  suspendMsg();
  suspendInterval = setInterval(suspendMsg, TWO_SECONDS);
}

/** Resets all state and refocuses byond window */
export function suspend(): void {
  suspendRenderer();

  useConfigStore.getState().reset();
  useDebugStore.getState().reset();
  useGameStore.getState().reset();
  useSharedStore.getState().reset();
  useChunkingStore.getState().reset();
  useWindowStore.getState().reset();

  if (suspendInterval) clearInterval(suspendInterval);

  Byond.winset(Byond.windowId, {
    'is-visible': false,
  });

  focusMap();
}
