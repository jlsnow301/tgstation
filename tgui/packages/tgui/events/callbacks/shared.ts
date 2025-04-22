import { useSharedStore } from '../stores/shared';

type SharedPayload = {
  key: string;
  nextState: any;
};

export function setSharedState(payload: SharedPayload): void {
  const { key, nextState } = payload;

  useSharedStore.getState().updateShared({
    [key]: nextState,
  });
}
