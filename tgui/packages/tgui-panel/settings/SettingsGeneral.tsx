import { useState } from 'react';
import {
  Button,
  Collapsible,
  Divider,
  Input,
  LabeledList,
  Section,
  Slider,
  Stack,
} from 'tgui-core/components';
import { toFixed } from 'tgui-core/math';
import { capitalize } from 'tgui-core/string';

import { clearChat, saveChatToDisk } from '../chat/actions';
import { THEMES } from '../themes';
import { exportSettings } from './actions';
import { FONTS } from './constants';
import { useSettings } from './hooks';
import { resetPaneSplitters, setEditPaneSplitters } from './scaling';
import { importChatSettings } from './settingsImExport';

export function SettingsGeneral(props) {
  const { settings, updateSettings } = useSettings();

  const [freeFont, setFreeFont] = useState(false);
  const [editingPanes, setEditingPanes] = useState(false);

  return (
    <Section>
      <LabeledList>
        <LabeledList.Item label="Theme">
          {THEMES.map((theme) => (
            <Button
              key={theme}
              selected={settings.theme === theme}
              color="transparent"
              onClick={() =>
                updateSettings({
                  theme: theme,
                })
              }
            >
              {capitalize(theme)}
            </Button>
          ))}
        </LabeledList.Item>
        <LabeledList.Item label="UI sizes">
          <Stack>
            <Stack.Item>
              <Button
                onClick={() =>
                  setEditingPanes((val) => {
                    setEditPaneSplitters(!val);
                    return !val;
                  })
                }
                color={editingPanes ? 'red' : undefined}
                icon={editingPanes ? 'save' : undefined}
              >
                {editingPanes ? 'Save' : 'Adjust UI Sizes'}
              </Button>
            </Stack.Item>
            <Stack.Item>
              <Button onClick={resetPaneSplitters} icon="refresh" color="red">
                Reset
              </Button>
            </Stack.Item>
          </Stack>
        </LabeledList.Item>
        <LabeledList.Item label="Font style">
          <Stack.Item>
            {!freeFont ? (
              <Collapsible
                title={settings.fontFamily}
                width="100%"
                buttons={
                  <Button
                    icon={freeFont ? 'lock-open' : 'lock'}
                    color={freeFont ? 'good' : 'bad'}
                    onClick={() => {
                      setFreeFont(!freeFont);
                    }}
                  >
                    Custom font
                  </Button>
                }
              >
                {FONTS.map((font) => (
                  <Button
                    key={font}
                    fontFamily={font}
                    selected={settings.fontFamily === font}
                    color="transparent"
                    onClick={() =>
                      updateSettings({
                        fontFamily: font,
                      })
                    }
                  >
                    {font}
                  </Button>
                ))}
              </Collapsible>
            ) : (
              <Stack>
                <Input
                  fluid
                  value={settings.fontFamily}
                  expensive
                  onChange={(value) =>
                    updateSettings({
                      fontFamily: value,
                    })
                  }
                />
                <Button
                  ml={0.5}
                  icon={freeFont ? 'lock-open' : 'lock'}
                  color={freeFont ? 'good' : 'bad'}
                  onClick={() => {
                    setFreeFont(!freeFont);
                  }}
                >
                  Custom font
                </Button>
              </Stack>
            )}
          </Stack.Item>
        </LabeledList.Item>
        <LabeledList.Item label="Font size" verticalAlign="middle">
          <Stack textAlign="center">
            <Stack.Item grow>
              <Slider
                width="100%"
                step={1}
                stepPixelSize={20}
                minValue={8}
                maxValue={32}
                value={settings.fontSize}
                unit="px"
                format={(value) => toFixed(value)}
                onChange={(e, value) => updateSettings({ fontSize: value })}
              />
            </Stack.Item>
          </Stack>
        </LabeledList.Item>
        <LabeledList.Item label="Line height">
          <Slider
            width="100%"
            step={0.01}
            minValue={0.8}
            maxValue={5}
            value={settings.lineHeight}
            format={(value) => toFixed(value, 2)}
            onDrag={(e, value) =>
              updateSettings({
                lineHeight: value,
              })
            }
          />
        </LabeledList.Item>
      </LabeledList>
      <Divider />
      <Stack fill>
        <Stack.Item mt={0.15}>
          <Button
            icon="compact-disc"
            tooltip="Export chat settings"
            onClick={exportSettings}
          >
            Export settings
          </Button>
        </Stack.Item>
        <Stack.Item mt={0.15}>
          <Button.File
            accept=".json"
            tooltip="Import chat settings"
            icon="arrow-up-from-bracket"
            onSelectFiles={importChatSettings}
          >
            Import settings
          </Button.File>
        </Stack.Item>
        <Stack.Item grow mt={0.15}>
          <Button
            icon="save"
            tooltip="Export current tab history into HTML file"
            onClick={saveChatToDisk}
          >
            Save chat log
          </Button>
        </Stack.Item>
        <Stack.Item mt={0.15}>
          <Button.Confirm
            icon="trash"
            tooltip="Erase current tab history"
            onClick={clearChat}
          >
            Clear chat
          </Button.Confirm>
        </Stack.Item>
      </Stack>
    </Section>
  );
}
