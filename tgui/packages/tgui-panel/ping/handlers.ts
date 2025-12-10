import { scale } from 'tgui-core/math';
import { store } from '../events/store';
import { setLastPing } from '../game/hooks';
import { pingAtom } from './atoms';
import {
  PING_QUEUE_SIZE,
  PING_ROUNDTRIP_BEST,
  PING_ROUNDTRIP_WORST,
  PING_TIMEOUT,
} from './constants';

let initialized = false;
let index = 0;
const pings: Ping[] = [];

type Ping = {
  index: number;
  sentAt: number;
} | null;

// ------- Event Handlers --------------------------------------------------- //

type SoftPingPayload = {
  afk: boolean;
};

/**
 * Soft ping from the server.
 * It's intended to send periodic server-side metadata about the client,
 * e.g. its AFK status.
 */
export function pingSoft(payload: SoftPingPayload): void {
  const { afk } = payload;
  handleInitialize();

  // On each soft ping where client is not flagged as afk,
  // initiate a new ping.
  if (!afk) {
    sendPing();
  }
}

type ReplyPingPayload = {
  index: number;
};

export function pingReply(payload: ReplyPingPayload) {
  const { index } = payload;
  handleInitialize();

  const ping = pings[index];
  if (!ping) return; // This ping was already marked as failed due to timeout.

  pings[index] = null;
  const roundtrip = (Date.now() - ping.sentAt) * 0.5;

  pingSuccess(roundtrip);
}

//------- Helpers ------------------------------------------------------------//

/** Sends a ping to byond */
function sendPing(): void {
  for (let i = 0; i < PING_QUEUE_SIZE; i++) {
    const ping = pings[i];
    if (ping && Date.now() - ping.sentAt > PING_TIMEOUT) {
      pings[i] = null;
      pingFail();
    }
  }
  const ping = { index, sentAt: Date.now() };
  pings[index] = ping;
  Byond.sendMessage('ping', { index });
  index = (index + 1) % PING_QUEUE_SIZE;
}

function handleInitialize(): void {
  if (!initialized) {
    initialized = true;
    sendPing();
  }

  setLastPing();
}

function pingSuccess(roundtrip: number): void {
  const state = store.get(pingAtom);
  const prevRoundtrip = state.roundtripAvg || roundtrip;
  const roundtripAvg = Math.round(prevRoundtrip * 0.4 + roundtrip * 0.6);

  const networkQuality =
    1 - scale(roundtripAvg, PING_ROUNDTRIP_BEST, PING_ROUNDTRIP_WORST);

  store.set(pingAtom, {
    roundtrip,
    roundtripAvg,
    failCount: 0,
    networkQuality,
  });
}

function pingFail(): void {
  const state = store.get(pingAtom);
  const { failCount = 0 } = state;

  const networkQuality = Math.max(
    0,
    state.networkQuality - failCount / PING_QUEUE_SIZE,
  );

  const nextState = {
    ...state,
    failCount: failCount + 1,
    networkQuality,
  };

  if (failCount > PING_QUEUE_SIZE) {
    nextState.roundtrip = undefined;
    nextState.roundtripAvg = undefined;
  }

  store.set(pingAtom, nextState);
}
