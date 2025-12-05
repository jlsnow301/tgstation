import { useAtomValue } from 'jotai';
import { bus } from '.';
import { sendAct } from './events/act';
import {
  configAtom,
  debugLayoutAtom,
  gameDataAtom,
  gameStaticDataAtom,
  kitchenSinkAtom,
  outgoingPayloadQueuesAtom,
  sharedAtom,
  store,
  suspendedAtom,
  suspendingAtom,
} from './events/store';

/**
 * Reactive backend state hook. Please use a type to define what the data is
 * intended to be.
 */
export function useBackend<TData extends Record<string, unknown>>() {
  const config = useAtomValue(configAtom);

  const fastData = useAtomValue(gameDataAtom);
  const staticData = useAtomValue(gameStaticDataAtom);
  const data = {
    ...fastData,
    ...staticData,
  } as TData;

  const debugLayout = useAtomValue(debugLayoutAtom);
  const kitchenSink = useAtomValue(kitchenSinkAtom);
  const debug = {
    debugLayout,
    kitchenSink,
  };

  const outgoingPayloadQueues = useAtomValue(outgoingPayloadQueuesAtom);

  const shared = useAtomValue(sharedAtom);

  const suspending = useAtomValue(suspendingAtom);
  const suspended = useAtomValue(suspendedAtom);

  return {
    act: sendAct,
    config,
    data,
    debug,
    shared,
    outgoingPayloadQueues,
    suspending,
    suspended,
  };
}

/**
 * This is a holdover for UIs breaking the rule of hooks.
 * It doesn't respond to state updates!
 */
export function getNonreactiveBackend<TData extends Record<string, unknown>>() {
  const fastData = store.get(gameDataAtom);
  const staticData = store.get(gameStaticDataAtom);
  const data = {
    ...fastData,
    ...staticData,
  } as TData;

  return {
    act: sendAct,
    data,
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
  const sharedStates = useAtomValue(sharedAtom);
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
  const sharedStates = useAtomValue(sharedAtom);
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
