import { IconProvider } from './Icons';
import { RoutedComponent } from './routes';

export function App() {
  const Component = RoutedComponent();

  return (
    <>
      <Component />
      <IconProvider />
    </>
  );
}
