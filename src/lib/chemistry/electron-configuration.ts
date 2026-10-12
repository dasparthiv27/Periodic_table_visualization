/**
 * Electron configuration and shell distribution utilities.
 * Distinguishes between Bohr-model educational shell capacities and
 * ground-state quantum subshell filling (Aufbau principle).
 */

interface Subshell {
  n: number;
  type: 's' | 'p' | 'd' | 'f';
  capacity: number;
}

/**
 * Standard Aufbau filling order (Madelung rule) for neutral ground states.
 * Note: Certain transition metals and actinides have known exceptions (e.g. Cr, Cu, Au).
 */
const AUFBAU_ORDER: Subshell[] = [
  { n: 1, type: 's', capacity: 2 },
  { n: 2, type: 's', capacity: 2 },
  { n: 2, type: 'p', capacity: 6 },
  { n: 3, type: 's', capacity: 2 },
  { n: 3, type: 'p', capacity: 6 },
  { n: 4, type: 's', capacity: 2 },
  { n: 3, type: 'd', capacity: 10 },
  { n: 4, type: 'p', capacity: 6 },
  { n: 5, type: 's', capacity: 2 },
  { n: 4, type: 'd', capacity: 10 },
  { n: 5, type: 'p', capacity: 6 },
  { n: 6, type: 's', capacity: 2 },
  { n: 4, type: 'f', capacity: 14 },
  { n: 5, type: 'd', capacity: 10 },
  { n: 6, type: 'p', capacity: 6 },
  { n: 7, type: 's', capacity: 2 },
  { n: 5, type: 'f', capacity: 14 },
  { n: 6, type: 'd', capacity: 10 },
  { n: 7, type: 'p', capacity: 6 },
];

/**
 * Computes electron distribution across principal shells (n = 1, 2, 3...)
 * for a given number of electrons.
 *
 * If standard neutral element configuration is provided and electron count matches,
 * the verified empirical configuration is returned.
 * For ions, electrons are added to or removed from the valence shell.
 */
export function distributeElectronsToShells(
  totalElectrons: number,
  empiricalNeutralShells?: number[]
): number[] {
  if (totalElectrons <= 0) return [];

  // If neutral and empirical shells match:
  if (
    empiricalNeutralShells &&
    empiricalNeutralShells.reduce((a, b) => a + b, 0) === totalElectrons
  ) {
    return [...empiricalNeutralShells];
  }

  // If ionized from known neutral configuration:
  if (empiricalNeutralShells && empiricalNeutralShells.length > 0) {
    const neutralTotal = empiricalNeutralShells.reduce((a, b) => a + b, 0);
    const diff = totalElectrons - neutralTotal;

    if (diff < 0) {
      // Cation: remove electrons from outermost non-empty shells first
      const shells = [...empiricalNeutralShells];
      let toRemove = Math.abs(diff);

      for (let i = shells.length - 1; i >= 0 && toRemove > 0; i--) {
        const available = shells[i] ?? 0;
        const removing = Math.min(available, toRemove);
        shells[i] = available - removing;
        toRemove -= removing;
      }
      // Remove trailing zeroes
      while (shells.length > 0 && shells[shells.length - 1] === 0) {
        shells.pop();
      }
      return shells;
    } else {
      // Anion: add electrons into current or next valence shell
      const shells = [...empiricalNeutralShells];
      let toAdd = diff;
      let shellIdx = shells.length - 1;

      while (toAdd > 0) {
        const n = shellIdx + 1;
        const maxCapacity = 2 * n * n;
        const current = shells[shellIdx] ?? 0;
        const space = maxCapacity - current;

        if (space > 0) {
          const adding = Math.min(space, toAdd);
          shells[shellIdx] = current + adding;
          toAdd -= adding;
        } else {
          shellIdx++;
          if (shells.length <= shellIdx) {
            shells.push(0);
          }
        }
      }
      return shells;
    }
  }

  // Fallback Aufbau subshell filling order
  const shellMap: Record<number, number> = {};
  let remaining = totalElectrons;

  for (const sub of AUFBAU_ORDER) {
    if (remaining <= 0) break;
    const count = Math.min(remaining, sub.capacity);
    shellMap[sub.n] = (shellMap[sub.n] || 0) + count;
    remaining -= count;
  }

  const maxShell = Math.max(...Object.keys(shellMap).map(Number), 1);
  const result: number[] = [];
  for (let n = 1; n <= maxShell; n++) {
    result.push(shellMap[n] || 0);
  }

  // Trim trailing zeroes
  while (result.length > 0 && result[result.length - 1] === 0) {
    result.pop();
  }

  return result;
}

/**
 * Returns the number of valence electrons (outermost shell electrons).
 */
export function getValenceElectrons(shells: number[]): number {
  if (shells.length === 0) return 0;
  return shells[shells.length - 1] ?? 0;
}

/**
 * Converts numbers in orbital notations into superscripts (e.g. 1s2 2s2 2p6 -> 1s² 2s² 2p⁶).
 */
export function formatSuperscriptConfig(config: string): string {
  const superscriptMap: Record<string, string> = {
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
  };

  return config.replace(/([spdf])(\d+)/g, (_match, subshell, exponent) => {
    const supExponent = exponent
      .split('')
      .map((c: string) => superscriptMap[c] || c)
      .join('');
    return `${subshell}${supExponent}`;
  });
}
