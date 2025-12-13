/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import type { Store } from 'common/redux';
import { store as jotaiStore } from '../events/store';
import { settingsAtom } from '../settings/atoms';
import {
  addChatPage,
  changeChatPage,
  changeScrollTracking,
  loadChat,
  moveChatPageLeft,
  moveChatPageRight,
  removeChatPage,
  toggleAcceptedType,
  updateMessageCount,
} from './actions';
import { MESSAGE_SAVE_INTERVAL } from './constants';
import { chatRenderer } from './renderer';
import { selectCurrentChatPage } from './selectors';
import { loadChatFromStorage, saveChatToStorage } from './store';

export const chatMiddleware = (store: Store) => {
  let initialized = false;
  let loaded = false;
  const sequences: number[] = [];
  const sequences_requested: number[] = [];
  chatRenderer.events.on('batchProcessed', (countByType) => {
    // Use this flag to workaround unread messages caused by
    // loading them from storage. Side effect of that, is that
    // message count can not be trusted, only unread count.
    if (loaded) {
      store.dispatch(updateMessageCount(countByType));
    }
  });
  chatRenderer.events.on('scrollTrackingChanged', (scrollTracking) => {
    store.dispatch(changeScrollTracking(scrollTracking));
  });
  return (next) => (action) => {
    const { type, payload } = action;
    const settings = jotaiStore.get(settingsAtom);
    // Load the chat once settings are loaded
    if (!initialized && settings.initialized) {
      setInterval(() => {
        saveChatToStorage(store);
      }, MESSAGE_SAVE_INTERVAL);
      initialized = true;
      loadChatFromStorage(store);
    }

    if (type === loadChat.type) {
      next(action);
      const page = selectCurrentChatPage(store.getState());
      chatRenderer.changePage(page);
      chatRenderer.onStateLoaded();
      loaded = true;
      return;
    }
    if (
      type === changeChatPage.type ||
      type === addChatPage.type ||
      type === removeChatPage.type ||
      type === toggleAcceptedType.type ||
      type === moveChatPageLeft.type ||
      type === moveChatPageRight.type
    ) {
      next(action);
      const page = selectCurrentChatPage(store.getState());
      chatRenderer.changePage(page);
      return;
    }
    return next(action);
  };
};
