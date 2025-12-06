# Tgui event dispatch

## Philosophy

This event system is designed to stay as close to vanilla JavaScript as possible. The abstractions are intentionally kept simple. It uses a plain object to map event types to their respective handlers, making replacement easy.

There are three layers to this:

1. The event bus, which maintains the list of handlers.
2. The handlers, which delegate actions and update application state.
3. The store, ie the application state.

## Usage

### 1. Creating your event handler:

> events/handlers/someFunc.ts

```ts
type ExpectedPayload = {
	greeting: string;
};

export function someFunc(payload: ExpectedPayload) {
	// Do something with the payload
	logger.log('Received: ', payload.greeting);
}
```

### 2. Registering the event handler:

> events/listeners.ts

```ts
import { someFunc } from 'handlers/someFunc';

export const listeners = {
	eventType: someFunc,
} as const;
```

You can even shorten this by naming your function the same as the event type. An event of type 'myType' would call the myType function directly,

```ts
export function myType(payload: MyPayload) {
	logger.log('whatever!');
}

export const listeners = {
	myType,
};
```

### 3. Setting up your event dispatch

> index.tsx

```ts
import { EventBus } from 'common/eventbus';
import { listeners } from 'events/listeners';

const busName = new EventBus(listeners);
```

### 4. Subscribe to byond events

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
