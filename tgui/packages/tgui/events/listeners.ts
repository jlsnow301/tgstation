import { loadMappings, loadStyleSheet } from './handlers/assets';
import {
  acknowledgeChunk,
  createQueue,
  oversizeResponse,
} from './handlers/chunking';
import {
  openExternalBrowser,
  toggleDebugLayout,
  toggleKitchenSink,
} from './handlers/debug';
import { ping } from './handlers/ping';
import { setSharedState } from './handlers/shared';
import { suspend, suspendStart } from './handlers/suspense';
import { update } from './handlers/update';

/**
 * A string/handler map.
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
  // Shared States
  setSharedState,
} as const;
