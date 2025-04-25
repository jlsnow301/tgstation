/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

// Themes
import './styles/main.scss';
import './styles/themes/light.scss';

import { perf } from 'common/perf';
import { captureExternalLinks } from 'tgui/links';
import { render } from 'tgui/renderer';
import { EventBus } from 'tgui-core/eventbus';
import { setupGlobalEvents } from 'tgui-core/events';
import { setupHotReloading } from 'tgui-dev-server/link/client.mjs';

import { listeners } from './events/listeners';
import { Panel } from './Panel';
import { setupPanelFocusHacks } from './panelFocus';

perf.mark('inception', window.performance?.timeOrigin);
perf.mark('init');

const bus = new EventBus(listeners);

function setupApp() {
  // Delay setup
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupApp);
    return;
  }

  setupGlobalEvents({
    ignoreWindowFocus: true,
  });

  setupPanelFocusHacks();
  captureExternalLinks();

  // Dispatch incoming messages as store actions
  Byond.subscribe((type, payload) => bus.dispatch({ type, payload } as any));

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

  // Enable hot module reloading
  if (import.meta.webpackHot) {
    setupHotReloading();

    import.meta.webpackHot.accept(
      [
        './audio',
        './chat',
        './game',
        './Notifications',
        './Panel',
        './ping',
        './settings',
        './telemetry',
      ],
      () => render(<Panel />),
    );
  }
}

setupApp();
