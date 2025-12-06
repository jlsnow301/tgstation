import { focusMap } from '../../focus';
import { logger } from '../../logging';
import { suspendRenderer } from '../../renderer';
import { resetStore } from '../store';

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
  resetStore();

  if (suspendInterval) clearInterval(suspendInterval);

  Byond.winset(Byond.windowId, {
    'is-visible': false,
  });

  focusMap();
}
