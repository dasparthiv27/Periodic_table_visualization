import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { deriveAtomProperties } from '../../../lib/chemistry/atomic-properties';
import { findListedIsotope } from '../../../lib/chemistry/isotope-data';
import { ELEMENTS_MAP } from '../../../data/elements';
import { AtomBuilder } from '../AtomBuilder';
import { ParticleControl } from '../ParticleControl';

describe('isotope and ion lab', () => {
  it('shows isotope status and abundance only for a matching bundled record', () => {
    const carbon = ELEMENTS_MAP.get(6)!;
    expect(findListedIsotope(carbon, 12)).toMatchObject({ massNumber: 12, isStable: true });
    expect(findListedIsotope(carbon, 15)).toBeUndefined();

    const counts = { protons: 6, neutrons: 9, electrons: 7 };
    render(<AtomBuilder counts={counts} derived={deriveAtomProperties(counts)} onProtonsChange={vi.fn()} onNeutronsChange={vi.fn()} onElectronsChange={vi.fn()} onResetToNeutral={vi.fn()} />);
    expect(screen.getByText(/Carbon \(C\), Z = 6/)).toBeInTheDocument();
    expect(screen.getByText(/No matching record.*stability and abundance unavailable/)).toBeInTheDocument();
    expect(screen.getByText('Mass number (A):').parentElement).toHaveTextContent('15');
    expect(screen.getByText('Net Charge:').parentElement).toHaveTextContent('1−');

    const knownCounts = { protons: 6, neutrons: 6, electrons: 6 };
    const { unmount } = render(<AtomBuilder counts={knownCounts} derived={deriveAtomProperties(knownCounts)} onProtonsChange={vi.fn()} onNeutronsChange={vi.fn()} onElectronsChange={vi.fn()} onResetToNeutral={vi.fn()} />);
    expect(screen.getByText(/C-12; listed as stable; listed abundance/)).toBeInTheDocument();
    unmount();
  });

  it('restores the most abundant stable isotope neutron count', () => {
    const onNeutronsChange = vi.fn();
    const counts = { protons: 6, neutrons: 9, electrons: 6 };
    render(<AtomBuilder counts={counts} derived={deriveAtomProperties(counts)} onProtonsChange={vi.fn()} onNeutronsChange={onNeutronsChange} onElectronsChange={vi.fn()} onResetToNeutral={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Reset neutrons to most abundant stable isotope C-12' }));

    expect(onNeutronsChange).toHaveBeenCalledWith(6);
  });

  it('rejects out-of-range particle input accessibly and keeps the last valid value', () => {
    const onChange = vi.fn();
    render(<ParticleControl name="Neutrons" count={6} min={0} max={180} chargeBadge="0 e" accentColor="gray" glowColor="transparent" description="Sets isotope neutron count." onChange={onChange} />);
    const input = screen.getByRole('spinbutton', { name: 'Neutrons' });
    fireEvent.change(input, { target: { value: '181' } });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a whole number from 0 to 180');
    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue(181);

    fireEvent.change(input, { target: { value: '8' } });
    expect(onChange).toHaveBeenCalledWith(8);
    fireEvent.click(screen.getByRole('button', { name: 'Increase Neutrons count' }));
    expect(onChange).toHaveBeenLastCalledWith(7);
  });
});
