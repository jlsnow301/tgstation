/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import type { Store } from 'common/redux';
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
import { chatRenderer } from './renderer';
import { selectCurrentChatPage } from './selectors';

export const chatMiddleware = (store: Store) => {
  let loaded = false;
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
