# Atomic Explorer

Atomic Explorer is an interactive React application for learning how element identity and simple atom models relate to the periodic table. Users can select elements, edit proton/neutron/electron counts, inspect bundled element data, and compare elements.

## Problem and goals

Atomic structure can be difficult to connect to the periodic table when particle counts, element identity, isotope mass number, charge, and electron-shell diagrams are taught separately. This project puts those ideas in one interface, keeps the key calculations visible, and identifies where its educational models simplify real atomic physics.

## Implemented features

- A searchable, category-filterable periodic table containing 118 bundled element records.
- A temperature control that marks predicted phase state using the dataset's melting and boiling points where both are available.
- Shared proton, neutron, and electron controls with derived element identity, mass number, net charge, and ion status.
- A Bohr-style SVG shell visualization and an interactive, lazy-loaded 3D nucleus view with particle/path controls.
- An element explorer showing dataset properties, neutral electron configuration, shell distribution, and explicit unavailable-value labels.
- A two-element comparison table for available bundled properties.
- A scientific-principles view and reduced-motion-aware animation behavior.

The **Orbitals** visualization tab currently displays an explanatory placeholder; it is not an orbital simulation. The **3D Nucleon Physics** option is also a placeholder. See [known limitations](#scientific-assumptions-and-limitations).

## Screenshots

Screenshots have not been captured or included yet. See the [manual screenshot checklist](docs/SCREENSHOTS.md) for views to capture and instructions for adding genuine images under `docs/screenshots/`. Replace this note with embedded images after capturing them from the running app; do not use mockups as product screenshots.

## Technology

- React 19 and TypeScript
- Vite 6 for development and production builds
- Three.js, React Three Fiber, and Drei for the 3D nucleus view
- CSS design tokens and feature-local styles (no CSS framework)
- Lucide React icons
- Vitest, React Testing Library, and jsdom for automated tests
- ESLint 9 and Prettier

`framer-motion` is listed in `package.json` but is not currently imported by application source. It is not required to run the application.

## Requirements and local development

Install a Node.js version compatible with the Vite 6 toolchain and npm. From the repository root:

```bash
npm ci
npm run dev
```

Open the development URL printed by Vite (the current configuration uses port 3000). The application has no backend or required API credentials. No local machine paths or private configuration are needed.

## Available npm scripts

These commands are defined in `package.json`:

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run typecheck` | Run TypeScript without emitting files. |
| `npm run lint` | Run ESLint across the project. |
| `npm run test` | Run the Vitest suite once. |
| `npm run test:watch` | Run Vitest in watch mode. |
| `npm run build` | Typecheck and create the production bundle in `dist/`. |
| `npm run preview` | Serve the production build locally for inspection. |
| `npm run format` | Format files with Prettier. |

Before a release, run `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build`. `npm run preview` can then serve the generated `dist/` build locally; it is not a production hosting service.

## Project structure

```text
public/                         Static assets copied to the build
src/app/                        Application shell, navigation, shared-state composition
src/components/common/          Panels, icon buttons, and loading state
src/components/layout/          Header, navigation, responsive layout
src/data/                       Element records and category metadata
src/features/atom-builder/      Particle count controls
src/features/atom-visualization/ SVG and lazy Three.js visualizations
src/features/element-details/   Element properties and comparison
src/features/periodic-table/    Search, filters, temperature control, element grid
src/hooks/                      Shared atom state and reduced-motion preference
src/lib/chemistry/              Atomic properties, electron shells, charge helpers
src/styles/                     Global styles, tokens, and responsive styles
src/test/                       Vitest setup
docs/                           Architecture, scientific notes, plan, portfolio, screenshots
```

## Architecture

`App` selects the active top-level view and owns the shared `useAtomState` hook. The hook stores particle counts and visualization mode, then derives display properties through pure chemistry utilities. Particle controls update those counts; element selection updates proton count and resets neutrons/electrons to the selected record's first listed common isotope and a neutral count. The periodic table and atom builder therefore stay synchronized.

`src/data/elements.ts` is the bundled source for the 118 displayed element records. Feature folders own their UI and styles. `AtomScene` renders the SVG view directly and loads the Three.js view on demand. Element comparison has its own two selections and displays dataset values side by side. Tests exercise utilities, data, components, feature workflows, and a main application flow.

See [Architecture](docs/ARCHITECTURE.md) for the component and data flow, and [Scientific model](docs/SCIENTIFIC_MODEL.md) for conventions and caveats.

## Testing and verification

The automated suite uses Vitest with jsdom and React Testing Library. It covers chemistry calculations, element data, shared state, UI components, element exploration/comparison, the periodic table, visualization controls, and a top-level user flow. It does not replace real-browser checks: WebGL behavior, actual responsive rendering, assistive technology behavior, and cross-browser appearance still need manual validation. Use the [screenshot checklist](docs/SCREENSHOTS.md) while reviewing the interface.

## Scientific assumptions and limitations

- Atomic number is proton count. For an isotope, mass number is proton count plus neutron count. A neutral atom has equal proton and electron counts; the displayed ion charge is proton count minus electron count.
- The element's stored atomic mass and the currently selected nuclide's integer mass number are different quantities. Some records store an integer representative mass number where a standard atomic weight is not supplied.
- Element properties come from the bundled dataset. Missing fields are shown as unavailable. The data model has no per-value uncertainty/provenance flag, so the interface cannot reliably label each numeric field as measured versus estimated.
- Neutral electron configuration and shell data are dataset-supplied. Simplified utility calculations are used for certain shell distributions; they do not compute full ion subshell configurations or quantum wavefunctions.
- Isotope stability uses listed common-isotope records and fallback heuristics; it is not a complete nuclide database or a precise stability calculator.
- Bohr shells are an educational diagram, not literal electron trajectories. The 3D view is an interactive illustration of nucleons and shells, not an atomic-scale model or physics simulation. WebGL is needed for the 3D renderer.
- The temperature view uses bundled transition temperatures at 1 atm when available; it does not model pressure effects or phase equilibria.

## Deployment

This is a static Vite application. No deployment configuration or environment variables are currently required. For Vercel, use the Vite preset, build command `npm run build`, and output directory `dist`. For Netlify, use build command `npm run build` and publish directory `dist`; set the base directory to this project if it is in a monorepo. The app has no client-side router, so the current single-entry application does not require an SPA rewrite. Its public asset URLs assume hosting at the domain root. Build and inspect the provider preview before publishing.

## Contributions and license

No contribution policy is defined yet. The project does not currently include a `LICENSE` file. Copyright remains with the owner by default; the owner should choose and add a license before granting others explicit reuse, modification, or redistribution permissions. Do not assume this project is open source until that decision is made.
