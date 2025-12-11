import { storage } from 'common/storage';
import { useAtom, useAtomValue } from 'jotai';
import { createUuid } from 'tgui-core/uuid';
import {
  defaultHighlightSetting,
  highlightSettingsAtom,
  settingsAtom,
} from './atoms';
import type { HighlightSetting } from './types';

/** Custom hook with utility functions for updating highlight settings */
export function useHighlightSettings() {
  const [highlightState, setHighlightSettings] = useAtom(highlightSettingsAtom);
  const settings = useAtomValue(settingsAtom);

  function updateHighlightSetting(
    update: Partial<HighlightSetting> & { id: string },
  ): void {
    const { id } = update;
    const current = highlightState.highlightSettingById[id];
    if (!current) return;

    // Update the specific highlight setting by id
    const updatedIds = {
      ...highlightState.highlightSettingById,
      [id]: {
        ...current,
        ...update,
      },
    };

    // Reconstruct the overall highlight settings structure
    const newHighlightSettings = {
      highlightSettings: Object.keys(updatedIds),
      highlightSettingById: updatedIds,
    };

    // Update state and persist to storage
    setHighlightSettings(newHighlightSettings);
    storage.set('panel-settings', {
      ...settings,
      ...newHighlightSettings,
    });
  }

  function removeHighlightSetting(id: string) {
    const next = {};
    // Rebuild the highlight settings without the specified id
    for (const key in highlightState.highlightSettingById) {
      if (key !== id) {
        next[key] = highlightState.highlightSettingById[key];
      }
    }

    // Construct the updated highlight settings structure
    const updatedHighlightSettings = {
      highlightSettingById: next,
      highlightSettings: Object.keys(next),
    };

    // Update state and persist to storage
    setHighlightSettings(updatedHighlightSettings);
    storage.set('panel-settings', {
      ...settings,
      ...updatedHighlightSettings,
    });
  }

  function addHighlightSetting() {
    const newSetting = {
      ...defaultHighlightSetting,
      id: createUuid(),
    };

    // Append to the existing highlight settings
    const updatedIds = {
      ...highlightState.highlightSettingById,
      [newSetting.id]: newSetting,
    };

    // Reconstruct the overall highlight settings structure
    const newHighlightSettings = {
      highlightSettings: [...highlightState.highlightSettings, newSetting.id],
      highlightSettingById: updatedIds,
    };

    setHighlightSettings(newHighlightSettings);
    storage.set('panel-settings', {
      ...settings,
      ...newHighlightSettings,
    });
  }

  return {
    highlightState,
    updateHighlightSetting,
    removeHighlightSetting,
    addHighlightSetting,
  };
}
