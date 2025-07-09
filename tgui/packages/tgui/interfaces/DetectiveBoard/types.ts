import type { Connection } from '../common/Connections';

export type DataCase = {
  color: string;
  connections: Connection[];
  evidences: DataEvidence[];
  name: string;
  ref: string;
};

export type DataEvidence = {
  connections: string[];
  description: string;
  name: string;
  photo_url: string;
  ref: string;
  text: string;
  type: string;
  x: number;
  y: number;
};

export type XYCoords = {
  x: number;
  y: number;
};

export type EvidenceXYFn = (evidence: DataEvidence, mousePos: XYCoords) => void;

export type EvidenceFn = (evidence: DataEvidence) => void;
