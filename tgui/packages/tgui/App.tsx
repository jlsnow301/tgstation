import { IconProvider } from './Icons';
import { getRoutedComponent } from './routes';

export function App() {
  const Component = getRoutedComponent();

  return (
    <>
      <Component />
      <IconProvider />
    </>
  );
}
