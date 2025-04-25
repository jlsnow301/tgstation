import { create } from 'zustand';

import { defaultHighlightSetting } from '../../settings/model';

type HighlightSetting = {
  highlightColor: string;
  highlightText: string;
  highlightWholeMessage: boolean;
  id: string;
  matchCase: boolean;
  matchWord: boolean;
};

type HighlightState = {
  highlightColor: string;
  highlightSettingById: Record<string, HighlightSetting>;
  highlightSettings: string[];
  highlightText: string;
};

type Action = {
  addHighlightSetting: (setting: HighlightSetting) => void;
  removeHighlightSetting: (id: string) => void;
  updateHighlightSetting: (
    id: string,
    setting: Partial<HighlightSetting>,
  ) => void;
};

export const useHighlightStore = create<HighlightState & Action>((set) => ({
  highlightColor: '#ffdd44',
  highlightSettings: [defaultHighlightSetting.id],
  highlightSettingById: {
    [defaultHighlightSetting.id]: defaultHighlightSetting,
  },
  highlightText: '',

  addHighlightSetting: (setting) =>
    set((state) => {
      const newSetting = {
        ...setting,
        id: setting.id || crypto.randomUUID(),
      };
      return {
        highlightSettings: [...state.highlightSettings, newSetting.id],
        highlightSettingById: {
          ...state.highlightSettingById,
          [newSetting.id]: newSetting,
        },
      };
    }),

  removeHighlightSetting: (id) =>
    set((state) => {
      const { [id]: _, ...remainingSettings } = state.highlightSettingById;
      return {
        highlightSettings: state.highlightSettings.filter((s) => s !== id),
        highlightSettingById: remainingSettings,
      };
    }),

  updateHighlightSetting: (id, setting) =>
    set((state) => ({
      highlightSettingById: {
        ...state.highlightSettingById,
        [id]: {
          ...state.highlightSettingById[id],
          ...setting,
        },
      },
      highlightSettings: state.highlightSettings.includes(id)
        ? state.highlightSettings
        : [...state.highlightSettings, id],
    })),
}));
