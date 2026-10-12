import React from 'react';
import { ElementData } from '../../types/element';
import { AtomDerivedProperties } from '../../types/atom';
import { formatSuperscriptConfig } from '../../lib/chemistry/electron-configuration';
import { formatNumber } from '../../lib/utils';
import { formatDensity, formatDiscovery, formatGroup, formatOxidationStates } from './element-display';
import './ElementProperties.css';

export interface ElementPropertiesProps {
  element: ElementData;
  derived?: AtomDerivedProperties;
}

const PropertyRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="prop-row"><dt className="prop-name">{label}</dt><dd className="prop-val">{value}</dd></div>
);

export const ElementProperties: React.FC<ElementPropertiesProps> = ({ element, derived }) => {
  const isNeutral = !derived || derived.netCharge === 0;
  const shells = isNeutral || !derived ? element.electronsPerShell : derived.electronShells;
  const shellTotal = shells.reduce((sum, count) => sum + count, 0);
  return (
    <div className="element-information">
      <section className="element-info-section" aria-labelledby="element-identity-heading">
        <h3 id="element-identity-heading">Identity & classification</h3>
        <dl className="element-props-grid">
          <PropertyRow label="Atomic number (protons)" value={element.atomicNumber} />
          <PropertyRow label="Atomic mass (dataset)" value={`${element.atomicMass} u`} />
          <PropertyRow label="Category" value={element.category.replaceAll('-', ' ')} />
          <PropertyRow label="Period / group / block" value={`${element.period} / ${formatGroup(element)} / ${element.block.toUpperCase()}`} />
        </dl>
        <p className="property-note">Atomic mass is the dataset value; for some elements without a standard atomic weight, the stored integer is a representative mass number. The isotope mass number shown above is the integer proton-plus-neutron count for the current nuclide.</p>
      </section>

      <details className="element-info-disclosure">
        <summary><span>Electron Configuration</span><span className="disclosure-hint">Subshells and shell distribution</span></summary>
        <section className="element-info-section" aria-labelledby="electron-configuration-heading">
        <h3 id="electron-configuration-heading">Electron configuration</h3>
        <dl className="element-props-grid">
          <PropertyRow label="Subshell configuration" value={<span className="mono">{formatSuperscriptConfig(element.electronConfiguration)}</span>} />
          <PropertyRow label="Shell distribution (n = 1 onward)" value={<span className="mono">{shells.join(', ') || 'No electrons'}</span>} />
          <PropertyRow label="Shell count check" value={`${shellTotal} ${shellTotal === 1 ? 'electron' : 'electrons'}${isNeutral ? ' (dataset value)' : ' (calculated for current particle count)'}`} />
        </dl>
        <p className="property-note">The neutral subshell configuration and neutral shell distribution come from the element dataset. For an ion, the displayed shell distribution is calculated by the existing shell utility; an ion subshell configuration is not inferred here.</p>
        <p className="configuration-help"><strong>How to read it:</strong> The leading number is the principal shell (n); s, p, d, and f name subshell types; the superscript gives the electron count in that subshell. Shell totals group electrons by the leading number, so they are a separate view of the same neutral electron population.</p>
        </section>
      </details>

      <details className="element-info-disclosure">
        <summary><span>Physical Properties</span><span className="disclosure-hint">State, density, and reactivity data</span></summary>
        <section className="element-info-section" aria-labelledby="physical-properties-heading">
        <h3 id="physical-properties-heading">Physical properties</h3>
        <dl className="element-props-grid">
          <PropertyRow label="Standard state (at STP)" value={element.standardState === 'unknown' ? 'Unknown' : element.standardState} />
          <PropertyRow label="Electronegativity" value={element.electronegativity === null ? 'Not available in dataset' : `${element.electronegativity} (Pauling)`} />
          <PropertyRow label="Density" value={formatDensity(element)} />
          <PropertyRow label="Melting point" value={element.meltingPoint === null ? 'Not available in dataset' : `${formatNumber(element.meltingPoint)} K`} />
          <PropertyRow label="Boiling point" value={element.boilingPoint === null ? 'Not available in dataset' : `${formatNumber(element.boilingPoint)} K`} />
          <PropertyRow label="Common oxidation states" value={formatOxidationStates(element)} />
        </dl>
        <p className="property-note">Density uses g/L at STP for elements whose listed standard state is gas and g/cm³ otherwise. The dataset has no per-value estimate or uncertainty flags; numeric values retain the dataset's precision. Null values are unavailable, never zero.</p>
        </section>
        <section className="element-info-section" aria-labelledby="discovery-heading">
        <h3 id="discovery-heading">Discovery</h3>
        <dl className="element-props-grid"><PropertyRow label="Discoverer / year" value={formatDiscovery(element)} /></dl>
        </section>
      </details>
    </div>
  );
};
