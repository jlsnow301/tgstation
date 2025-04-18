import { z } from '@zod/mini';
import * as R from 'remeda';
import { create } from 'zustand';

import { logger } from './logging';

type State = {
  data: Record<string, any>;
};

type Action = {
  updateData: (update: State['data']) => void;
};

const useNewStore = create<State & Action>()((set) => ({
  data: [],
  updateData: (data) => set({ data }),
}));

export function useNewBackend(schema?: z.ZodMiniJSONSchema) {
  const data = useNewStore();

  if (schema) {
    const result = schema.safeParse(data);
    if (!result.success) {
      logger.log('Invalid data received from backend', result.error);
    }
  }

  return data;
}

export function storeDispatch(message: { type: string; payload: any }) {
  if (message.type === 'update' && message.payload.data) {
    const newState = message.payload.data;

    if (!R.isDeepEqual(newState, useNewStore.getState())) {
      useNewStore.setState(() => ({ data: newState }));
    }
  }
}
