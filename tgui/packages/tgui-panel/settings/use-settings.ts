import { storage } from 'common/storage';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { highlightSettingsAtom, settingsAtom } from './atoms';
import {
  generalSettingsHandler,
  migrateHighlightSettings,
  migrateSettings,
} from './helpers';
import { setDisplayScaling } from './scaling';
import type { SettingsState } from './types';

let initialized = false;

export function useSettings() {
  const [settings, setSettings] = useAtom(settingsAtom);
  const [highlightSettings, setHighlightSettings] = useAtom(
    highlightSettingsAtom,
  );

  /** Load and migrate settings */
  useEffect(() => {
    if (initialized) return;
    initialized = true;

    async function fetchSettings() {
      try {
        const storedSettings = await storage.get('panel-settings');
        generalSettingsHandler(storedSettings);

        const migrateHighlights = migrateHighlightSettings(
          highlightSettings,
          storedSettings,
        );
        const migratedSettings = migrateSettings(settings, storedSettings);

        setSettings(migratedSettings);
        setHighlightSettings(migrateHighlights);
      } catch (error) {
        console.error('Failed to load panel settings:', error);
      }
    }

    fetchSettings();
    setDisplayScaling();
  }, []);

  /** Updates any set of keys. Offers type safety based on the selection */
  function updateSettings<TKey extends keyof SettingsState>(
    update: Record<TKey, SettingsState[TKey]>,
  ): void {
    const newSettings = {
      ...settings,
      ...update,
    };

    generalSettingsHandler(newSettings);
    setSettings(newSettings);
    storage.set('panel-settings', newSettings);
  }

  return { settings, updateSettings };
}
