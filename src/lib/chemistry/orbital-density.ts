export type OrbitalSelection = '1s' | '2px' | '2py' | '2pz';

export interface OrbitalOption {
  id: OrbitalSelection;
  label: string;
  subshell: '1s' | '2p';
  electronsInSubshell: number;
}

const CORE_CONFIGURATIONS: Record<string, string> = {
  He: '1s2',
  Ne: '1s2 2s2 2p6',
  Ar: '1s2 2s2 2p6 3s2 3p6',
  Kr: '1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6',
  Xe: '1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6 5s2 4d10 5p6',
  Rn: '1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6 5s2 4d10 5p6 6s2 4f14 5d10 6p6',
};

const SUPERSCRIPTS: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
};

/** Parses the bundled neutral-atom notation, expanding supported noble-gas cores. */
export function parseSubshellOccupancies(configuration: string): Map<string, number> {
  const expanded = configuration.replace(/\[([A-Z][a-z]?)\]/g, (token, symbol: string) => CORE_CONFIGURATIONS[symbol] ?? token);
  const occupancies = new Map<string, number>();
  const tokenPattern = /(\d+)([spdf])([0-9⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(expanded)) !== null) {
    const exponent = (match[3] ?? '').split('').map((digit) => SUPERSCRIPTS[digit] ?? digit).join('');
    occupancies.set(`${match[1]}${match[2]}`, Number(exponent));
  }

  return occupancies;
}

/** Only offers shapes grounded in occupied subshells present in the element dataset. */
export function getSupportedOrbitalOptions(configuration: string): OrbitalOption[] {
  const occupancy = parseSubshellOccupancies(configuration);
  const options: OrbitalOption[] = [];
  const oneS = occupancy.get('1s') ?? 0;
  const twoP = occupancy.get('2p') ?? 0;

  if (oneS > 0) options.push({ id: '1s', label: '1s (spherical)', subshell: '1s', electronsInSubshell: oneS });
  if (twoP > 0) {
    options.push(
      { id: '2px', label: '2pₓ (two lobes along x)', subshell: '2p', electronsInSubshell: twoP },
      { id: '2py', label: '2pᵧ (two lobes along y)', subshell: '2p', electronsInSubshell: twoP },
      { id: '2pz', label: '2p_z (two lobes along z)', subshell: '2p', electronsInSubshell: twoP },
    );
  }

  return options;
}

const BOHR_RADIUS = 1; // Atomic units: distances are expressed in a₀.

/** Normalized hydrogenic probability density |ψ|² in atomic units (a₀ = 1). */
export function hydrogenicOrbitalDensity(orbital: OrbitalSelection, x: number, y: number, z: number): number {
  const r = Math.hypot(x, y, z);
  if (orbital === '1s') return Math.exp((-2 * r) / BOHR_RADIUS) / (Math.PI * BOHR_RADIUS ** 3);

  const coordinate = orbital === '2px' ? x : orbital === '2py' ? y : z;
  return (coordinate ** 2 * Math.exp(-r / BOHR_RADIUS)) / (32 * Math.PI * BOHR_RADIUS ** 5);
}

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Draws deterministic samples from the normalized hydrogenic density.
 * The 2p radial CDF is sampled as Gamma(k=5, θ=1); its angular density is
 * sampled by rejection against the squared selected-axis direction cosine.
 */
export function sampleHydrogenicOrbital(orbital: OrbitalSelection, pointCount = 9000): Float32Array {
  const random = seededRandom(orbital.split('').reduce((seed, character) => seed + character.charCodeAt(0), 0x51a7));
  const positions = new Float32Array(pointCount * 3);
  const displayScale = 0.55; // Uniform view scale; relative 1s/2p radial sizes are preserved.
  const axis = orbital === '2px' ? 0 : orbital === '2py' ? 1 : 2;

  for (let point = 0; point < pointCount; point += 1) {
    let directionX = 0;
    let directionY = 0;
    let directionZ = 0;
    let radius: number;

    if (orbital === '1s') {
      const zDirection = 2 * random() - 1;
      const azimuth = 2 * Math.PI * random();
      const planar = Math.sqrt(1 - zDirection ** 2);
      directionX = planar * Math.cos(azimuth);
      directionY = planar * Math.sin(azimuth);
      directionZ = zDirection;
      radius = -0.5 * Math.log(random() * random() * random());
    } else {
      let accepted = false;
      while (!accepted) {
        directionX = 2 * random() - 1;
        directionY = 2 * random() - 1;
        directionZ = 2 * random() - 1;
        const lengthSquared = directionX ** 2 + directionY ** 2 + directionZ ** 2;
        if (lengthSquared === 0 || lengthSquared > 1) continue;
        const inverseLength = 1 / Math.sqrt(lengthSquared);
        directionX *= inverseLength;
        directionY *= inverseLength;
        directionZ *= inverseLength;
        const axisCoordinate = axis === 0 ? directionX : axis === 1 ? directionY : directionZ;
        accepted = random() <= axisCoordinate ** 2;
      }

      radius = -Math.log(random() * random() * random() * random() * random());
    }

    const offset = point * 3;
    positions[offset] = directionX * radius * displayScale;
    positions[offset + 1] = directionY * radius * displayScale;
    positions[offset + 2] = directionZ * radius * displayScale;
  }

  return positions;
}
