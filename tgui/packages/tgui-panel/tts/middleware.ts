import { Store } from 'common/redux';
import { Howl } from 'howler';
import { logger } from 'tgui/logging';

export function ttsMiddleware(store: Store) {
  return (next) => (action) => {
    const { type, payload } = action;

    if (type === 'tts/play') {
      logger.log(payload);
      const { url } = payload;

      if (url) {
        new Howl({
          src: [url],
          html5: true,
          autoplay: true,
        });
      }

      return next(action);
    }

    return next(action);
  };
}
