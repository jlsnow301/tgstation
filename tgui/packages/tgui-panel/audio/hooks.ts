/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import { useDispatch, useSelector } from '../store/backend';

import { selectAudio } from './selectors';

export const useAudio = () => {
  const state = useSelector(selectAudio);
  const dispatch = useDispatch();
  return {
    ...state,
    toggle: () => dispatch({ type: 'audio/toggle' }),
  };
};
