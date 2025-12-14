import { storage } from 'common/storage';
import DOMPurify from 'dompurify';
import * as z from 'zod';
import { store } from '../events/store';
import {
  chatPagesAtom,
  chatPagesRecord,
  currentPageAtom,
  currentPageIdAtom,
  mainPage,
  scrollTrackingAtom,
  versionAtom,
} from './atom';
import { canPageAcceptType, createMessage, createPage } from './model';
import { chatRenderer } from './renderer';
import type { Page } from './types';

let loaded = false;

chatRenderer.events.on('batchProcessed', (countByType) => {
  // Use this flag to workaround unread messages caused by
  // loading them from storage. Side effect of that, is that
  // message count can not be trusted, only unread count.
  if (loaded) {
    updateMessageCount(countByType);
  }
});
chatRenderer.events.on('scrollTrackingChanged', updateScrollTracking);

// List of blacklisted tags
const FORBID_TAGS = ['a', 'iframe', 'link', 'video'];

export async function loadChatFromStorage(): Promise<void> {
  const [state, messages] = await Promise.all([
    storage.get('chat-state'),
    storage.get('chat-messages'),
  ]);

  // Discard incompatible versions
  if (state && 'version' in state && state.version <= 4) return;
  if (!messages) return;

  for (const message of messages) {
    if (message.html) {
      message.html = DOMPurify.sanitize(message.html, {
        FORBID_TAGS,
      });
    }
  }

  const batch = [
    ...messages,
    createMessage({
      type: 'internal/reconnected',
    }),
  ];

  chatRenderer.processBatch(batch, {
    prepend: true,
  });

  console.log(`Restored chat with ${messages.length} messages`);
  loadChatStateFromStorage(state);
}

const storedSettingsSchema = z.object({
  version: z.number(),
  scrollTracking: z.boolean(),
  currentPageId: z.string(),
  pages: z.array(z.string()),
  pagesById: z.record(z.string(), z.any()),
});

export function loadChatStateFromStorage(
  stored: Record<string, unknown>,
): void {
  let parsed;
  try {
    parsed = storedSettingsSchema.parse(stored);
  } catch (err) {
    console.error(err);
    return;
  }

  // Validate version and/or migrate state
  if (stored.version !== store.get(versionAtom)) return;

  // Enable any filters that are not explicitly set, that are
  // enabled by default on the main page.
  for (const id of parsed.pages) {
    const page = parsed.pagesById[id];
    const filters = page.acceptedTypes;

    const defaultFilters = mainPage.acceptedTypes;
    for (const type of Object.keys(defaultFilters)) {
      if (filters[type] === undefined) {
        filters[type] = defaultFilters[type];
      }
    }
    // Reset page message counts
    page.unreadCount = 0;
  }

  store.set(versionAtom, parsed.version);
  store.set(scrollTrackingAtom, parsed.scrollTracking);
  store.set(chatPagesAtom, parsed.pages);
  store.set(currentPageIdAtom, parsed.currentPageId);
  store.set(chatPagesRecord, parsed.pagesById);

  chatRenderer.changePage(parsed.pages[0]);
  chatRenderer.onStateLoaded();
  loaded = true;

  console.log(`Restore chat settings with ${parsed.pages.length} pages`);
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

export function updateScrollTracking(value: boolean): void {
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

export function updateMessageCount(countByType: Record<string, number>): void {
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

export function addChatPage(): void {
  const draft = createPage();

  store.set(currentPageIdAtom, draft.id);
  store.set(chatPagesAtom, (prev) => [...prev, draft.id]);
  store.set(chatPagesRecord, (prev) => ({
    ...prev,
    [draft.id]: draft,
  }));

  chatRenderer.changePage(draft);
}

export function changeChatPage(page: Page): void {
  const pageId = store.get(currentPageIdAtom);
  const pagesRecord = store.get(chatPagesRecord);
  const draft: Page = {
    ...pagesRecord[pageId],
    unreadCount: 0,
  };

  store.set(currentPageIdAtom, pageId);
  store.set(chatPagesRecord, {
    ...pagesRecord,
    [pageId]: draft,
  });

  chatRenderer.changePage(page);
}

export function updateChatPage(page: Partial<Page>): void {
  const pageId = store.get(currentPageIdAtom);
  const pagesRecord = store.get(chatPagesRecord);

  const draft: Page = {
    ...pagesRecord[pageId],
    ...page,
  };

  store.set(chatPagesRecord, {
    ...pagesRecord,
    [pageId]: draft,
  });

  chatRenderer.changePage(page);
}

export function toggleAcceptedType(type: string): void {
  const pageId = store.get(currentPageIdAtom);
  const pagesRecord = store.get(chatPagesRecord);
  const current = { ...pagesRecord[pageId] };

  const draft: Page = {
    ...current,
    acceptedTypes: {
      ...current.acceptedTypes,
      [type]: !current.acceptedTypes[type],
    },
  };

  store.set(chatPagesRecord, {
    ...pagesRecord,
    [pageId]: draft,
  });

  chatRenderer.changePage(draft);
}

export function removeChatPage(): void {
  const pagesRecord = store.get(chatPagesRecord);
  const pages = store.get(chatPagesAtom);
  const pageId = store.get(currentPageIdAtom);

  const draftRecord: Record<string, Page> = {};
  const draftPages: string[] = [];
  let draftCurrentPageId: string = pageId;

  for (const id of pages) {
    if (id === pageId) continue;
    draftRecord[id] = pagesRecord[id];
    draftPages.push(id);
  }

  if (draftPages.length === 0) {
    draftPages.push(mainPage.id);
    draftRecord[mainPage.id] = mainPage;
    draftCurrentPageId = mainPage.id;
  }

  if (!draftCurrentPageId || draftCurrentPageId === pageId) {
    draftCurrentPageId = draftPages[0];
  }

  store.set(chatPagesRecord, draftRecord);
  store.set(chatPagesAtom, draftPages);
  store.set(currentPageIdAtom, draftCurrentPageId);

  const newCurrentPage = draftRecord[draftCurrentPageId];
  chatRenderer.changePage(newCurrentPage);
}

export function moveChatLeft(): void {
  const pages = store.get(chatPagesAtom);
  const pagesRecord = store.get(chatPagesRecord);
  const pageId = store.get(currentPageIdAtom);

  const tmpPage = pagesRecord[pageId];
  const fromIndex = pages.indexOf(tmpPage.id);
  const toIndex = fromIndex - 1;

  // don't ever move leftmost page
  if (fromIndex <= 0) return;
  // don't ever move anything to the leftmost page
  if (toIndex <= 0) return;

  const draftPages = [...pages];
  const tmp = draftPages[fromIndex];
  draftPages[fromIndex] = draftPages[toIndex];
  draftPages[toIndex] = tmp;

  store.set(chatPagesAtom, draftPages);
  chatRenderer.changePage(pagesRecord[pageId]);
}

export function moveChatRight(): void {
  const pages = store.get(chatPagesAtom);
  const pagesRecord = store.get(chatPagesRecord);
  const pageId = store.get(currentPageIdAtom);

  const tmpPage = pagesRecord[pageId];
  const fromIndex = pages.indexOf(tmpPage.id);
  const toIndex = fromIndex + 1;

  // don't ever move leftmost page
  if (fromIndex <= 0) return;
  // don't ever move anything out of the array
  if (toIndex >= pages.length) return;

  const draftPages = [...pages];
  const tmp = draftPages[fromIndex];
  draftPages[fromIndex] = draftPages[toIndex];
  draftPages[toIndex] = tmp;

  store.set(chatPagesAtom, draftPages);
  chatRenderer.changePage(pagesRecord[pageId]);
}
