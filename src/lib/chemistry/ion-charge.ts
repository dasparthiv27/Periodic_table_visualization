import { IonType } from '../../types/atom';

/**
 * Calculates net electrical charge from subatomic particle counts:
 * Net Charge = Protons (each +1) - Electrons (each -1)
 */
export function calculateNetCharge(protons: number, electrons: number): number {
  if (protons < 0 || electrons < 0) {
    throw new Error('Particle counts cannot be negative.');
  }
  return protons - electrons;
}

/**
 * Classifies an atom's ionization state:
 * - neutral: charge == 0
 * - cation: charge > 0 (more protons than electrons)
 * - anion: charge < 0 (more electrons than protons)
 */
export function getIonType(netCharge: number): IonType {
  if (netCharge > 0) return 'cation';
  if (netCharge < 0) return 'anion';
  return 'neutral';
}

/**
 * Formats a charge in standard chemical notation:
 * 0 -> "0"
 * +1 -> "+1" (or "1+")
 * +2 -> "2+"
 * -1 -> "1-"
 * -2 -> "2-"
 */
export function formatCharge(netCharge: number): string {
  if (netCharge === 0) return '0';
  const magnitude = Math.abs(netCharge);
  const sign = netCharge > 0 ? '+' : '−';
  return `${magnitude}${sign}`;
}

/**
 * Superscript mapping for chemical ion notation.
 */
const SUPERSCRIPTS: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '+': '⁺',
  '-': '⁻',
  '−': '⁻',
};

/**
 * Formats element symbol with ion charge superscript (e.g. Fe³⁺, O²⁻, Na⁺, He)
 */
export function formatIonSymbol(symbol: string, netCharge: number): string {
  if (netCharge === 0) return symbol;
  const abs = Math.abs(netCharge);
  const sign = netCharge > 0 ? '+' : '-';
  const formattedSuffix = (abs === 1 ? sign : `${abs}${sign}`)
    .split('')
    .map((char) => SUPERSCRIPTS[char] || char)
    .join('');
  return `${symbol}${formattedSuffix}`;
}
