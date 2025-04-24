/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import {
  Button,
  Collapsible,
  Knob,
  Section,
  Stack,
} from 'tgui-core/components';
import { toFixed } from 'tgui-core/math';

import { useAudioStore } from '../events/stores/audio';
import { useAudio } from './hook';
import { AudioPlayer } from './player';

export const player = new AudioPlayer();
player.onPlay(() => useAudioStore.getState().setPlaying(true));
player.onStop(() => useAudioStore.getState().setPlaying(false));

function getDate(uploaded: string | undefined): string {
  if (!uploaded) return 'Unknown Date';

  const date = !isNaN(Number(uploaded))
    ? uploaded?.substring(0, 4) +
      '-' +
      uploaded?.substring(4, 6) +
      '-' +
      uploaded?.substring(6, 8)
    : uploaded;

  return date;
}

export function NowPlayingWidget(props) {
  const { meta, playing, stopMusic } = useAudio();
  const {
    title = 'Unknown Track',
    link: URL,
    artist = 'Unknown Artist',
    upload_date,
    album = 'Unknown Album',
    duration,
  } = meta;

  const date = getDate(upload_date);

  return (
    <Stack align="center">
      {!playing ? (
        <Stack.Item grow color="label">
          Nothing to play.
        </Stack.Item>
      ) : (
        <Stack.Item
          grow
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {
            <Collapsible title={title} color="blue">
              <Section>
                {URL !== 'Song Link Hidden' && (
                  <Stack.Item grow={1} color="label">
                    URL: {URL}
                  </Stack.Item>
                )}
                <Stack.Item grow={1} color="label">
                  Duration: {duration}
                </Stack.Item>
                {artist !== 'Song Artist Hidden' &&
                  artist !== 'Unknown Artist' && (
                    <Stack.Item grow={1} color="label">
                      Artist: {artist}
                    </Stack.Item>
                  )}
                {album !== 'Song Album Hidden' && album !== 'Unknown Album' && (
                  <Stack.Item grow={1} color="label">
                    Album: {album}
                  </Stack.Item>
                )}
                {upload_date !== 'Song Upload Date Hidden' &&
                  upload_date !== 'Unknown Date' && (
                    <Stack.Item grow={1} color="label">
                      Uploaded: {date}
                    </Stack.Item>
                  )}
              </Section>
            </Collapsible>
          }
        </Stack.Item>
      )}
      {playing && (
        <Stack.Item fontSize="0.9em">
          <Button tooltip="Stop" icon="stop" onClick={stopMusic} />
        </Stack.Item>
      )}
      <Stack.Item fontSize="0.9em">
        <Knob
          minValue={0}
          maxValue={1}
          value={settings.adminMusicVolume}
          step={0.0025}
          stepPixelSize={1}
          format={(value) => toFixed(value * 100) + '%'}
          onDrag={(e, value) =>
            settings.update({
              adminMusicVolume: value,
            })
          }
        />
      </Stack.Item>
    </Stack>
  );
}
