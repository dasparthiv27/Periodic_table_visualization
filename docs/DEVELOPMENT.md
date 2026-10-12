# Atomic Explorer — Development Guide

This document describes the prerequisites, setup procedures, and development workflows for the **Atomic Explorer** web application.

---

## 1. Prerequisites

- **Node.js**: `v20.0.0` or later (tested on Node.js `v24.14.0`)
- **npm**: `v10.0.0` or later (tested on npm `11.9.0`)
- Modern web browser with WebGL 2.0 support (Chrome, Edge, Firefox, Safari)

---

## 2. Quick Start

Clone or open the repository folder, then execute:

```bash
# 1. Install dependencies
npm install

# 2. Run test suite to verify foundation
npm run test

# 3. Start local Vite development server
npm run dev
```

The application will be running locally at `http://localhost:3000`.

---

## 3. Available NPM Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `vite` | Starts local development server on port 3000 with HMR |
| `npm run build` | `tsc --noEmit && vite build` | Typechecks and produces production bundle in `dist/` |
| `npm run preview` | `vite preview` | Serves the production build locally for verification |
| `npm run typecheck` | `tsc --noEmit` | Runs TypeScript compiler checks under strict mode |
| `npm run lint` | `eslint .` | Runs ESLint 9 against TypeScript and JSX files |
| `npm run test` | `vitest run` | Executes all Vitest test suites once in jsdom environment |
| `npm run test:watch` | `vitest` | Runs tests in interactive watch mode during development |
| `npm run format` | `prettier --write .` | Formats all source files with Prettier |

---

## 4. Coding Standards

### TypeScript
- All code must satisfy strict TypeScript (`"strict": true`, `"noUncheckedIndexedAccess": true`).
- No implicit or explicit `any` types where specific domain models exist.
- Use explicit interfaces in `src/types/` for all scientific entities.

### CSS & Styling
- Avoid TailwindCSS unless explicitly instructed; write vanilla CSS utilizing CSS variables defined in `src/styles/variables.css`.
- Support responsive viewport breakpoints: 640px (tablet portrait), 1024px (tablet landscape / laptop), 1280px+ (desktop).
- Always include `:focus-visible` states and test against `prefers-reduced-motion`.

### Chemistry Calculations
- Keep scientific physics and chemistry logic inside pure, testable functions in `src/lib/chemistry/`.
- UI components must not implement raw chemistry rules; they consume derived properties from hooks and pure helpers.

---

## 5. Verification Checklist

Before pushing changes or advancing to the next phase, run the 4-step verification sequence:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```
All four commands must exit with code 0.
