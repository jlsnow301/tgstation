import { Provider } from 'jotai';
import { captureExternalLinks } from 'tgui/links';
import { EventBus } from 'tgui-core/eventbus';
import { setupGlobalEvents } from 'tgui-core/events';
import { listeners } from './events/listeners';
import { store } from './events/store';
import { Panel } from './Panel';
import { setupPanelFocusHacks } from './panelFocus';

const bus = new EventBus(listeners);

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

/** Just an expandable wrapper for setup shenanigans and providers */
export function App() {
  return (
    <Provider store={store}>
      <Panel />
    </Provider>
  );
}
