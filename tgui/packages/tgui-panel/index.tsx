/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

// Themes
import './styles/main.scss';
import './styles/themes/light.scss';
import { perf } from 'common/perf';
import { setGlobalStore } from 'tgui/backend';
import { captureExternalLinks } from 'tgui/links';
import { render } from 'tgui/renderer';
import { configureStore } from 'tgui/store';
import { EventBus } from 'tgui-core/eventbus';
import { setupGlobalEvents } from 'tgui-core/events';
import { setupHotReloading } from 'tgui-dev-server/link/client';
import { App } from './app';
import { listeners } from './events/listeners';
import { setupPanelFocusHacks } from './panelFocus';

perf.mark('inception', window.performance?.timeOrigin);
perf.mark('init');

const bus = new EventBus(listeners);
const store = configureStore();

function setupApp() {
  // Delay setup
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupApp);
    return;
  }

  setGlobalStore(store);

  setupGlobalEvents({
    ignoreWindowFocus: true,
  });

  setupPanelFocusHacks();
  captureExternalLinks();

  // Dispatch incoming messages as store actions
  Byond.subscribe((type, payload) => bus.dispatch({ type, payload }));

  // Unhide the panel
  Byond.winset('output_selector.legacy_output_selector', {
    left: 'output_browser',
  });

  // Resize the panel to match the non-browser output
  Byond.winget('output').then((output: { size: string }) => {
    Byond.winset('browseroutput', {
      size: output.size,
    });
  });

  store.subscribe(() => render(<App />));

  // Enable hot module reloading
  if (import.meta.webpackHot) {
    setupHotReloading();

    import.meta.webpackHot.accept(['./Notifications', './Panel'], () => {
      render(<App />);
    });
  }
}

setupApp();
