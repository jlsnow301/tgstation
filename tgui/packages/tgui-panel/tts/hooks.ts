import { useDispatch, useSelector } from 'tgui/backend';

import { selectTTS } from './selectors';

export function useTTS() {
  const state = useSelector(selectTTS);
  const dispatch = useDispatch();

  return {
    tts: state.tts,
    playTTS: (url: string) => dispatch({ type: 'tts/play', payload: { url } }),
  };
}
