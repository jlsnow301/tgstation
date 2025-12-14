import { atom } from 'jotai';
import { createMainPage } from './model';

export const mainPage = createMainPage();

export const chatLoadedAtom = atom(false);
export const versionAtom = atom(5);
export const scrollTrackingAtom = atom(true);
export const chatPagesAtom = atom([mainPage.id]);
export const currentPageIdAtom = atom(mainPage.id);
export const chatPagesRecord = atom({
  [mainPage.id]: mainPage,
});

export const allChatAtom = atom((get) => ({
  version: get(versionAtom),
  currentPageId: get(currentPageIdAtom),
  scrollTracking: get(scrollTrackingAtom),
  pages: get(chatPagesAtom),
  pagesById: get(chatPagesRecord),
}));

export const currentPageAtom = atom((get) => {
  const pageId = get(currentPageIdAtom);
  const pagesById = get(chatPagesRecord);
  return pagesById[pageId];
});
