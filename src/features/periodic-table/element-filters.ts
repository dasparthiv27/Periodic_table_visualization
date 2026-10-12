import { ElementCategory, ElementData, ElementBlock } from '../../types/element';

export interface ElementFilters {
  query: string;
  category: ElementCategory | null;
  period: number | null;
  group: number | 'unassigned' | null;
  block: ElementBlock | null;
}

export function getElementMatches(elements: ElementData[], filters: ElementFilters) {
  const query = filters.query.trim().toLowerCase();
  const matchingMap = new Map<number, boolean>();
  let matchCount = 0;

  for (const element of elements) {
    const matchesQuery = !query ||
      element.name.toLowerCase().includes(query) ||
      element.symbol.toLowerCase().includes(query) ||
      String(element.atomicNumber).startsWith(query);
    const matchesGroup = filters.group === null ||
      (filters.group === 'unassigned' ? element.group === null : element.group === filters.group);
    const matches = matchesQuery &&
      (!filters.category || element.category === filters.category) &&
      (filters.period === null || element.period === filters.period) &&
      matchesGroup &&
      (!filters.block || element.block === filters.block);
    matchingMap.set(element.atomicNumber, matches);
    if (matches) matchCount++;
  }

  return { matchingMap, matchCount };
}
