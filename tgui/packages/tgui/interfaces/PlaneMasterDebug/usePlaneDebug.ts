import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
} from 'react';
import type { PlaneHighlight, PlaneMap } from './types';

type Fn = (...args: any[]) => any;

type PlaneDebug = {
  connectionHighlight: PlaneHighlight | undefined;
  setConnectionHighlight: Dispatch<SetStateAction<PlaneHighlight | undefined>>;
  activePlane: number | undefined;
  setActivePlane: Dispatch<SetStateAction<number | undefined>>;
  connectionOpen: boolean;
  setConnectionOpen: Dispatch<SetStateAction<boolean>>;
  infoOpen: boolean;
  setInfoOpen: Dispatch<SetStateAction<boolean>>;
  planeOpen: boolean;
  setPlaneOpen: Dispatch<SetStateAction<boolean>>;
  planesProcessed: PlaneMap;
  act: Fn;
};

export const PlaneDebugContext = createContext({} as PlaneDebug);

export function usePlaneDebugContext() {
  return useContext(PlaneDebugContext);
}
