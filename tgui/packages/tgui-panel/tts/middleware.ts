import { Store } from 'common/redux';
import { Howl } from 'howler';

export function ttsMiddleware(store: Store) {
  return (next) => (action) => {
    const { type, payload } = action;

    if (type === 'tts/play') {
      handleTTS(payload);

      return next(action);
    }

    return next(action);
  };
}

type TTSPayload = {
  url: string;
  from: [number, number];
  to: [number, number];
};

/** Handles calling Howler to play a sound */
function handleTTS(payload: TTSPayload) {
  const { from, to, url } = payload;
  const delta = calculatePosition(from, to);

  const sound = new Howl({
    src: [url],
    html5: true,
  });

  sound.pos(...delta);
  sound.play();
}

type Point = [number, number];

/** Simple 2D vector calculation */
function calculatePosition(from: Point, to: Point): Point {
  const [fromX, fromY] = from;
  const [toX, toY] = to;

  const deltaX = toX - fromX;
  const deltaY = toY - fromY;

  return [deltaX, deltaY];
}
