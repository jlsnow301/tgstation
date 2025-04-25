/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import { useShallow } from 'zustand/react/shallow';

import { useSettingsStore } from '../events/stores/settings';

export function useSettings() {
  const adminMusicVolume = useSettingsStore((state) => state.adminMusicVolume);
  const fontFamily = useSettingsStore((state) => state.fontFamily);
  const fontSize = useSettingsStore((state) => state.fontSize);
  const initialized = useSettingsStore((state) => state.initialized);
  const lineHeight = useSettingsStore((state) => state.lineHeight);
  const statFontSize = useSettingsStore((state) => state.statFontSize);
  const statLinked = useSettingsStore((state) => state.statLinked);
  const statTabsStyle = useSettingsStore((state) => state.statTabsStyle);
  const theme = useSettingsStore((state) => state.theme);
  const version = useSettingsStore((state) => state.version);
  const view = useSettingsStore(useShallow((state) => state.view));
  const settings = {
    adminMusicVolume,
    fontFamily,
    fontSize,
    initialized,
    lineHeight,
    statFontSize,
    statLinked,
    statTabsStyle,
    theme,
    version,
    view,
  };

  const updateSettings = useSettingsStore((state) => state.updateSettings);

  return {
    settings,
    updateSettings,
  };
}
