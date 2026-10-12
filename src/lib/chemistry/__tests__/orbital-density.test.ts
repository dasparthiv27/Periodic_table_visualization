import { describe, expect, it } from 'vitest';
import { ELEMENTS_MAP } from '../../../data/elements';
import {
  getSupportedOrbitalOptions,
  hydrogenicOrbitalDensity,
  parseSubshellOccupancies,
  sampleHydrogenicOrbital,
} from '../orbital-density';

describe('hydrogenic orbital density utilities', () => {
  it('expands dataset configurations for hydrogen, carbon, sodium, iron, and a lanthanide', () => {
    const hydrogen = ELEMENTS_MAP.get(1)!;
    const carbon = ELEMENTS_MAP.get(6)!;
    const sodium = ELEMENTS_MAP.get(11)!;
    const iron = ELEMENTS_MAP.get(26)!;
    const neodymium = ELEMENTS_MAP.get(60)!;

    expect(getSupportedOrbitalOptions(hydrogen.electronConfiguration).map(({ id }) => id)).toEqual(['1s']);
    expect(getSupportedOrbitalOptions(carbon.electronConfiguration).map(({ id }) => id)).toEqual(['1s', '2px', '2py', '2pz']);
    expect(getSupportedOrbitalOptions(sodium.electronConfiguration).map(({ id }) => id)).toEqual(['1s', '2px', '2py', '2pz']);
    expect(getSupportedOrbitalOptions(iron.electronConfiguration).map(({ id }) => id)).toEqual(['1s', '2px', '2py', '2pz']);
    expect(getSupportedOrbitalOptions(neodymium.electronConfiguration).map(({ id }) => id)).toEqual(['1s', '2px', '2py', '2pz']);
    expect(parseSubshellOccupancies(neodymium.electronConfiguration).get('2p')).toBe(6);
  });

  it('evaluates normalized hydrogenic densities and the 2p nodal plane', () => {
    expect(hydrogenicOrbitalDensity('1s', 0, 0, 0)).toBeCloseTo(1 / Math.PI);
    expect(hydrogenicOrbitalDensity('1s', 1, 0, 0)).toBeLessThan(hydrogenicOrbitalDensity('1s', 0, 0, 0));
    expect(hydrogenicOrbitalDensity('2pz', 0.5, 0, 0)).toBe(0);
    expect(hydrogenicOrbitalDensity('2pz', 0, 0, 1)).toBeGreaterThan(0);
    expect(hydrogenicOrbitalDensity('2pz', 0, 0, -1)).toBe(hydrogenicOrbitalDensity('2pz', 0, 0, 1));
    expect(hydrogenicOrbitalDensity('2px', 1, 0, 0)).toBeGreaterThan(hydrogenicOrbitalDensity('2px', 0, 0, 1));
  });

  it('creates a deterministic finite point sample from the selected density', () => {
    const first = sampleHydrogenicOrbital('2pz', 128);
    const second = sampleHydrogenicOrbital('2pz', 128);
    expect(first).toHaveLength(128 * 3);
    expect([...first]).toEqual([...second]);
    expect([...first].every(Number.isFinite)).toBe(true);
    expect(first.some((_coordinate, index) => index % 3 === 2 && (first[index] ?? 0) > 0)).toBe(true);
    expect(first.some((_coordinate, index) => index % 3 === 2 && (first[index] ?? 0) < 0)).toBe(true);
  });
});
