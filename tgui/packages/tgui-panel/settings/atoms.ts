import { atom } from 'jotai';
import type { Page } from '../chat/types';
import type { FONTS } from './constants';

type View = {
  visible: boolean;
  activeTab: string;
};

type Chat = {
  pageById: Record<string, Page>[];
};

export type SettingsState = {
  version: number;
  fontSize: number;
  fontFamily: (typeof FONTS)[number];
  lineHeight: number;
  theme: string;
  adminMusicVolume: number;
  highlightText: string;
  highlightColor: string;
  highlightSettings: string[];
  highlightSettingById: Record<string, any>;
  view: View;
  initialized: boolean;
  statLinked: boolean;
  statFontSize: number;
  statTabsStyle: string;
  chat: Chat;
};

export const settingsAtom = atom({} as SettingsState);
