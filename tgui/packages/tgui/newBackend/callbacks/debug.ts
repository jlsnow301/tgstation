import { logger } from '../../logging';
import { useDebugStore } from '../stores/debug';

export function toggleKitchenSink() {
  useDebugStore.getState().toggleKitchenSink();
}

export function toggleDebugLayout() {
  useDebugStore.getState().toggleDebugLayout();
}

export function openExternalBrowser(url: string) {
  logger.log('opened');
}
