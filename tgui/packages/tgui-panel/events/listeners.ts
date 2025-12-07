import { playMusic, stopMusic } from './handlers/audio';

export const listeners = {
  'audio/playMusic': playMusic,
  'audio/stopMusic': stopMusic,
} as const;
