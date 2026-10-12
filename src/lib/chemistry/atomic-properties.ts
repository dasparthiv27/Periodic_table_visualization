import { AtomCounts, AtomDerivedProperties } from '../../types/atom';
import { ElementData, Isotope } from '../../types/element';
import { SAMPLE_ELEMENTS_MAP } from '../../data/elements';
import { calculateNetCharge, formatCharge, getIonType } from './ion-charge';
import { distributeElectronsToShells, getValenceElectrons } from './electron-configuration';

/**
 * Calculates mass number (A = Z + N).
 */
export function calculateMassNumber(protons: number, neutrons: number): number {
  if (protons < 0 || neutrons < 0) {
    throw new Error('Protons and neutrons cannot be negative.');
  }
  return protons + neutrons;
}

export interface IsotopeAssessment {
  isStable: boolean | null;
  description: string;
  matchedIsotope?: Isotope;
}

/**
 * Evaluates isotope stability based on experimental isotope tables
 * and established nuclear physics heuristics (band of stability).
 */
export function determineIsotopeStability(
  protons: number,
  neutrons: number,
  element?: ElementData | null
): IsotopeAssessment {
  if (protons === 0) {
    if (neutrons === 1) {
      return {
        isStable: false,
        description: 'Free neutron (unbound; decays via beta decay with half-life ~14.7 minutes)',
      };
    }
    return {
      isStable: false,
      description: 'Neutron cluster (unbound / hypothetical)',
    };
  }

  const massNumber = calculateMassNumber(protons, neutrons);

  // If we have an element with verified isotope data
  if (element && element.commonIsotopes.length > 0) {
    const matched = element.commonIsotopes.find((iso) => iso.massNumber === massNumber);
    if (matched) {
      if (matched.isStable) {
        const abundanceStr = matched.abundance !== undefined ? ` (~${matched.abundance}% natural abundance)` : '';
        return {
          isStable: true,
          description: `Stable isotope ${element.symbol}-${massNumber}${abundanceStr}`,
          matchedIsotope: matched,
        };
      } else {
        const halfLifeStr = matched.halfLife ? ` (t½ = ${matched.halfLife})` : '';
        return {
          isStable: false,
          description: `Radioactive isotope ${element.symbol}-${massNumber}${halfLifeStr}`,
          matchedIsotope: matched,
        };
      }
    }
  }

  // Elements beyond Lead/Bismuth (Z > 82) have no stable isotopes in nature
  if (protons > 82) {
    return {
      isStable: false,
      description: `Radioactive: Elements with Z > 82 possess no stable isotopes`,
    };
  }

  // Pure hydrogen special case (¹H and ²H are stable, ³H is radioactive, no neutrons = stable for H)
  if (protons === 1 && neutrons === 0) {
    return {
      isStable: true,
      description: 'Protium (¹H): Stable (99.9885% natural abundance)',
    };
  }

  // General nuclear stability heuristic (approximate band of stability)
  const ratio = neutrons / protons;
  if (protons <= 20) {
    // For light elements, N/Z is close to 1.0 (0.8 - 1.25)
    if (ratio >= 0.8 && ratio <= 1.35) {
      return {
        isStable: null,
        description: `Uncommon isotope (${protons + neutrons}): Outside standard common tables, likely unstable`,
      };
    }
  }

  return {
    isStable: false,
    description: `Highly unstable / synthetic nuclide (${massNumber}) outside nuclear stability valley`,
  };
}

/**
 * Derives all chemical and physical properties from the current atom counts.
 */
export function deriveAtomProperties(
  counts: AtomCounts,
  customElement?: ElementData | null
): AtomDerivedProperties {
  const { protons, neutrons, electrons } = counts;
  const massNumber = calculateMassNumber(protons, neutrons);
  const netCharge = calculateNetCharge(protons, electrons);
  const chargeFormatted = formatCharge(netCharge);
  const ionType = getIonType(netCharge);

  // Lookup element by proton count if not provided
  const element =
    customElement !== undefined
      ? customElement
      : (SAMPLE_ELEMENTS_MAP.get(protons) ?? null);

  const electronShells = distributeElectronsToShells(
    electrons,
    element?.electronsPerShell
  );

  const valenceElectrons = getValenceElectrons(electronShells);
  const isotopeInfo = determineIsotopeStability(protons, neutrons, element);

  return {
    massNumber,
    netCharge,
    chargeFormatted,
    ionType,
    element,
    electronShells,
    valenceElectrons,
    isStableIsotope: isotopeInfo.isStable,
    stabilityDescription: isotopeInfo.description,
  };
}
