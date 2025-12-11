import { storage } from 'common/storage';
import { useAtom, useAtomValue } from 'jotai';
import { createUuid } from 'tgui-core/uuid';
import { defaultHighlightSetting, highlightsAtom, settingsAtom } from './atoms';
import type { HighlightSetting } from './types';

/** Custom hook with utility functions for updating highlight settings */
export function useHighlights() {
  const [highlights, setHighlights] = useAtom(highlightsAtom);
  const settings = useAtomValue(settingsAtom);

  function updateHighlight(
    update: Partial<HighlightSetting> & { id: string },
  ): void {
    const { id } = update;
    const current = highlights.highlightSettingById[id];
    if (!current) return;

    // Update the specific highlight setting by id
    const updatedIds = {
      ...highlights.highlightSettingById,
      [id]: {
        ...current,
        ...update,
      },
    };

    // Reconstruct the overall highlight settings structure
    const newHighlights = {
      highlightSettings: Object.keys(updatedIds),
      highlightSettingById: updatedIds,
    };

    // Update state and persist to storage
    setHighlights(newHighlights);
    storage.set('panel-settings', {
      ...settings,
      ...newHighlights,
    });
  }

  function removeHighlight(id: string) {
    const next = {};
    // Rebuild the highlight settings without the specified id
    for (const key in highlights.highlightSettingById) {
      if (key !== id) {
        next[key] = highlights.highlightSettingById[key];
      }
    }

    // Construct the updated highlight settings structure
    const updatedHighlightSettings = {
      highlightSettingById: next,
      highlightSettings: Object.keys(next),
    };

    // Update state and persist to storage
    setHighlights(updatedHighlightSettings);
    storage.set('panel-settings', {
      ...settings,
      ...updatedHighlightSettings,
    });
  }

  function addHighlight() {
    const newSetting = {
      ...defaultHighlightSetting,
      id: createUuid(),
    };

    // Append to the existing highlight settings
    const updatedIds = {
      ...highlights.highlightSettingById,
      [newSetting.id]: newSetting,
    };

    // Reconstruct the overall highlight settings structure
    const newHighlightSettings = {
      highlightSettings: [...highlights.highlightSettings, newSetting.id],
      highlightSettingById: updatedIds,
    };

    setHighlights(newHighlightSettings);
    storage.set('panel-settings', {
      ...settings,
      ...newHighlightSettings,
    });
  }

  return {
    highlights,
    updateHighlight,
    removeHighlight,
    addHighlight,
  };
}
