# Tgui event dispatch

## Philosophy

This event system is designed to stay as close to vanilla JavaScript as possible. It uses a plain object to map event types to their respective handlers. Handlers can be swapped out or the store solution replaced entirely with minimal effort.

It avoids using action creators, modular reducers, or distinguishing middleware. The abstractions are kept intentionally simple. The sole goal is to process an event and allow the handler to directly mutate the state, whether it's from the store or Byond.

## Usage

1. Creating your event handler:
   > events/callbacks/someFunc.ts

```ts
type ExpectedPayload = {
  greeting: string;
};

export function someFunc(payload: ExpectedPayload) {
  // Do something with the payload
  logger.log('Received: ', payload.greeting);
}
```

2. Registering the event handler:
   > events/listeners.ts

```ts
import { someFunc } from 'callbacks/someFunc';

export const listeners = {
  eventType: someFunc,
} as const;
```

3. Configuring your event dispatch
   > index.tsx

```ts
import { EventBus } from 'common/eventbus';
import { listeners } from 'events/listeners';

const busName = new EventBus(listeners);
```

4. Subscribe to byond events
   > index.tsx

```ts
/// somewhere in setup logic
Byond.subscribe((type, payload) => busName.dispatch({ type, payload } as any));
```

Why use 'as any'? While the dispatch event is typesafe, messages from external sources are unpredictable. The typesafety is primarily for manually dispatched events. For example, clicking the X button on a window triggers the 'suspendStart' event, which is a known type. If mistyped, it will result in a compiler error, ensuring correctness for predefined event types.

See:

```ts
import { busName } from 'index.tsx';

busName.dispatch({
  type: 'eventType', // This must match the key in the listeners object or it will throw a TypeScript error.
  payload: {
    greeting: 'Hello, world!',
  },
});
```
