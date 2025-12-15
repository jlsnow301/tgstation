/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import './styles/main.scss';
import './styles/themes/light.scss';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';

createRoot(document.getElementById('react-root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
