import { atom } from 'jotai';
import { createMainPage } from './model';

const mainPage = createMainPage();

export const initialState = {
  version: 5,
  currentPageId: mainPage.id,
  scrollTracking: true,
  pages: [mainPage.id],
  pageById: {
    [mainPage.id]: mainPage,
  },
};

export const chatAtom = atom(initialState);
