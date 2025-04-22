/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import { useSelector } from '../oldBackend';
import { selectDebug } from './selectors';

export function useDebug() {
  return useSelector(selectDebug);
}
