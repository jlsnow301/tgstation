import { bus } from '.';
import { sendAct } from './events/act';
import { useChunkingStore } from './events/stores/chunking';
import { useConfigStore } from './events/stores/config';
import { DebugState, useDebugStore } from './events/stores/debug';
import { useGameStore } from './events/stores/game';
import { useSharedStore } from './events/stores/shared';
import { useWindowStore } from './events/stores/suspense';

export function useBackend<TData extends Record<string, unknown>>() {
  const config = useConfigStore((state) => state.config);
  const data = useGameStore((state) => state.data);

  const debugLayout = useDebugStore((state) => state.debugLayout);
  const kitchenSink = useDebugStore((state) => state.kitchenSink);
  const debug = { debugLayout, kitchenSink } as DebugState;

  const outgoingPayloadQueues = useChunkingStore(
    (state) => state.outgoingPayloadQueues,
  );
  const shared = useSharedStore((state) => state.shared);
  const suspending = useWindowStore((state) => state.suspending);
  const suspended = useWindowStore((state) => state.suspended);

  return {
    act: sendAct,
    config,
    data: data as TData,
    debug,
    shared,
    outgoingPayloadQueues,
    suspending,
    suspended,
  };
}

/**
 * A tuple that contains the state and a setter function for it.
 */
type StateWithSetter<T> = [T, (nextState: T) => void];

/**
 * Allocates state on Zustand store without sharing it with other clients.
 *
 * Use it when you want to have a stateful variable in your component
 * that persists between renders, but will be forgotten after you close
 * the UI.
 *
 * It is a lot more performant than `setSharedState`.
 *
 * @param context React context.
 * @param key Key which uniquely identifies this state in Zustand store.
 * @param initialState Initializes your global variable with this value.
 * @deprecated Use useState and useEffect when you can. Pass the state as a prop.
 */
export const useLocalState = <TState>(
  key: string,
  initialState: TState,
): StateWithSetter<TState> => {
  const sharedStates = useSharedStore((state) => state.shared);
  const sharedState = key in sharedStates ? sharedStates[key] : initialState;

  return [
    sharedState,
    (nextState) => {
      bus.dispatch({
        type: 'setSharedState',
        payload: {
          key,
          nextState:
            typeof nextState === 'function'
              ? nextState(sharedState)
              : nextState,
        },
      });
    },
  ];
};

/**
 * Allocates state on Zustand store, and **shares** it with other clients
 * in the game.
 *
 * Use it when you want to have a stateful variable in your component
 * that persists not only between renders, but also gets pushed to other
 * clients that observe this UI.
 *
 * This makes creation of observable s
 *
 * @param context React context.
 * @param key Key which uniquely identifies this state in Zustand store.
 * @param initialState Initializes your global variable with this value.
 */
export const useSharedState = <TState>(
  key: string,
  initialState: TState,
): StateWithSetter<TState> => {
  const sharedStates = useSharedStore((state) => state.shared);
  const sharedState = key in sharedStates ? sharedStates[key] : initialState;

  return [
    sharedState,
    (nextState) => {
      Byond.sendMessage({
        type: 'setSharedState',
        key,
        value:
          JSON.stringify(
            typeof nextState === 'function'
              ? nextState(sharedState)
              : nextState,
          ) || '',
      });
    },
  ];
};
