import { Provider } from 'jotai';
import { useChatPersistance } from './chat/use-chat-persistance';
import { store } from './events/store';
import { useKeepAlive } from './game/use-keep-alive';
import { Panel } from './Panel';

/** Just an expandable wrapper for setup shenanigans and providers */
export function App() {
  useChatPersistance();
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
