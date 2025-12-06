import { Provider } from 'jotai';
import { store } from './events/store';
import { IconProvider } from './Icons';
import { RoutedComponent } from './routes';

export function App() {
  const Component = RoutedComponent();

  return (
    <Provider store={store}>
      <Component />
      <IconProvider />
    </Provider>
  );
}
