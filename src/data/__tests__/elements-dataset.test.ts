import { describe, it, expect } from 'vitest';
import { ELEMENTS, ELEMENTS_MAP, getElementByAtomicNumber } from '../elements';

describe('118-Element IUPAC Dataset Verification', () => {
  it('contains exactly 118 elements', () => {
    expect(ELEMENTS).toHaveLength(118);
  });

  it('covers atomic numbers 1 through 118 contiguously without gaps', () => {
    ELEMENTS.forEach((el, index) => {
      expect(el.atomicNumber).toBe(index + 1);
    });
  });

  it('ensures all 118 chemical symbols are unique and formatted correctly', () => {
    const symbolSet = new Set<string>();
    ELEMENTS.forEach((el) => {
      expect(el.symbol).toMatch(/^[A-Z][a-z]?$/);
      expect(symbolSet.has(el.symbol)).toBe(false);
      symbolSet.add(el.symbol);
    });
    expect(symbolSet.size).toBe(118);
  });

  it('ensures all 118 element names are unique', () => {
    const nameSet = new Set<string>();
    ELEMENTS.forEach((el) => {
      expect(nameSet.has(el.name.toLowerCase())).toBe(false);
      nameSet.add(el.name.toLowerCase());
    });
    expect(nameSet.size).toBe(118);
  });

  it('verifies periods are valid (1 through 7)', () => {
    ELEMENTS.forEach((el) => {
      expect(el.period).toBeGreaterThanOrEqual(1);
      expect(el.period).toBeLessThanOrEqual(7);
    });
  });

  it('verifies group assignments adhere to IUPAC standards', () => {
    ELEMENTS.forEach((el) => {
      if (el.group !== null) {
        expect(el.group).toBeGreaterThanOrEqual(1);
        expect(el.group).toBeLessThanOrEqual(18);
      }
    });
  });

  it('verifies lanthanide series (atomic numbers 57 to 71)', () => {
    const lanthanides = ELEMENTS.filter((el) => el.category === 'lanthanide');
    expect(lanthanides).toHaveLength(15);
    expect(lanthanides[0]?.atomicNumber).toBe(57); // La
    expect(lanthanides[0]?.symbol).toBe('La');
    expect(lanthanides[14]?.atomicNumber).toBe(71); // Lu
    expect(lanthanides[14]?.symbol).toBe('Lu');

    lanthanides.forEach((el) => {
      expect(el.period).toBe(6);
      expect(el.group).toBeNull();
    });
  });

  it('verifies actinide series (atomic numbers 89 to 103)', () => {
    const actinides = ELEMENTS.filter((el) => el.category === 'actinide');
    expect(actinides).toHaveLength(15);
    expect(actinides[0]?.atomicNumber).toBe(89); // Ac
    expect(actinides[0]?.symbol).toBe('Ac');
    expect(actinides[14]?.atomicNumber).toBe(103); // Lr
    expect(actinides[14]?.symbol).toBe('Lr');

    actinides.forEach((el) => {
      expect(el.period).toBe(7);
      expect(el.group).toBeNull();
    });
  });

  it('ensures electron shells sum up to atomic number for every element', () => {
    ELEMENTS.forEach((el) => {
      const sum = el.electronsPerShell.reduce((acc, curr) => acc + curr, 0);
      expect(sum).toBe(el.atomicNumber);
    });
  });

  it('ELEMENTS_MAP and getElementByAtomicNumber perform O(1) lookups', () => {
    expect(ELEMENTS_MAP.size).toBe(118);

    const gold = getElementByAtomicNumber(79);
    expect(gold).toBeDefined();
    expect(gold?.name).toBe('Gold');
    expect(gold?.symbol).toBe('Au');
    expect(gold?.atomicMass).toBe(196.97);

    const oganesson = getElementByAtomicNumber(118);
    expect(oganesson).toBeDefined();
    expect(oganesson?.name).toBe('Oganesson');
    expect(oganesson?.symbol).toBe('Og');
  });

  it('handles elements with undefined/null properties safely', () => {
    const meitnerium = getElementByAtomicNumber(109);
    expect(meitnerium).toBeDefined();
    expect(meitnerium?.meltingPoint).toBeNull();
    expect(meitnerium?.electronegativity).toBeNull();
    expect(meitnerium?.standardState).toBe('unknown');
  });
});
