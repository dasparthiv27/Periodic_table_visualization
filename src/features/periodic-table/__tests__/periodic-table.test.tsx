import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PeriodicTable } from '../PeriodicTable';
import { TableFilters } from '../TableFilters';
import { TemperatureSlider } from '../TemperatureSlider';

describe('PeriodicTable Component Integration', () => {
  it('renders periodic table containing element tiles and group headers', () => {
    const handleSelect = vi.fn();
    render(
      <PeriodicTable
        selectedAtomicNumber={6}
        onSelectElement={handleSelect}
      />
    );

    // Check title and group headers
    expect(screen.getByText('Periodic Table of the Elements')).toBeInTheDocument();
    expect(screen.getAllByText('18').length).toBeGreaterThanOrEqual(1); // Group 18 & Argon Z=18

    // Check key elements across periods
    expect(screen.getByText('H')).toBeInTheDocument();
    expect(screen.getByText('Fe')).toBeInTheDocument();
    expect(screen.getByText('Au')).toBeInTheDocument();
    expect(screen.getByText('Og')).toBeInTheDocument();
  });

  it('highlights the selected element', () => {
    const handleSelect = vi.fn();
    render(
      <PeriodicTable
        selectedAtomicNumber={26} // Iron
        onSelectElement={handleSelect}
      />
    );

    const ironTile = screen.getByRole('button', { name: /Iron/i });
    expect(ironTile).toHaveClass('element-tile--selected');
  });

  it('triggers onSelectElement when an element tile is clicked', () => {
    const handleSelect = vi.fn();
    render(
      <PeriodicTable
        selectedAtomicNumber={1}
        onSelectElement={handleSelect}
      />
    );

    const goldTile = screen.getByRole('button', { name: /Gold/i });
    fireEvent.click(goldTile);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ atomicNumber: 79, symbol: 'Au', name: 'Gold' })
    );
  });

  it('collapses and reopens the table without losing the selected element', () => {
    render(<PeriodicTable selectedAtomicNumber={26} onSelectElement={vi.fn()} />);
    const toggle = screen.getByRole('button', { name: 'Hide table' });
    const content = document.getElementById('periodic-table-content');
    expect(content).not.toHaveAttribute('hidden');
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Show table' })).toHaveAttribute('aria-expanded', 'false');
    expect(content).toHaveAttribute('hidden');
    expect(content?.querySelector('.element-tile--selected')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Show table' }));
    expect(screen.getByRole('button', { name: 'Hide table' })).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('TableFilters Component', () => {
  it('handles search input by name, symbol, or number', () => {
    const handleSearchChange = vi.fn();
    render(
      <TableFilters
        searchQuery=""
        onSearchChange={handleSearchChange}
        selectedCategory={null}
        onSelectCategory={vi.fn()}
        selectedPeriod={null}
        onSelectPeriod={vi.fn()}
        selectedGroup={null}
        onSelectGroup={vi.fn()}
        selectedBlock={null}
        onSelectBlock={vi.fn()}
        onResetFilters={vi.fn()}
        matchCount={118}
        totalCount={118}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search by name/i);
    fireEvent.change(searchInput, { target: { value: 'iron' } });

    expect(handleSearchChange).toHaveBeenCalledWith('iron');
  });

  it('triggers category selection when a category pill is clicked', () => {
    const handleCategorySelect = vi.fn();
    render(
      <TableFilters
        searchQuery=""
        onSearchChange={vi.fn()}
        selectedCategory={null}
        onSelectCategory={handleCategorySelect}
        selectedPeriod={null}
        onSelectPeriod={vi.fn()}
        selectedGroup={null}
        onSelectGroup={vi.fn()}
        selectedBlock={null}
        onSelectBlock={vi.fn()}
        onResetFilters={vi.fn()}
        matchCount={118}
        totalCount={118}
      />
    );

    const nobleGasPill = screen.getByRole('button', { name: /Noble Gas/i });
    fireEvent.click(nobleGasPill);

    expect(handleCategorySelect).toHaveBeenCalledWith('noble-gas');
  });

  it('triggers reset filters when reset button is clicked', () => {
    const handleReset = vi.fn();
    render(
      <TableFilters
        searchQuery="uranium"
        onSearchChange={vi.fn()}
        selectedCategory="actinide"
        onSelectCategory={vi.fn()}
        selectedPeriod={null}
        onSelectPeriod={vi.fn()}
        selectedGroup={null}
        onSelectGroup={vi.fn()}
        selectedBlock={null}
        onSelectBlock={vi.fn()}
        onResetFilters={handleReset}
        matchCount={1}
        totalCount={118}
      />
    );

    const resetBtn = screen.getByRole('button', { name: /Reset all element discovery/i });
    fireEvent.click(resetBtn);

    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});

describe('TemperatureSlider Component', () => {
  it('toggles temperature simulation view', () => {
    const handleToggle = vi.fn();
    render(
      <TemperatureSlider
        temperatureK={293}
        onTemperatureChange={vi.fn()}
        isEnabled={false}
        onToggleEnabled={handleToggle}
      />
    );

    const toggleBtn = screen.getByRole('button', { name: /Enable Phase View/i });
    fireEvent.click(toggleBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('displays Kelvin and Celsius values and handles temperature slider change', () => {
    const handleChange = vi.fn();
    render(
      <TemperatureSlider
        temperatureK={373} // 99.85 °C
        onTemperatureChange={handleChange}
        isEnabled={true}
        onToggleEnabled={vi.fn()}
      />
    );

    expect(screen.getByText('373 K')).toBeInTheDocument();
    expect(screen.getByText('(99.9 °C)')).toBeInTheDocument();

    const slider = screen.getByLabelText(/Temperature slider in Kelvin/i);
    fireEvent.change(slider, { target: { value: '1811' } });

    expect(handleChange).toHaveBeenCalledWith(1811);
  });

  it('supports temperature preset clicks', () => {
    const handleChange = vi.fn();
    render(
      <TemperatureSlider
        temperatureK={293}
        onTemperatureChange={handleChange}
        isEnabled={true}
        onToggleEnabled={vi.fn()}
      />
    );

    const absZeroBtn = screen.getByRole('button', { name: /0 K \(Abs\. Zero\)/i });
    fireEvent.click(absZeroBtn);

    expect(handleChange).toHaveBeenCalledWith(0);
  });
});
