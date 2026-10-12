import { describe, expect, it } from 'vitest';
import { ELEMENTS } from '../../../data/elements';
import { getElementMatches } from '../element-filters';

const noFilters = { query: '', category: null, period: null, group: null, block: null } as const;

describe('element discovery filters', () => {
  it('searches names, symbols, and atomic numbers', () => {
    expect(getElementMatches(ELEMENTS, { ...noFilters, query: 'Iron' }).matchingMap.get(26)).toBe(true);
    expect(getElementMatches(ELEMENTS, { ...noFilters, query: 'Fe' }).matchingMap.get(26)).toBe(true);
    expect(getElementMatches(ELEMENTS, { ...noFilters, query: '26' }).matchingMap.get(26)).toBe(true);
  });

  it('filters by period, group, block, and category together', () => {
    const result = getElementMatches(ELEMENTS, {
      ...noFilters,
      period: 4,
      group: 8,
      block: 'd',
      category: 'transition-metal',
    });
    expect(result.matchCount).toBe(1);
    expect(result.matchingMap.get(26)).toBe(true);
    expect(result.matchingMap.get(27)).toBe(false);
  });

  it('can find f-block records whose group is unassigned', () => {
    const result = getElementMatches(ELEMENTS, { ...noFilters, group: 'unassigned', block: 'f' });
    expect(result.matchCount).toBeGreaterThan(0);
    expect(result.matchingMap.get(58)).toBe(true);
    expect(result.matchingMap.get(57)).toBe(true); // Lanthanum is classified in the f block in this dataset.
  });
});
