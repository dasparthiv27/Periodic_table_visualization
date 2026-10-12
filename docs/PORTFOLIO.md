# Atomic Explorer — Portfolio Summary

## Summary

Atomic Explorer is a React and TypeScript learning interface for connecting periodic-table identity to proton, neutron, and electron counts. It combines element lookup, simple atom visualizations, scientific property panels, and a side-by-side element comparison in one browser application.

## Problem addressed

Learners often encounter atomic number, isotope mass number, ion charge, electron shells, and element properties as separate concepts. This application places those concepts together and makes the count relationships interactive, while labeling the limits of its simplified models.

## Implemented features

- Searchable and category-filterable periodic table populated by the bundled 118-element dataset.
- Particle controls with derived element identity, mass number, charge, and ion classification.
- SVG Bohr-shell view and interactive 3D nucleus illustration.
- Element properties and neutral electron configuration, with shell distribution presented separately.
- Two-element comparison using available bundled properties.
- Temperature-based phase-state display when transition data is present.
- Scientific-principles content, semantic controls, keyboard focus treatment, and reduced-motion handling.

The Orbitals and 3D Nucleon Physics choices currently show explanatory placeholders. They are not completed visualization modes.

## Engineering decisions visible in the implementation

- **One shared atom-state hook:** the periodic-table selection and particle controls both update the same proton/neutron/electron state. Element identity follows proton count, which avoids a second independently mutable selected-element value.
- **Feature-local boundaries:** builder, visualization, table, and element-detail code each have dedicated folders and styles, while common controls and panels are shared.
- **Pure calculation modules:** charge, mass number, shell distribution, and derived properties are outside React components and have direct unit tests.
- **Dataset values remain separate from derived values:** neutral configuration and element properties are read from bundled records; count-derived values are calculated and the UI indicates this distinction where shown.
- **The 3D scene is lazy-loaded:** `AtomScene` dynamically imports the Three.js module, and the renderer includes a visible fallback for WebGL/rendering failure.
- **The periodic table preserves its 18-column layout:** narrow viewports use horizontal scrolling rather than compressing the element tiles to unreadable sizes.

## Implementation challenges addressed in the code

These are observations about the current design, not claims about a particular development history:

- **Keeping selection synchronized:** the hook derives selected element number from proton count and centralizes updates used by table and builder interactions.
- **Separating isotope mass from element mass:** the explorer labels dataset atomic mass separately from the custom atom's integer proton-plus-neutron mass number.
- **Showing incomplete science data honestly:** null fields display as unavailable; the dataset currently has no field-level uncertainty metadata.
- **Making the large periodic-table geometry fit narrow screens:** the 18-column grid is kept in a scroll container, and responsive page layout stacks feature panels.
- **Supporting systems without WebGL:** the 3D view has a fallback message and the Bohr SVG remains a separate selectable view.

## Technologies and roles

| Technology | Role |
| --- | --- |
| React 19 | Component UI and application composition |
| TypeScript | Application, data, and component types |
| Vite 6 | Development server and production bundler |
| Three.js / React Three Fiber / Drei | Interactive 3D nucleus illustration and camera controls |
| CSS | Theme tokens, responsive layout, controls, and visualization styling |
| Lucide React | Interface icons |
| Vitest / Testing Library / jsdom | Utility, component, and app-flow automated tests |
| ESLint / Prettier | Linting and formatting scripts |

`framer-motion` appears in the dependency manifest but is not imported by current application source.

## Limitations and possible next work

- Orbital probability-cloud rendering and 3D nucleon physics are placeholders.
- Ion shell adjustment is a simplified educational calculation; the app does not compute ion subshell configurations or quantum wavefunctions.
- Isotope status uses common records and heuristics rather than a complete evaluated nuclide database.
- The bundled property model lacks per-value citations and uncertainty/estimate flags.
- Browser-level responsive, WebGL, keyboard-only, assistive-technology, and cross-browser checks are not automated and remain manual work.
- The 3D JavaScript chunk is comparatively large in the production build, despite being lazy-loaded.

Potential next work, after deciding data sources and scientific scope, includes browser automation, stronger per-property provenance, and separately scoped orbital-learning content. These are future improvements, not current features.

## Demonstration script

1. Open **Atom Builder & Simulator** and point out the default carbon selection, particle controls, mass number, charge, and ion status.
2. Change the neutron count and explain that the isotope's mass number changes while proton count continues to determine the element.
3. Change the electron count and show the resulting ion charge. Use **Make Neutral** to restore equal proton and electron counts.
4. Search or filter the periodic table, select another element, and show that the builder and element details update together.
5. In **Bohr Shells**, show the shell distribution and its educational-model caveat. Then switch to **3D Nucleus** and rotate the illustration if WebGL is available.
6. Open **Compare elements**, choose two elements, and point out available values and explicit missing-data labels.
7. Open **Scientific Principles** to explain atomic number, mass number, charge, shells, and configuration notation.
8. If mentioning **Orbitals** or **3D Nucleon Physics**, identify each as a placeholder and do not present it as a working simulation.

For images to accompany this summary, follow [the manual screenshot checklist](SCREENSHOTS.md). No screenshots are included yet.
