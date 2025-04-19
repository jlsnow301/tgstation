export type ByondMessage = {
  payload: any;
  type: string;
};

export type Callback = (message: ByondMessage) => void;

export type Listeners = Map<string, Callback>;

export function storeDispatch(message: ByondMessage, listeners: Listeners) {
  if (listeners.has(message.type)) {
    listeners.get(message.type)?.(message);
  }
}
