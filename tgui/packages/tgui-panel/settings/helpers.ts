/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import { defaultHighlightSetting } from './atoms';
import { FONTS_DISABLED } from './constants';
import { setClientTheme } from './themes';
import type { HighlightSettingsState, SettingsState } from './types';

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

//------- Helpers ------------------------------------------------------------//

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

function mergeInitialize(
  current: SettingsState,
  next: SettingsState,
): SettingsState {
  return {
    ...current,
    ...next,
    initialized: true,
  };
}

export function migrateHighlightSettings(
  current: HighlightSettingsState,
  next: HighlightSettingsState,
): HighlightSettingsState {
  const nextState: HighlightSettingsState = { ...current, ...next };

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
    nextState.highlightColor || defaultHighlightSetting.highlightColor;
  highlightSetting.highlightText =
    nextState.highlightText || defaultHighlightSetting.highlightText;

  return nextState;
}

export function migrateSettings(
  current: SettingsState,
  next: SettingsState,
): SettingsState {
  const nextState = mergeInitialize(current, next);

  // Validate version and/or migrate state
  if (!next?.version) {
    return nextState;
  }

  return nextState;
}
