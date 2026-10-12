import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ELEMENTS_MAP } from '../../../data/elements';
import { OrbitalExplorer } from '../OrbitalExplorer';

vi.mock('../OrbitalCloud', () => ({
  OrbitalCloud: ({ orbital }: { orbital: string }) => <div data-testid="orbital-cloud-model">{orbital}</div>,
}));

describe('OrbitalExplorer', () => {
  it('offers occupied dataset orbitals and updates the selected 2p shape', async () => {
    const carbon = ELEMENTS_MAP.get(6)!;
    render(<OrbitalExplorer element={carbon} netCharge={0} />);

    expect(screen.getByRole('combobox', { name: 'Orbital shape' })).toHaveValue('1s');
    expect(screen.getByText(/1s has 2 electrons/i)).toBeInTheDocument();
    fireEvent.change(screen.getByRole('combobox', { name: 'Orbital shape' }), { target: { value: '2py' } });

    expect(screen.getByText('2pᵧ (two lobes along y) · sampled probability density')).toBeInTheDocument();
    expect(screen.getByText(/nodal plane/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId('orbital-cloud-model')).toHaveTextContent('2py'));
  });

  it('does not offer 2p for hydrogen when the neutral dataset configuration has only 1s', () => {
    render(<OrbitalExplorer element={ELEMENTS_MAP.get(1)!} netCharge={0} />);
    const select = screen.getByRole('combobox', { name: 'Orbital shape' });
    expect(select.querySelectorAll('option')).toHaveLength(1);
    expect(select).toHaveValue('1s');
  });

  it('does not imply a neutral orbital configuration for an ion', () => {
    render(<OrbitalExplorer element={ELEMENTS_MAP.get(6)!} netCharge={1} />);
    expect(screen.getByRole('status')).toHaveTextContent(/Ionic orbital occupancy is not inferred/);
    expect(screen.queryByRole('combobox', { name: 'Orbital shape' })).not.toBeInTheDocument();
  });
});
