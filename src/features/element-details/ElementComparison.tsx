import React, { useState } from 'react';
import { Panel } from '../../components/common/Panel';
import { ELEMENTS, ELEMENTS_MAP } from '../../data/elements';
import { ElementData } from '../../types/element';
import { formatSuperscriptConfig } from '../../lib/chemistry/electron-configuration';
import { formatDensity, formatGroup, formatOxidationStates } from './element-display';
import './ElementComparison.css';

function valueRows(element: ElementData) {
  return [
    ['Atomic number', String(element.atomicNumber)],
    ['Atomic mass', `${element.atomicMass} u`],
    ['Category', element.category.replaceAll('-', ' ')],
    ['Period / group / block', `${element.period} / ${formatGroup(element)} / ${element.block.toUpperCase()}`],
    ['Neutral electron configuration (dataset)', formatSuperscriptConfig(element.electronConfiguration)],
    ['Neutral shell distribution (dataset)', element.electronsPerShell.join(', ')],
    ['Common oxidation states', formatOxidationStates(element)],
    ['Electronegativity', element.electronegativity === null ? 'Not available in dataset' : `${element.electronegativity} (Pauling)`],
    ['Density', formatDensity(element)],
    ['Melting point', element.meltingPoint === null ? 'Not available in dataset' : `${element.meltingPoint} K`],
    ['Boiling point', element.boilingPoint === null ? 'Not available in dataset' : `${element.boilingPoint} K`],
    ['Standard state (at STP)', element.standardState === 'unknown' ? 'Unknown' : element.standardState],
  ];
}

function ElementSelect({ id, label, value, unavailableNumber, onChange }: { id: string; label: string; value: number | ''; unavailableNumber: number | ''; onChange: (value: number | '') => void }) {
  return <label className="comparison-select" htmlFor={id}>{label}<select id={id} value={value} onChange={(event) => onChange(event.target.value ? Number(event.target.value) : '')}>
    <option value="">Choose an element</option>
    {ELEMENTS.map((element) => <option key={element.atomicNumber} value={element.atomicNumber} disabled={unavailableNumber === element.atomicNumber}>{element.name} ({element.symbol})</option>)}
  </select></label>;
}

function ElementComparisonComponent({ selectedAtomicNumber = null }: { selectedAtomicNumber?: number | null }) {
  const [firstNumber, setFirstNumber] = useState<number | ''>(selectedAtomicNumber ?? '');
  const [secondNumber, setSecondNumber] = useState<number | ''>('');
  const first = firstNumber === '' ? undefined : ELEMENTS_MAP.get(firstNumber);
  const second = secondNumber === '' ? undefined : ELEMENTS_MAP.get(secondNumber);
  const firstRows = first ? valueRows(first) : [];
  const secondRows = second ? valueRows(second) : [];
  return <Panel title="Compare elements" subtitle="Compare dataset properties side by side">
    <div className="element-comparison">
      <div className="comparison-selects">
        <ElementSelect id="comparison-element-one" label="First element" value={firstNumber} unavailableNumber={secondNumber} onChange={(value) => { if (value === secondNumber) setSecondNumber(''); setFirstNumber(value); }} />
        <ElementSelect id="comparison-element-two" label="Second element" value={secondNumber} unavailableNumber={firstNumber} onChange={(value) => { if (value === '' || value !== firstNumber) setSecondNumber(value); }} />
      </div>
      {!first || !second ? <p className="comparison-empty" role="status">Choose two elements to compare their available properties.</p> : <div className="comparison-table-wrap" role="region" tabIndex={0} aria-label="Element comparison table; scroll horizontally on narrow screens">
        <table className="comparison-table"><caption>{first.name} and {second.name}: dataset properties</caption>
          <thead><tr><th scope="col">Property</th><th scope="col">{first.name} ({first.symbol})</th><th scope="col">{second.name} ({second.symbol})</th></tr></thead>
          <tbody>{firstRows.map(([label, value], index) => <tr key={label}><th scope="row">{label}</th><td>{value}</td><td>{secondRows[index]?.[1]}</td></tr>)}</tbody>
        </table>
        <p className="comparison-note">Neutral electron configurations and shell distributions are dataset values. For some elements without a standard atomic weight, the stored integer atomic mass is a representative mass number. Missing properties are identified explicitly; the dataset supplies no per-value estimate or uncertainty flags, so displayed values retain its precision.</p>
      </div>}
    </div>
  </Panel>;
}

export const ElementComparison = React.memo(ElementComparisonComponent);
