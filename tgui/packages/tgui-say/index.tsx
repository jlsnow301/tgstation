import './styles/main.scss';

import { createRoot, Root } from 'react-dom/client';

import { TguiSay } from './TguiSay';

let reactRoot: Root | null = null;

function renderApp() {
  if (!reactRoot) {
    const root = document.getElementById('react-root');
    reactRoot = createRoot(root!);
  }

  // reactRoot.render(<div>React is working</div>);
  reactRoot.render(<TguiSay />);
}

const setupApp = () => {
  // Delay setup
  // if (document.readyState === 'loading') {
  //   document.addEventListener('DOMContentLoaded', setupApp);
  //   return;
  // }
  setTimeout(() => {
    renderApp();
  }, 1000);

  // renderApp();
};

setupApp();
