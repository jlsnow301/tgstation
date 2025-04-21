export type ByondMessage = {
  payload: any;
  type: string;
};

export type Callback = (message: ByondMessage) => void;

export type Listeners = Map<string, Callback>;

export class Dispatch {
  private listeners: Listeners = new Map();

  subscribeAll(listeners: Listeners) {
    for (const [type, callback] of listeners.entries()) {
      this.listeners.set(type, callback);
    }
  }

  dispatch(message: ByondMessage) {
    if (this.listeners.has(message.type)) {
      this.listeners.get(message.type)?.(message);
    }
  }
}
