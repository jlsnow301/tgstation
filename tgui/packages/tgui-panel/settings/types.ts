import * as z from 'zod';
import { chatpagesSchema } from '../chat/types';

const viewSchema = z.object({
  activeTab: z.string(),
  visible: z.boolean(),
});

const settingsSchema = z.object({
  adminMusicVolume: z.number(),
  fontFamily: z.string(),
  fontSize: z.number(),
  initialized: z.boolean(),
  lineHeight: z.number(),
  statFontSize: z.number(),
  statLinked: z.boolean(),
  statTabsStyle: z.string(),
  theme: z.string(),
  version: z.number(),
  view: viewSchema,
});

const highlightSettingSchema = z.object({
  highlightColor: z.string(),
  highlightText: z.string(),
  highlightWholeMessage: z.boolean(),
  id: z.string(),
  matchCase: z.boolean(),
  matchWord: z.boolean(),
});

const highlightsSchema = z.object({
  highlightColor: z.string(),
  highlightSettingById: z.record(z.string(), highlightSettingSchema).optional(),
  highlightSettings: z.array(z.string()).optional(),
  highlightText: z.string(),
});

export const exportedSettingsSchema = settingsSchema
  .extend(chatpagesSchema.shape)
  .extend(highlightsSchema.shape);

export type ExportedSettings = z.infer<typeof exportedSettingsSchema>;

export type HighlightSetting = z.infer<typeof highlightSettingSchema>;

export type SettingsState = z.infer<typeof settingsSchema>;

export type HighlightState = z.infer<typeof highlightsSchema>;
