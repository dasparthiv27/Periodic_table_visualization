import React, { Suspense, lazy, useMemo, useState } from 'react';
import { getSupportedOrbitalOptions, type OrbitalSelection } from '../../lib/chemistry/orbital-density';
import type { ElementData } from '../../types/element';

const OrbitalCloud = lazy(() => import('./OrbitalCloud').then((module) => ({ default: module.OrbitalCloud })));

interface OrbitalExplorerProps {
  element: ElementData | null;
  netCharge: number;
}

function OrbitalUnavailable({ children }: { children: React.ReactNode }) {
  return <div className="orbital-unavailable" role="status">{children}</div>;
}

export const OrbitalExplorer: React.FC<OrbitalExplorerProps> = ({ element, netCharge }) => {
  const [requestedOrbital, setRequestedOrbital] = useState<OrbitalSelection>('1s');
  const options = useMemo(
    () => element ? getSupportedOrbitalOptions(element.electronConfiguration) : [],
    [element],
  );
  const selectedOption = options.find((option) => option.id === requestedOrbital) ?? options[0];

  if (!element) {
    return <OrbitalUnavailable>Select a listed element to view orbitals present in its dataset configuration.</OrbitalUnavailable>;
  }

  if (netCharge !== 0) {
    return <OrbitalUnavailable>This hydrogenic shape view uses the element dataset&apos;s neutral configuration. Ionic orbital occupancy is not inferred, so return the atom to neutral to explore this model.</OrbitalUnavailable>;
  }

  if (!selectedOption) {
    return <OrbitalUnavailable>No supported 1s or 2p subshell is listed for this element configuration.</OrbitalUnavailable>;
  }

  const isOneS = selectedOption.subshell === '1s';
  const explanation = isOneS
    ? 'The 1s model is spherical, with probability density highest at the nucleus and decreasing smoothly with radius.'
    : `${selectedOption.label} has two lobes separated by a nodal plane; the chosen axis sets that illustrative orientation.`;
  const densityFormula = isOneS
    ? 'ρ₁s(r) = e^(−2r/a₀) / (πa₀³)'
    : 'ρ₂p(r, axis) = axis² · e^(−r/a₀) / (32πa₀⁵)';

  return (
    <section className="orbital-explorer" aria-label="Hydrogenic orbital probability-density explorer">
      <div className="orbital-hud">
        <label htmlFor="orbital-select">Orbital shape</label>
        <select
          id="orbital-select"
          value={selectedOption.id}
          onChange={(event) => setRequestedOrbital(event.target.value as OrbitalSelection)}
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>{option.label}</option>
          ))}
        </select>
        <span className="orbital-occupancy">
          Dataset neutral configuration: {selectedOption.subshell} has {selectedOption.electronsInSubshell} electron{selectedOption.electronsInSubshell === 1 ? '' : 's'}.
        </span>
      </div>

      <Suspense fallback={<div className="viz-webgl-fallback" role="status">Preparing the probability-density points…</div>}>
        <OrbitalCloud orbital={selectedOption.id} />
      </Suspense>

      <div className="orbital-explanation" aria-live="polite">
        <strong>{selectedOption.label} · sampled probability density</strong>
        <span>{explanation}</span>
        <span>Drag to rotate the view; scroll or pinch to zoom.</span>
        <code>{densityFormula}</code>
        <small>Hydrogenic, one-electron model in atomic units (a₀ = 1). The point cloud is sampled from |ψ|² and uniformly scaled to fit the view. For this selected element it illustrates one subshell shape only; it does not solve shielding, electron interactions, or the full multi-electron atom. p-orbital orientations are basis choices, not assignments of particular electrons.</small>
      </div>
    </section>
  );
};
