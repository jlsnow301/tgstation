import { logger } from 'tgui/logging';
import { AudioPlayer } from '../../audio/player';
import { metaAtom, playingAtom, store, visibleAtom } from '../store';

export const player = new AudioPlayer();

player.onPlay(() => {
  store.set(playingAtom, true);
  store.set(visibleAtom, true);
});
player.onStop(() => {
  store.set(playingAtom, false);
  store.set(visibleAtom, false);
});

type PlayPayload = {
  url: string;
  pitch: number;
  start: number;
  end: number;
};

export function playMusic(payload: PlayPayload) {
  const { url, ...options } = payload;
  logger.log('playing music');
  player.play(url, options);
  store.set(metaAtom, payload as any);
}

export function stopMusic() {
  player.stop();
  store.set(metaAtom, null);
}

type SetVolumePayload = {
  adminMusicVolume: number;
};

// settings/update and settings/load
export function setMusicVolume(payload: SetVolumePayload) {
  const { adminMusicVolume: volume } = payload;

  if (typeof volume !== 'number') return;

  player.setVolume(volume);
}
