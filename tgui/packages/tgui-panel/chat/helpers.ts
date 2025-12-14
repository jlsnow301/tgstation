import { store } from '../events/store';
import {
  chatLoadedAtom,
  chatPagesAtom,
  chatPagesRecord,
  currentPageAtom,
  currentPageIdAtom,
  scrollTrackingAtom,
} from './atom';
import { canPageAcceptType } from './model';
import { chatRenderer } from './renderer';
import type { Page } from './types';

chatRenderer.events.on('batchProcessed', (countByType) => {
  // Use this flag to workaround unread messages caused by
  // loading them from storage. Side effect of that, is that
  // message count can not be trusted, only unread count.
  if (store.get(chatLoadedAtom)) {
    updateMessageCount(countByType);
  }
});

chatRenderer.events.on('scrollTrackingChanged', updateScrollTracking);

function updateScrollTracking(value: boolean): void {
  store.set(scrollTrackingAtom, value);

  // No need to reset unread counts when enabling scroll tracking
  if (!value) return;

  const pageId = store.get(currentPageIdAtom);
  const pagesRecord = store.get(chatPagesRecord);
  const draft = {
    ...pagesRecord[pageId],
    unreadCount: 0,
  };

  store.set(chatPagesRecord, {
    ...pagesRecord,
    [pageId]: draft,
  });
}

function updateMessageCount(countByType: Record<string, number>): void {
  const pagesRecord = store.get(chatPagesRecord);
  const pages = store.get(chatPagesAtom).map((id) => pagesRecord[id]);
  const currentPage = store.get(currentPageAtom);
  const scrollTracking = store.get(scrollTrackingAtom);

  const draftpagesRecord = { ...pagesRecord };
  for (const page of pages) {
    let unreadCount = 0;

    for (const type of Object.keys(countByType)) {
      /// Message does not belong here
      if (!canPageAcceptType(page, type)) {
        continue;
      }
      // Current page scroll tracked
      if (page === currentPage && scrollTracking) {
        continue;
      }
      // This page received the same message which we can read on the current
      // page
      if (page !== currentPage && canPageAcceptType(currentPage, type)) {
        continue;
      }
      unreadCount += countByType[type];
    }

    if (unreadCount > 0) {
      draftpagesRecord[page.id] = {
        ...page,
        unreadCount: page.unreadCount + unreadCount,
      };
    }
  }

  store.set(chatPagesRecord, draftpagesRecord);
}

export function importChatState(pageRecord: Record<string, Page>): void {
  if (!pageRecord) return;

  const newPageIds: string[] = Object.keys(pageRecord);
  if (!newPageIds) return;

  store.set(currentPageIdAtom, newPageIds[0]);
  store.set(chatPagesAtom, newPageIds);
  store.set(chatPagesRecord, pageRecord);

  chatRenderer.changePage(pageRecord[newPageIds[0]]);
}
