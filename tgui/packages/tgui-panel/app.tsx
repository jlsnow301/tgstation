import { Provider } from 'jotai';
import { store } from './events/store';
import { useKeepAlive } from './game/hooks';
import { Panel } from './Panel';

/** Just an expandable wrapper for setup shenanigans and providers */
export function App() {
  useKeepAlive();

  if (process.env.NODE_ENV !== 'production') {
    const { useDebug, KitchenSink } = require('tgui/debug');
    const debug = useDebug();
    if (debug.kitchenSink) {
      return <KitchenSink panel />;
    }
  }

  return (
    <Provider store={store}>
      <Panel />
    </Provider>
  );
}
