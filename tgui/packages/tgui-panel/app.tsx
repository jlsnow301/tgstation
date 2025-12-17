import { Provider } from 'jotai';
import { ChatPortals } from './chat/renderer/chat-portals';
import { store } from './events/store';
import { Panel } from './Panel';

/** Just an expandable wrapper for setup shenanigans and providers */
export function App() {
  return (
    <Provider store={store}>
      <Panel />
      <ChatPortals />
    </Provider>
  );
}
