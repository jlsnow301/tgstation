export type ByondMessage<TPayload> = {
  payload: TPayload;
  type: string;
};

export type Callback<TPayload> = (message: ByondMessage<TPayload>) => void;

export type Listeners = Map<string, Callback<any>>;

/**
 * Handles different event messages from both byond and TGUI.
 *
 * Create a map of listeners, then dispatch events as needed.
 *
 * @example
 * ```ts
 * const bus = new Dispatch();
 *
 * // These are the event types and their corresponding callbacks.
 * const listeners: Listeners = new Map([
 *   ['messageType', (message) => { logger.log(message.payload); }],
 * ]);
 *
 * bus.subscribeAll(listeners);
 *
 * // Later, dispatch a message:
 * const message: ByondMessage = {
 *   type: 'messageType',
 *   payload: { text: 'Hello, world!' },
 * };
 *
 * bus.dispatch(message);
 * ```
 */
export class Dispatch {
  private listeners: Listeners = new Map();

  /** Subscribe to a map of listeners. This affects what dispatch handles. */
  subscribeAll(listeners: Listeners) {
    for (const [type, callback] of listeners.entries()) {
      this.listeners.set(type, callback);
    }
  }

  /** Dispatch a message to the appropriate listener. */
  dispatch(message: ByondMessage<unknown>) {
    if (this.listeners.has(message.type)) {
      this.listeners.get(message.type)?.(message);
    }
  }
}
