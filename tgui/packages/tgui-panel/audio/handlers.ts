import { metaAtom, playingAtom, store, visibleAtom } from '../events/store';
import { AudioPlayer } from './player';

export const player = new AudioPlayer();

player.onPlay(() => {
  store.set(playingAtom, true);
  store.set(visibleAtom, true);
});
player.onStop(() => {
  store.set(playingAtom, false);
  store.set(visibleAtom, false);
  store.set(metaAtom, null);
});

type PlayPayload = {
  url: string;
  pitch: number;
  start: number;
  end: number;
};

export function playMusic(payload: PlayPayload) {
  const { url, ...options } = payload;
  player.play(url, options);
  store.set(metaAtom, payload as any);
}

type SetVolumePayload = {
  adminMusicVolume: number;
};

export function stopMusic(): void {
  player.stop();
}

// settings/update and settings/load
export function setMusicVolume(payload: SetVolumePayload) {
  const { adminMusicVolume: volume } = payload;
  if (typeof volume !== 'number') return;
  player.setVolume(volume);
}
