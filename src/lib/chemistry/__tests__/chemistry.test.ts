import { describe, it, expect } from 'vitest';
import {
  calculateMassNumber,
  determineIsotopeStability,
  deriveAtomProperties,
} from '../atomic-properties';
import {
  calculateNetCharge,
  formatCharge,
  getIonType,
  formatIonSymbol,
} from '../ion-charge';
import {
  distributeElectronsToShells,
  getValenceElectrons,
  formatSuperscriptConfig,
} from '../electron-configuration';
import { SAMPLE_ELEMENTS_MAP } from '../../../data/elements';

describe('Atomic Properties & Nuclear Physics', () => {
  it('correctly calculates mass number (A = Z + N)', () => {
    expect(calculateMassNumber(1, 0)).toBe(1); // Protium
    expect(calculateMassNumber(6, 6)).toBe(12); // Carbon-12
    expect(calculateMassNumber(26, 30)).toBe(56); // Iron-56
    expect(calculateMassNumber(79, 118)).toBe(197); // Gold-197
  });

  it('rejects negative subatomic particle counts', () => {
    expect(() => calculateMassNumber(-1, 5)).toThrow();
    expect(() => calculateMassNumber(6, -2)).toThrow();
  });

  it('correctly assesses isotope stability', () => {
    const carbon = SAMPLE_ELEMENTS_MAP.get(6)!;

    // Stable C-12
    const c12 = determineIsotopeStability(6, 6, carbon);
    expect(c12.isStable).toBe(true);
    expect(c12.matchedIsotope?.isStable).toBe(true);

    // Radioactive C-14
    const c14 = determineIsotopeStability(6, 8, carbon);
    expect(c14.isStable).toBe(false);
    expect(c14.description).toContain('Radioactive');

    // Free neutron (Z=0, N=1)
    const freeNeutron = determineIsotopeStability(0, 1, null);
    expect(freeNeutron.isStable).toBe(false);
    expect(freeNeutron.description).toContain('Free neutron');
  });
});

describe('Ion Charge Calculations', () => {
  it('calculates net electrical charge accurately', () => {
    expect(calculateNetCharge(6, 6)).toBe(0); // Neutral
    expect(calculateNetCharge(26, 23)).toBe(3); // Fe3+ cation
    expect(calculateNetCharge(8, 10)).toBe(-2); // O2- anion
  });

  it('classifies ion types', () => {
    expect(getIonType(0)).toBe('neutral');
    expect(getIonType(2)).toBe('cation');
    expect(getIonType(-1)).toBe('anion');
  });

  it('formats charges according to standard chemical nomenclature', () => {
    expect(formatCharge(0)).toBe('0');
    expect(formatCharge(1)).toBe('1+');
    expect(formatCharge(3)).toBe('3+');
    expect(formatCharge(-2)).toBe('2−');
  });

  it('formats ion symbols with proper superscripts', () => {
    expect(formatIonSymbol('Fe', 0)).toBe('Fe');
    expect(formatIonSymbol('Fe', 3)).toBe('Fe³⁺');
    expect(formatIonSymbol('O', -2)).toBe('O²⁻');
    expect(formatIonSymbol('Na', 1)).toBe('Na⁺');
    expect(formatIonSymbol('Cl', -1)).toBe('Cl⁻');
  });
});

describe('Electron Shell Distribution & Configurations', () => {
  it('distributes ground-state electrons to shells for neutral elements', () => {
    expect(distributeElectronsToShells(1, [1])).toEqual([1]);
    expect(distributeElectronsToShells(2, [2])).toEqual([2]);
    expect(distributeElectronsToShells(6, [2, 4])).toEqual([2, 4]);
    expect(distributeElectronsToShells(8, [2, 6])).toEqual([2, 6]);
    expect(distributeElectronsToShells(26, [2, 8, 14, 2])).toEqual([2, 8, 14, 2]);
  });

  it('correctly models electron loss for cations from valence shell', () => {
    // Fe loses 2 electrons (Fe²⁺) -> 24 electrons
    const fe2Plus = distributeElectronsToShells(24, [2, 8, 14, 2]);
    expect(fe2Plus).toEqual([2, 8, 14]);

    // Fe loses 3 electrons (Fe³⁺) -> 23 electrons
    const fe3Plus = distributeElectronsToShells(23, [2, 8, 14, 2]);
    expect(fe3Plus).toEqual([2, 8, 13]);
  });

  it('calculates valence electrons', () => {
    expect(getValenceElectrons([2, 4])).toBe(4);
    expect(getValenceElectrons([2, 8, 14, 2])).toBe(2);
    expect(getValenceElectrons([])).toBe(0);
  });

  it('formats electron subshell superscript notation', () => {
    expect(formatSuperscriptConfig('1s2 2s2 2p6')).toBe('1s² 2s² 2p⁶');
    expect(formatSuperscriptConfig('[Ar] 3d6 4s2')).toBe('[Ar] 3d⁶ 4s²');
  });
});

describe('deriveAtomProperties Integration', () => {
  it('computes integrated atomic properties for Carbon-12', () => {
    const props = deriveAtomProperties({ protons: 6, neutrons: 6, electrons: 6 });
    expect(props.massNumber).toBe(12);
    expect(props.netCharge).toBe(0);
    expect(props.ionType).toBe('neutral');
    expect(props.element?.name).toBe('Carbon');
    expect(props.electronShells).toEqual([2, 4]);
    expect(props.valenceElectrons).toBe(4);
    expect(props.isStableIsotope).toBe(true);
  });
});
