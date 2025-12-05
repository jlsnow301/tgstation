/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

// Themes
import './styles/main.scss';

import { EventBus } from 'common/eventbus';
import { perf } from 'common/perf';
import { setupGlobalEvents } from 'tgui-core/events';
import { setupHotKeys } from 'tgui-core/hotkeys';
import { setupHotReloading } from 'tgui-dev-server/link/client';

import { App } from './App';
import { listeners } from './events/listeners';
import { captureExternalLinks } from './links';
import { render } from './renderer';

perf.mark('inception', window.performance?.timeOrigin);
perf.mark('init');

export const bus = new EventBus(listeners);

function setupApp() {
  // Delay setup
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupApp);
    return;
  }

  setupGlobalEvents();
  setupHotKeys({
    keyUpVerb: 'KeyUp',
    keyDownVerb: 'KeyDown',
    // In the future you could send a winget here to get mousepos/size from the map here if it's necessary
    verbParamsFn: (verb, key) => `${verb} "${key}" 0 0 0 0`,
  });
  captureExternalLinks();

  Byond.subscribe((type, payload) => bus.dispatch({ type, payload } as any));

  render(<App />);

  // Enable hot module reloading
  if (import.meta.webpackHot) {
    setupHotReloading();
    import.meta.webpackHot.accept(['./layouts', './routes', './App'], () =>
      render(<App />),
    );
  }
}

setupApp();
