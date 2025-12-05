import { logger } from '../../logging';
import { debugLayoutAtom, kitchenSinkAtom, store } from '../store';

export function toggleKitchenSink(): void {
  store.set(kitchenSinkAtom, (prev) => !prev);
}

export function toggleDebugLayout(): void {
  store.set(debugLayoutAtom, (prev) => !prev);
}

export function openExternalBrowser(url: string): void {
  logger.log('opened');
}
