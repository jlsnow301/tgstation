/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import { store } from '../events/store';
import { defaultHighlightSetting, highlightsAtom, settingsAtom } from './atoms';
import { FONTS_DISABLED } from './constants';
import { setClientTheme } from './themes';
import type { HighlightState, SettingsState } from './types';

let statFontTimer: NodeJS.Timeout;
let statTabsTimer: NodeJS.Timeout;
let overrideRule: HTMLStyleElement;
let overrideFontFamily: string | undefined;
let overrideFontSize: string;

/** Updates the global CSS rule to override the font family and size. */
function updateGlobalOverrideRule() {
  let fontFamily = '';

  if (overrideFontFamily !== undefined) {
    fontFamily = `font-family: ${overrideFontFamily} !important;`;
  }

  const constructedRule = `body * :not(.Icon) {
    ${fontFamily}
  }`;

  if (overrideRule === undefined) {
    overrideRule = document.createElement('style');
    document.querySelector('head')!.append(overrideRule);
  }

  // no other way to force a CSS refresh other than to update its innerText
  overrideRule.innerText = constructedRule;

  document.body.style.setProperty('font-size', overrideFontSize);
}

function setGlobalFontSize(
  fontSize: string | number,
  statFontSize: string | number,
  statLinked: boolean,
) {
  overrideFontSize = `${fontSize}px`;

  // Used solution from theme.ts
  clearInterval(statFontTimer);
  Byond.command(
    `.output statbrowser:set_font_size ${statLinked ? fontSize : statFontSize}px`,
  );
  statFontTimer = setTimeout(() => {
    Byond.command(
      `.output statbrowser:set_font_size ${statLinked ? fontSize : statFontSize}px`,
    );
  }, 1500);
}

function setGlobalFontFamily(fontFamily: string) {
  overrideFontFamily = fontFamily === FONTS_DISABLED ? undefined : fontFamily;
}

function setStatTabsStyle(style: string) {
  clearInterval(statTabsTimer);
  Byond.command(`.output statbrowser:set_tabs_style ${style}`);
  statTabsTimer = setTimeout(() => {
    Byond.command(`.output statbrowser:set_tabs_style ${style}`);
  }, 1500);
}

export function generalSettingsHandler(update: SettingsState) {
  // Set client theme
  const theme = update?.theme;
  if (theme) {
    setClientTheme(theme);
  }

  // Update stat panel settings
  setStatTabsStyle(update.statTabsStyle);

  // Update global UI font size
  setGlobalFontSize(update.fontSize, update.statFontSize, update.statLinked);
  setGlobalFontFamily(update.fontFamily);
  updateGlobalOverrideRule();
}

function migrateHighlights(
  current: HighlightState,
  next: HighlightState,
): HighlightState {
  const nextState: HighlightState = { ...current, ...next };

  // Lazy init the list for compatibility reasons
  if (!nextState.highlightSettings) {
    nextState.highlightSettings = [defaultHighlightSetting.id];
    nextState.highlightSettingById[defaultHighlightSetting.id] =
      defaultHighlightSetting;
  }
  // Compensating for mishandling of default highlight settings
  else if (!nextState.highlightSettingById[defaultHighlightSetting.id]) {
    nextState.highlightSettings = [
      defaultHighlightSetting.id,
      ...nextState.highlightSettings,
    ];
    nextState.highlightSettingById[defaultHighlightSetting.id] =
      defaultHighlightSetting;
  }

  // Update the highlight settings for default highlight
  // settings compatibility
  const highlightSetting =
    nextState.highlightSettingById[defaultHighlightSetting.id];
  highlightSetting.highlightColor =
    nextState.highlightColor ?? defaultHighlightSetting.highlightColor;
  highlightSetting.highlightText =
    nextState.highlightText ?? defaultHighlightSetting.highlightText;

  return nextState;
}

function migrateSettings(
  current: SettingsState,
  next: SettingsState,
): SettingsState {
  const nextState = {
    ...current,
    ...next,
    initialized: true,
  };

  // Validate version and/or migrate state
  if (!next?.version) {
    return nextState;
  }

  return nextState;
}

/** A bit of a chunky procedural function. Handles imported and loaded settings */
export function startSettingsMigration(
  next: SettingsState & HighlightState,
): void {
  generalSettingsHandler(next);

  const currentSettings = store.get(settingsAtom);
  const currentHighlight = store.get(highlightsAtom);

  const migratedSettings = migrateSettings(currentSettings, next);
  const migratedHighlights = migrateHighlights(currentHighlight, next);

  store.set(settingsAtom, migratedSettings);
  store.set(highlightsAtom, migratedHighlights);
}
