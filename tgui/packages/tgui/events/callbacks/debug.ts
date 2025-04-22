import { logger } from '../../logging';
import { useDebugStore } from '../stores/debug';

export function toggleKitchenSink(): void {
  useDebugStore.getState().toggleKitchenSink();
}

export function toggleDebugLayout(): void {
  useDebugStore.getState().toggleDebugLayout();
}

export function openExternalBrowser(url: string): void {
  logger.log('opened');
}
