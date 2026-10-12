# Atomic Explorer — Scientific Model & Physical Principles

This document formalizes the physical models, scientific conventions, and pedagogical simplifications implemented across **Atomic Explorer**.

---

## 1. Subatomic Physics Principles

### 1.1 Atomic Number ($Z$) and Elemental Identity
- The **proton count ($Z$)** exclusively defines the chemical element.
- Chemical elements exist in the range $1 \le Z \le 118$ (Hydrogen to Oganesson).
- A system with $Z = 0$ is not a chemical element (e.g., free neutrons $^1_0\text{n}$ or hypothetical tetraneutrons).

### 1.2 Mass Number ($A$) and Nuclear Isotopes
- The **mass number ($A$)** is the sum of protons and neutrons:
  $$A = Z + N$$
- Isotopes are nuclides with identical atomic number $Z$ but differing neutron number $N$.
- Standard atomic weight represents the weighted abundance of terrestrial stable isotopes, whereas nuclide mass number is strictly an integer count of nucleons.

### 1.3 Net Electric Charge and Ionization State
- The net charge ($q$) of an atom or monatomic ion is:
  $$q = Z - N_e$$
  where $Z$ is the proton count and $N_e$ is the electron count.
- **Classification**:
  - $q = 0$: **Neutral atom** ($Z = N_e$)
  - $q > 0$: **Cation** ($Z > N_e$; electrons lost)
  - $q < 0$: **Anion** ($Z < N_e$; electrons gained)
- In standard chemical typography, magnitude precedes sign (e.g., $\text{Fe}^{3+}$, $\text{O}^{2-}$), with single charges omitted (e.g., $\text{Na}^+$, $\text{Cl}^-$).

---

## 2. Nuclear Stability & The "Valley of Stability"

1. **Light Nuclei ($Z \le 20$)**:
   - Optimal stability occurs when $N \approx Z$ ($N/Z \approx 1.0$).
   - Deviation from this ratio produces radioactive $\beta^-$ (neutron-rich) or $\beta^+/\text{EC}$ (proton-rich) decay.
2. **Heavy Nuclei ($20 < Z \le 82$)**:
   - Due to repulsive electrostatic Coulomb forces among protons, stable nuclei require an increasing excess of neutrons, reaching $N/Z \approx 1.5$ near Lead ($^{208}_{\phantom{0}82}\text{Pb}$).
3. **Superheavy Nuclei ($Z > 82$)**:
   - Bismuth ($Z=83$) and all heavier elements have no stable isotopes in nature; all are radioactive.
4. **No Fabrication of Unknown Data**:
   - When a user inputs an exotic nuclide outside verified experimental tables, Atomic Explorer reports it as *unverified/unstable nuclide outside standard experimental tables* rather than inventing half-lives or decay branches.

---

## 3. Electron Configuration & Shell Distribution

### 3.0 Data provenance and limits
- Neutral electron-configuration strings and neutral electrons-per-shell arrays are supplied by `src/data/elements.ts`; the explorer labels them as dataset values.
- For charged atoms, shell totals are derived with the existing `distributeElectronsToShells` utility. This shell adjustment does not produce a charged-ion subshell configuration.
- The data model has no per-value confidence, estimate, or citation field. Numeric values are presented as stored dataset values, without claiming precision beyond the stored digits. A `null` field is unavailable, not zero.
- Atomic mass is shown in unified atomic mass units (`u`) as provided by the dataset. The selected nuclide's mass number is shown separately as the integer `protons + neutrons`.
- Density uses `g/L at STP` for records whose listed standard state is gas and `g/cm³` for other records, following the density unit convention documented by `ElementData`.

### 3.1 Principal Energy Shells (Bohr Model)
- Shell capacity follows the classical Rydberg formula:
  $$\text{Capacity}(n) = 2n^2$$
  - $n=1$ ($K$ shell): 2 electrons
  - $n=2$ ($L$ shell): 8 electrons
  - $n=3$ ($M$ shell): 18 electrons
  - $n=4$ ($N$ shell): 32 electrons
  - $n=5$ ($O$ shell): 50 electrons

### 3.2 Ground State Aufbau Principle (Madelung Rule)
- Neutral atoms fill subshells in order of increasing $n + \ell$:
  $$1s < 2s < 2p < 3s < 3p < 4s < 3d < 4p < 5s < 4d < 5p < 6s < 4f < 5d < 6p < 7s < 5f < 6d < 7p$$
- **Transition Metal Ionization Rule**:
  - When transition metals form cations, electrons are removed from the outermost $s$ subshell *before* the inner $(n-1)d$ subshell (e.g., $\text{Fe}: [\text{Ar}] 3d^6 4s^2 \to \text{Fe}^{2+}: [\text{Ar}] 3d^6$).

### 3.3 Reading the notation in Element Explorer
- In a term such as `2p⁴`, `2` is the principal shell, `p` is the subshell label, and the superscript is the number of electrons represented there.
- The explorer displays the neutral configuration supplied in the element dataset and the shell distribution separately. It does not claim to calculate every configuration from the Aufbau rule; known exceptions remain as recorded in the dataset.
- Shell distributions for custom electron counts and ions are simplified results from the existing shell utility, not full quantum-mechanical states.

---

## 4. Educational Model vs. Quantum Reality

> [!IMPORTANT]
> **Pedagogical Simplification Disclosure:**
> Atomic Explorer prominently notes the difference between educational diagrams and quantum reality:
> 1. **Bohr Orbits**: Concentric circular orbits are used as an educational visual metaphor for discrete energy levels ($n$). In physical reality, electrons do not follow planar circular orbits.
> 2. **Quantum Wavefunctions**: In modern quantum mechanics, electron states are described by probability distributions, not fixed planetary paths. Atomic Explorer's configuration notation and Bohr-style shell view are educational summaries, not quantum simulations.
