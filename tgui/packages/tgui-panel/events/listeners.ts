import { playMusic, stopMusic } from '../audio/handlers';
import { pingReply, pingSoft } from '../ping/handlers';

export const listeners = {
  'audio/playMusic': playMusic,
  'audio/stopMusic': stopMusic,
  'ping/soft': pingSoft,
  'ping/reply': pingReply,
} as const;
