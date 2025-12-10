import { playMusic, stopMusic } from '../audio/handlers';
import { roundrestart } from '../game/handlers';
import { pingReply, pingSoft } from '../ping/handlers';

export const listeners = {
  'audio/playMusic': playMusic,
  'audio/stopMusic': stopMusic,
  'ping/soft': pingSoft,
  'ping/reply': pingReply,
  roundrestart,
} as const;
