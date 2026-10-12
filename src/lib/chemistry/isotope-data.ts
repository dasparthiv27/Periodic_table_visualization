import { ElementData, Isotope } from '../../types/element';

/** Return only a matching isotope record that exists in the bundled element data. */
export function findListedIsotope(element: ElementData, massNumber: number): Isotope | undefined {
  return element.commonIsotopes.find((isotope) => isotope.massNumber === massNumber);
}
