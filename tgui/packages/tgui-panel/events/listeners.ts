import { playMusic, stopMusic } from '../audio/handlers';
import { chatMessage } from '../chat/handlers';
import { pingReply, pingSoft } from '../ping/handlers';
import { roundRestart } from './handlers/roundrestart';

export const listeners = {
  'audio/playMusic': playMusic,
  'audio/stopMusic': stopMusic,
  'ping/soft': pingSoft,
  'ping/reply': pingReply,
  roundrestart: roundRestart,
  //telemetry/request
  'chat/message': chatMessage,
} as const;
