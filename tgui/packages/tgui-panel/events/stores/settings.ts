import { create } from 'zustand';

import { FONTS, SETTINGS_TABS } from '../../settings/constants';

type View = {
  activeTab: string;
  visible: boolean;
};

type SettingsState = {
  adminMusicVolume: number;
  fontFamily: string;
  fontSize: number;
  initialized: boolean;
  lineHeight: number;
  statFontSize: number;
  statLinked: boolean;
  statTabsStyle: string;
  theme: string;
  version: number;
  view: View;
};

type Actions = {
  changeTab: (tab: string) => void;
  toggleSettings: (tab?: string) => void;
  updateSettings: (settings: Partial<SettingsState>) => void;
};

export const useSettingsStore = create<SettingsState & Actions>((set) => ({
  adminMusicVolume: 0.5,
  fontFamily: FONTS[0],
  fontSize: 13,
  initialized: false,
  lineHeight: 1.2,
  statFontSize: 12,
  statLinked: true,
  statTabsStyle: 'default',
  theme: 'light',
  version: 1,
  view: {
    visible: false,
    activeTab: SETTINGS_TABS[0].id,
  },

  changeTab: (tab) =>
    set((state) => ({
      view: {
        ...state.view,
        activeTab: tab,
      },
    })),

  toggleSettings: (tab) =>
    set((state) => ({
      view: {
        activeTab: tab ?? state.view.activeTab,
        visible: !state.view.visible,
      },
    })),

  updateSettings: (settings) =>
    set((state) => ({
      ...state,
      ...settings,
    })),
}));
