import React from 'react';
import { FileText, ShieldAlert, CheckCircle2, Sparkles } from 'lucide-react';
import { Panel } from '../../components/common/Panel';
import { AtomDerivedProperties } from '../../types/atom';
import { ELEMENT_CATEGORIES } from '../../data/element-categories';
import { ElementProperties } from './ElementProperties';
import { formatIonSymbol } from '../../lib/chemistry/ion-charge';
import { findListedIsotope } from '../../lib/chemistry/isotope-data';
import './ElementDetails.css';

export interface ElementDetailsProps {
  derived: AtomDerivedProperties;
}

const ElementDetailsComponent: React.FC<ElementDetailsProps> = ({ derived }) => {
  const { element, massNumber, netCharge, ionType } = derived;

  if (!element) {
    return (
      <Panel
        title="Unknown Nuclide"
        subtitle="Custom Subatomic Assembly"
        icon={<FileText size={18} />}
      >
        <div className="unknown-nuclide-card">
          <p>
            Current proton count does not correspond to an element in the bundled dataset.
          </p>
          <div className="nuclide-stats">
            <span>Mass Number (A): {massNumber}</span>
            <span>Net Charge: {netCharge}</span>
            <span>Ion State: {ionType}</span>
          </div>
        </div>
      </Panel>
    );
  }

  const categoryMeta = ELEMENT_CATEGORIES[element.category];
  const ionFormattedSymbol = formatIonSymbol(element.symbol, netCharge);
  const listedIsotope = findListedIsotope(element, massNumber);

  return (
    <Panel
      title={`${element.name} (${element.symbol})`}
      subtitle={`Atomic number ${element.atomicNumber} · Dataset atomic mass ${element.atomicMass} u`}
      icon={<FileText size={18} />}
    >
      <div className="element-details-body">
        {/* Hero element card header */}
        <div className="element-hero-strip">
          <div
            className="hero-symbol-box"
            style={{
              borderColor: categoryMeta?.badgeColor || 'var(--color-cyan)',
              boxShadow: `0 0 15px ${categoryMeta?.badgeColor || 'var(--color-cyan)'}30`,
            }}
          >
            <span className="hero-z">{element.atomicNumber}</span>
            <span className="hero-sym">{ionFormattedSymbol}</span>
            <span className="hero-a" aria-label={`Mass number ${massNumber}`}>A {massNumber}</span>
          </div>

          <div className="hero-meta-group">
            <span
              className="element-category-badge"
              style={{
                backgroundColor: `${categoryMeta?.badgeColor || '#38bdf8'}20`,
                borderColor: `${categoryMeta?.badgeColor || '#38bdf8'}50`,
                color: categoryMeta?.badgeColor || '#38bdf8',
              }}
            >
              {categoryMeta?.name || element.category}
            </span>

            <div className="status-badges-row">
              {/* Isotope Stability Status */}
              <div
                className={`status-pill ${
                  listedIsotope?.isStable === true
                    ? 'status-pill--stable'
                    : listedIsotope?.isStable === false
                    ? 'status-pill--unstable'
                    : 'status-pill--unknown'
                }`}
                title={listedIsotope ? `Status from bundled isotope data${listedIsotope.halfLife ? `; half-life: ${listedIsotope.halfLife}` : ''}` : 'No matching isotope record in the bundled common-isotope data'}
              >
                  {listedIsotope?.isStable === true ? (
                  <CheckCircle2 size={13} />
                ) : (
                  <ShieldAlert size={13} />
                )}
                <span>
                  {listedIsotope?.isStable === true
                    ? 'Stable Isotope'
                    : listedIsotope?.isStable === false
                    ? 'Radioactive'
                    : 'Not in isotope data'}
                </span>
              </div>

              {/* Ion State Status */}
              <div
                className={`status-pill ${
                  ionType === 'neutral'
                    ? 'status-pill--neutral'
                    : 'status-pill--ionized'
                }`}
              >
                <Sparkles size={13} />
                <span>
                  {ionType === 'neutral'
                    ? 'Neutral Atom'
                    : `${ionType.toUpperCase()} (${derived.chargeFormatted})`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Short summary narrative */}
        <p className="element-summary-text">{element.summary}</p>

        {/* Full properties table */}
        <ElementProperties element={element} derived={derived} />
      </div>
    </Panel>
  );
};

export const ElementDetails = React.memo(ElementDetailsComponent);
