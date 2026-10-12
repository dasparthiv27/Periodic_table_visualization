import React from 'react';
import { Sliders, Zap } from 'lucide-react';
import { Panel } from '../../components/common/Panel';
import { ParticleControl } from './ParticleControl';
import { AtomCounts, AtomDerivedProperties } from '../../types/atom';
import { findListedIsotope } from '../../lib/chemistry/isotope-data';
import './AtomBuilder.css';

export interface AtomBuilderProps {
  counts: AtomCounts;
  derived: AtomDerivedProperties;
  onProtonsChange: (val: number) => void;
  onNeutronsChange: (val: number) => void;
  onElectronsChange: (val: number) => void;
  onResetToNeutral: () => void;
}

const AtomBuilderComponent: React.FC<AtomBuilderProps> = ({
  counts,
  derived,
  onProtonsChange,
  onNeutronsChange,
  onElectronsChange,
  onResetToNeutral,
}) => {
  const listedIsotope = derived.element
    ? findListedIsotope(derived.element, derived.massNumber)
    : undefined;
  return (
    <Panel
      title="Particle Controls"
      subtitle="Set counts to explore element, isotope, and ion state"
      icon={<Sliders size={18} />}
      actions={
        <button
          type="button"
          onClick={onResetToNeutral}
          className="neutralize-btn"
          title="Match electron count to protons (net charge 0)"
        >
          <Zap size={13} />
          <span>Make Neutral</span>
        </button>
      }
    >
      <div className="atom-builder-controls">
        {/* Protons Control */}
        <ParticleControl
          name="Protons"
          count={counts.protons}
          min={1}
          max={118}
          chargeBadge="+1 e"
          accentColor="var(--color-proton)"
          glowColor="var(--color-proton-glow)"
          description="Choose the number of protons in the nucleus. This sets the element's atomic number."
          onChange={onProtonsChange}
        />

        {/* Neutrons Control */}
        <ParticleControl
          name="Neutrons"
          count={counts.neutrons}
          min={0}
          max={180}
          chargeBadge="0 e"
          accentColor="var(--color-neutron)"
          glowColor="var(--color-neutron-glow)"
          description="Choose the number of neutrons in the nucleus. This changes isotope and mass number (A = Z + N); stability is shown only for listed isotopes."
          onChange={onNeutronsChange}
        />

        {/* Electrons Control */}
        <ParticleControl
          name="Electrons"
          count={counts.electrons}
          min={0}
          max={118}
          chargeBadge="-1 e"
          accentColor="var(--color-electron)"
          glowColor="var(--color-electron-glow)"
          description="Choose the number of electrons around the nucleus. This changes ion charge (protons - electrons)."
          onChange={onElectronsChange}
        />

        {/* Quick summary strip */}
        <div className="particle-summary-strip">
          <div className="summary-item">
            <span className="summary-label">Mass number (A):</span>
            <span className="summary-val">{derived.massNumber}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Net Charge:</span>
            <span
              className={`summary-val ${
                derived.netCharge > 0
                  ? 'val--cation'
                  : derived.netCharge < 0
                  ? 'val--anion'
                  : 'val--neutral'
              }`}
            >
              {derived.chargeFormatted}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Ion state:</span>
            <span className="summary-val capitalize">{derived.ionType}</span>
          </div>
        </div>
        <div className="atom-identity-strip" aria-live="polite">
          <span><strong>Element identity:</strong> {derived.element ? `${derived.element.name} (${derived.element.symbol}), Z = ${derived.element.atomicNumber}` : `No element record for Z = ${counts.protons}`}</span>
          <span><strong>Isotope data:</strong> {listedIsotope
            ? `${derived.element?.symbol}-${listedIsotope.massNumber}; ${listedIsotope.isStable ? 'listed as stable' : 'listed as radioactive'}${listedIsotope.abundance === undefined ? '' : `; listed abundance ${listedIsotope.abundance}%`}${listedIsotope.halfLife ? `; half-life ${listedIsotope.halfLife}` : ''}`
            : 'No matching record in the bundled common-isotope data; stability and abundance unavailable.'}</span>
        </div>
      </div>
    </Panel>
  );
};

export const AtomBuilder = React.memo(AtomBuilderComponent);
