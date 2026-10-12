import { ElementData } from './element';

export type VisualizationMode = 'bohr' | 'orbital' | 'nucleus-3d';

export interface AtomCounts {
  protons: number;
  neutrons: number;
  electrons: number;
}

export type IonType = 'neutral' | 'cation' | 'anion';

export interface AtomDerivedProperties {
  massNumber: number;
  netCharge: number;
  chargeFormatted: string; // e.g. "0", "+1", "2+", "2-"
  ionType: IonType;
  element: ElementData | null;
  electronShells: number[]; // Distributed electrons across n=1..7 shells
  valenceElectrons: number;
  isStableIsotope: boolean | null; // null if unknown
  stabilityDescription: string;
}

export interface AtomState extends AtomCounts {
  mode: VisualizationMode;
  selectedElementNumber: number | null;
  isCustomAtom: boolean;
}
