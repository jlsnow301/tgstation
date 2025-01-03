import './styles/main.scss';

import { createRoot, Root } from 'react-dom/client';

import { NewSay } from './NewSay';
import { TguiSay } from './TguiSay';

let reactRoot: Root | null = null;

document.onreadystatechange = function () {
  if (document.readyState !== 'complete') return;

  if (!reactRoot) {
    const root = document.getElementById('react-root');
    reactRoot = createRoot(root!);
  }

  if (Byond.BLINK) {
    reactRoot.render(<NewSay />);
  } else {
    reactRoot.render(<TguiSay />);
  }
};
