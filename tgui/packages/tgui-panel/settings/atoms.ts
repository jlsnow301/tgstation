import { atom } from 'jotai';
import { FONTS, SETTINGS_TABS } from './constants';

type View = {
  visible: boolean;
  activeTab: string;
};

type HighlightSetting = {
  id: string;
  highlightText: string;
  highlightColor: string;
  highlightWholeMessage: boolean;
  matchWord: boolean;
  matchCase: boolean;
};

export type SettingsState = {
  version: number;
  fontSize: number;
  fontFamily: (typeof FONTS)[number];
  lineHeight: number;
  theme: 'light' | 'dark';
  adminMusicVolume: number;
  /** Keep this for compatibility with other servers */
  highlightText: string;
  /** Keep this for compatibility with other servers */
  highlightColor: string;
  highlightSettings: string[];
  highlightSettingById: Record<string, HighlightSetting>;
  view: View;
  initialized: boolean;
  statLinked: boolean;
  statFontSize: number;
  statTabsStyle: 'default' | 'compact' | 'minimal';
};

const defaultHighlightSetting: HighlightSetting = {
  id: 'default',
  highlightText: '',
  highlightColor: '#ffdd44',
  highlightWholeMessage: true,
  matchWord: false,
  matchCase: false,
};

const initialState = {
  version: 1,
  fontSize: 13,
  fontFamily: FONTS[0],
  lineHeight: 1.2,
  theme: 'light',
  adminMusicVolume: 0.5,
  // Keep these two state vars for compatibility with other servers
  highlightText: '',
  highlightColor: '#ffdd44',
  // END compatibility state vars
  highlightSettings: [defaultHighlightSetting.id],
  highlightSettingById: {
    [defaultHighlightSetting.id]: defaultHighlightSetting,
  },
  view: {
    visible: false,
    activeTab: SETTINGS_TABS[0].id,
  },
  initialized: false,
  statLinked: true,
  statFontSize: 12,
  statTabsStyle: 'default',
};

export const settingsAtom = atom(initialState);
