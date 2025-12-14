import { omit, pick } from 'es-toolkit';
import * as z from 'zod';
import { chatPagesRecordAtom } from '../chat/atom';
import { importChatState } from '../chat/helpers';
import { store } from '../events/store';
import { storedSettingsAtom } from './atoms';
import { startSettingsMigration } from './migration';

export function exportChatSettings(): void {
  const chatPages = store.get(chatPagesRecordAtom);
  const settings = store.get(storedSettingsAtom);

  const opts: SaveFilePickerOptions = {
    id: `ss13-chatprefs-${Date.now()}`,
    suggestedName: `ss13-chatsettings-${new Date().toJSON().slice(0, 10)}.json`,
    types: [
      {
        description: 'SS13 file',
        accept: { 'application/json': ['.json'] },
      },
    ],
  };

  const exportObject = { ...settings, chatPages };

  window
    .showSaveFilePicker(opts)
    .then((fileHandle) => {
      fileHandle.createWritable().then((writableHandle) => {
        writableHandle.write(JSON.stringify(exportObject));
        writableHandle.close();
      });
    })
    .catch((e) => {
      // Log the error if the error has nothing to do with the user aborting the download
      if (e.name !== 'AbortError') {
        console.error(e);
      }
    });
}

const chatSettingsSchema = z.object({
  version: z.string(),
  chatPages: z.record(z.string(), z.any()),
});

export function importChatSettings(settings: string | string[]): void {
  if (Array.isArray(settings)) return;

  let ourImport;
  try {
    const parsed = JSON.parse(settings);
    ourImport = chatSettingsSchema.parse(parsed);
  } catch (err) {
    console.error(err);
    return;
  }

  const chatPart = pick(ourImport, ['chatPages']);
  const settingsPart = omit(ourImport, ['chatPages']);

  importChatState(chatPart);
  startSettingsMigration(settingsPart as any);
}
