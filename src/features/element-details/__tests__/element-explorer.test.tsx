import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ELEMENTS_MAP } from '../../../data/elements';
import { deriveAtomProperties } from '../../../lib/chemistry/atomic-properties';
import { ElementDetails } from '../ElementDetails';
import { ElementProperties } from '../ElementProperties';
import { ElementComparison } from '../ElementComparison';

describe('element details and configuration explorer', () => {
  it('renders element identity, isotope mass number, category, and dataset properties', () => {
    const derived = deriveAtomProperties({ protons: 6, neutrons: 6, electrons: 6 });
    render(<ElementDetails derived={derived} />);
    expect(screen.getByText('Carbon (C)')).toBeInTheDocument();
    expect(screen.getByText('A 12')).toBeInTheDocument();
    expect(screen.getByText('12.011 u')).toBeInTheDocument();
    expect(screen.getByText('polyatomic nonmetal')).toBeInTheDocument();
    expect(screen.getByText('Nonmetallic tetravalent cornerstone of organic chemistry, existing as diamond, graphite, and fullerenes.')).toBeInTheDocument();
  });

  it('keeps identity visible and progressively discloses secondary property groups', () => {
    render(<ElementDetails derived={deriveAtomProperties({ protons: 6, neutrons: 6, electrons: 6 })} />);
    expect(screen.getByText('Carbon (C)')).toBeInTheDocument();
    const configuration = screen.getByText('Electron Configuration').closest('details');
    expect(configuration).not.toHaveAttribute('open');
    fireEvent.click(screen.getByText('Electron Configuration'));
    expect(configuration).toHaveAttribute('open');
    expect(screen.getByText('Subshell configuration')).toBeInTheDocument();
  });

  it('labels unavailable properties instead of rendering zero or a fabricated value', () => {
    const derived = deriveAtomProperties({ protons: 100, neutrons: 157, electrons: 100 });
    render(<ElementDetails derived={derived} />);
    expect(screen.getAllByText('Not available in dataset').length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByText('0 K')).not.toBeInTheDocument();
  });

  it('does not present a stability heuristic as listed isotope data', () => {
    const derived = deriveAtomProperties({ protons: 6, neutrons: 9, electrons: 6 });
    render(<ElementDetails derived={derived} />);
    expect(screen.getByText('Not in isotope data')).toBeInTheDocument();
    expect(screen.queryByText('Radioactive')).not.toBeInTheDocument();
  });

  it('shows supplied configurations and shell data for representative elements', () => {
    const examples = [
      [1, '1s¹', '1'],
      [6, '[He] 2s² 2p²', '2, 4'],
      [11, '[Ne] 3s¹', '2, 8, 1'],
      [26, '[Ar] 3d⁶ 4s²', '2, 8, 14, 2'],
      [58, '[Xe] 4f¹ 5d¹ 6s²', '2, 8, 18, 19, 9, 2'],
    ] as const;
    for (const [number, configuration, distribution] of examples) {
      const element = ELEMENTS_MAP.get(number)!;
      const { unmount } = render(<ElementProperties element={element} />);
      expect(screen.getByText(configuration)).toBeInTheDocument();
      expect(screen.getAllByText(distribution).length).toBeGreaterThan(0);
      unmount();
    }
  });
});

describe('element comparison', () => {
  it('explains the empty state before two elements are selected', () => {
    render(<ElementComparison selectedAtomicNumber={6} />);
    expect(screen.getByRole('status')).toHaveTextContent('Choose two elements');
  });

  it('compares two elements and their available properties accessibly', () => {
    render(<ElementComparison />);
    fireEvent.change(screen.getByLabelText('First element'), { target: { value: '6' } });
    expect(within(screen.getByLabelText('Second element')).getByRole('option', { name: 'Carbon (C)' })).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Second element'), { target: { value: '26' } });
    const table = screen.getByRole('table', { name: 'Carbon and Iron: dataset properties' });
    expect(within(table).getByText('Atomic number')).toBeInTheDocument();
    expect(within(table).getByText('55.845 u')).toBeInTheDocument();
    expect(within(table).getByText('[Ar] 3d⁶ 4s²')).toBeInTheDocument();
  });
});
