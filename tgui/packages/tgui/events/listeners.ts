import { loadMappings, loadStyleSheet } from './callbacks/assets';
import {
  acknowledgeChunk,
  createQueue,
  oversizeResponse,
} from './callbacks/chunking';
import {
  openExternalBrowser,
  toggleDebugLayout,
  toggleKitchenSink,
} from './callbacks/debug';
import { ping } from './callbacks/ping';
import { suspend, suspendStart } from './callbacks/suspense';
import { update } from './callbacks/update';

/**
 * A string/callback map.
 * Ideally, these reference a function named after the respective event type.
 */
export const listeners = {
  // Assets
  'asset/mappings': loadMappings,
  'asset/stylesheet': loadStyleSheet,
  // Standard window events
  ping,
  suspend,
  suspendStart,
  update,
  // Chunking
  acknowledgeChunk,
  createQueue,
  oversizeResponse,
  // Debug
  openExternalBrowser,
  toggleDebugLayout,
  toggleKitchenSink,
} as const;
