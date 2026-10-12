/**
 * Helper to combine CSS class names, filtering out falsy values.
 */
export function cn(...classes: Array<string | undefined | null | false>): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Clamp a number between min and max inclusive.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Format large or small numbers with sensible scientific or fixed precision.
 */
export function formatNumber(val: number, decimals = 3): string {
  if (Number.isInteger(val)) return val.toString();
  return Number(val.toFixed(decimals)).toString();
}
