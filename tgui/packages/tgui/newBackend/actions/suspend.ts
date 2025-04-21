import { throttle } from 'tgui-core/timer';

import { focusMap } from '../../focus';
import { logger } from '../../logging';
import { suspendRenderer } from '../../renderer';
import { resetStores } from '../reset';

let suspendInterval: NodeJS.Timeout | null = null;

const TWO_SECONDS = 2000;

const suspend = throttle(() => {
  Byond.sendMessage('suspend');
}, TWO_SECONDS);

export function suspendStart() {
  if (suspendInterval) return;

  logger.log(`suspending (${Byond.windowId})`);

  suspend();
  suspendInterval = setInterval(suspend, TWO_SECONDS);
}

export function suspendFinish() {
  suspendRenderer();
  resetStores();

  if (suspendInterval) clearInterval(suspendInterval);

  Byond.winset(Byond.windowId, {
    'is-visible': false,
  });

  focusMap();
}
