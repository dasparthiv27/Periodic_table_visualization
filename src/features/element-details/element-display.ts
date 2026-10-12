import { ElementData } from '../../types/element';

export function formatGroup(element: ElementData): string {
  return element.group === null ? 'Not assigned (f-block series)' : String(element.group);
}

export function formatDensity(element: ElementData): string {
  if (element.density === null) return 'Not available in dataset';
  const unit = element.standardState === 'gas' ? 'g/L at STP' : 'g/cm³';
  return `${element.density} ${unit}`;
}

export function formatOxidationStates(element: ElementData): string {
  return element.commonOxidationStates?.length
    ? element.commonOxidationStates.map((state) => state > 0 ? `+${state}` : String(state)).join(', ')
    : 'Not available in dataset';
}

export function formatDiscovery(element: ElementData): string {
  if (!element.discoveredBy && !element.yearDiscovered) return 'Not available in dataset';
  const discoverer = element.discoveredBy ?? 'Discoverer not recorded';
  const year = element.yearDiscovered === null ? 'year not recorded' : String(element.yearDiscovered);
  return `${discoverer} (${year})`;
}
