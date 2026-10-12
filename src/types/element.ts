export type ElementCategory =
  | 'diatomic-nonmetal'
  | 'polyatomic-nonmetal'
  | 'noble-gas'
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'metalloid'
  | 'post-transition-metal'
  | 'transition-metal'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export type ElementBlock = 's' | 'p' | 'd' | 'f';

export type StandardState = 'solid' | 'liquid' | 'gas' | 'unknown';

export interface Isotope {
  massNumber: number;
  neutrons: number;
  abundance?: number; // percentage (0 - 100)
  isStable: boolean;
  halfLife?: string;
}

export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number;
  category: ElementCategory;
  group: number | null; // 1-18 or null for f-block series
  period: number; // 1-7
  block: ElementBlock;
  standardState: StandardState;
  electronConfiguration: string;
  electronsPerShell: number[];
  electronegativity: number | null; // Pauling scale
  ionizationEnergy: number | null; // kJ/mol
  meltingPoint: number | null; // Kelvin
  boilingPoint: number | null; // Kelvin
  density: number | null; // g/cm³ or g/L for gases at STP
  discoveredBy: string | null;
  yearDiscovered: number | string | null;
  summary: string;
  commonOxidationStates?: number[];
  commonIsotopes: Isotope[];
}
