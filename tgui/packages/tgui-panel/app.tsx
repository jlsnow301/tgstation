import { Provider } from 'jotai';
import { store } from './events/store';
import { useKeepAlive } from './game/hooks';
import { Panel } from './Panel';

/** Just an expandable wrapper for setup shenanigans and providers */
export function App() {
  const keepAlive = useKeepAlive();

  return (
    <Provider store={store}>
      <Panel />
    </Provider>
  );
}
