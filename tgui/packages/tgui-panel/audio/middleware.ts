/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import { player } from "../events/handlers/audio";

/** External source */
export const audioMiddleware = (store) => {
  return (next) => (action) => {
    const { type, payload } = action;
    if (type === 'settings/update' || type === 'settings/load') {
      const volume = payload?.adminMusicVolume;
      if (typeof volume === 'number') {
        player.setVolume(volume);
      }
      return next(action);
    }
    return next(action);
  };
};
