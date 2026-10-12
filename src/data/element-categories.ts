import { ElementCategory } from '../types/element';

export interface CategoryMetadata {
  id: ElementCategory;
  name: string;
  description: string;
  colorVar: string;
  badgeColor: string;
}

export const ELEMENT_CATEGORIES: Record<ElementCategory, CategoryMetadata> = {
  'diatomic-nonmetal': {
    id: 'diatomic-nonmetal',
    name: 'Diatomic Nonmetal',
    description: 'Non-metallic elements that naturally form diatomic molecules (e.g., H₂, N₂, O₂, halogens).',
    colorVar: 'var(--cat-diatomic-nonmetal)',
    badgeColor: '#376f8c',
  },
  'polyatomic-nonmetal': {
    id: 'polyatomic-nonmetal',
    name: 'Polyatomic Nonmetal',
    description: 'Non-metallic elements that naturally form structures of multiple bonded atoms (e.g., C, P₄, S₈).',
    colorVar: 'var(--cat-polyatomic-nonmetal)',
    badgeColor: '#397780',
  },
  'noble-gas': {
    id: 'noble-gas',
    name: 'Noble Gas',
    description: 'Group 18 elements with full valence electron shells, exhibiting very low chemical reactivity.',
    colorVar: 'var(--cat-noble-gas)',
    badgeColor: '#73528f',
  },
  'alkali-metal': {
    id: 'alkali-metal',
    name: 'Alkali Metal',
    description: 'Highly reactive Group 1 metals with one valence electron that readily form +1 cations.',
    colorVar: 'var(--cat-alkali-metal)',
    badgeColor: '#ad3f32',
  },
  'alkaline-earth': {
    id: 'alkaline-earth',
    name: 'Alkaline Earth Metal',
    description: 'Reactive Group 2 metals with two valence electrons, forming basic (alkaline) oxides.',
    colorVar: 'var(--cat-alkaline-earth)',
    badgeColor: '#b65b35',
  },
  'metalloid': {
    id: 'metalloid',
    name: 'Metalloid',
    description: 'Elements with intermediate properties between typical metals and nonmetals; often semiconductors.',
    colorVar: 'var(--cat-metalloid)',
    badgeColor: '#47765a',
  },
  'post-transition-metal': {
    id: 'post-transition-metal',
    name: 'Post-Transition Metal',
    description: 'Metals located between transition metals and metalloids, with relatively lower melting points.',
    colorVar: 'var(--cat-post-transition)',
    badgeColor: '#36796f',
  },
  'transition-metal': {
    id: 'transition-metal',
    name: 'Transition Metal',
    description: 'd-block elements with partially filled d subshells, exhibiting multiple oxidation states and catalytic properties.',
    colorVar: 'var(--cat-transition-metal)',
    badgeColor: '#92701f',
  },
  'lanthanide': {
    id: 'lanthanide',
    name: 'Lanthanide',
    description: 'Series of 15 f-block metallic elements from Lanthanum to Lutetium, often termed rare earth elements.',
    colorVar: 'var(--cat-lanthanide)',
    badgeColor: '#a13e68',
  },
  'actinide': {
    id: 'actinide',
    name: 'Actinide',
    description: 'Series of 15 f-block elements from Actinium to Lawrencium, all of which are radioactive.',
    colorVar: 'var(--cat-actinide)',
    badgeColor: '#765295',
  },
  'unknown': {
    id: 'unknown',
    name: 'Unknown / Superheavy',
    description: 'Synthetic elements whose chemical properties have not yet been conclusively verified.',
    colorVar: 'var(--cat-unknown)',
    badgeColor: '#73766f',
  },
};
