import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('main application flows', () => {
  it('navigates, filters, selects an element, updates ion charge, compares elements, and opens science', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Periodic Table' }));
    fireEvent.click(within(screen.getByRole('group', { name: 'Chemical categories' })).getByRole('button', { name: 'Noble Gas' }));
    expect(screen.getByRole('button', { name: /Argon, atomic number 18/i })).not.toHaveClass('element-tile--dimmed');
    expect(screen.getByRole('button', { name: /Iron, atomic number 26/i })).toHaveClass('element-tile--dimmed');
    fireEvent.change(screen.getByRole('textbox', { name: 'Search chemical elements' }), { target: { value: 'iron' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reset all element discovery filters' }));
    expect(screen.getByText('118 / 118 Elements')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox', { name: 'Filter by period' }), { target: { value: '4' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter by group' }), { target: { value: '8' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter by block' }), { target: { value: 'd' } });
    expect(screen.getByRole('button', { name: /Iron, atomic number 26/i })).not.toHaveClass('element-tile--dimmed');
    expect(screen.getByRole('button', { name: /Cobalt, atomic number 27/i })).toHaveClass('element-tile--dimmed');
    fireEvent.click(screen.getByRole('button', { name: 'Reset all element discovery filters' }));
    expect(screen.getByText('118 / 118 Elements')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('textbox', { name: 'Search chemical elements' }), { target: { value: 'Iron' } });
    fireEvent.click(screen.getByRole('button', { name: /Iron, atomic number 26/i }));
    expect(document.querySelector('.specimen-name')).toHaveTextContent(/Fe.*Iron/);
    expect(screen.getByRole('heading', { name: 'Iron (Fe)' })).toBeInTheDocument();
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Electrons' }), { target: { value: '24' } });
    expect(screen.getByText('CATION (2+)')).toBeInTheDocument();
    expect(screen.getByText('Mass number (A):').parentElement).toHaveTextContent('54');

    fireEvent.change(screen.getByLabelText('First element'), { target: { value: '6' } });
    fireEvent.change(screen.getByLabelText('Second element'), { target: { value: '11' } });
    expect(screen.getByRole('table', { name: 'Carbon and Sodium: dataset properties' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Scientific Principles' }));
    expect(screen.getByRole('heading', { name: 'Scientific Architecture & Modeling Rules' })).toBeInTheDocument();

    const infoButton = screen.getByRole('button', { name: 'Scientific Model & Architectural Information' });
    infoButton.focus();
    fireEvent.click(infoButton);
    expect(screen.getByRole('dialog', { name: 'About Atomic Explorer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(infoButton).toHaveFocus();
  });

  it('opens the optional chemistry quiz as its own navigation view', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Chemistry Quiz' }));
    expect(await screen.findByRole('heading', { name: 'Chemistry quiz' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Start quiz' })).toBeInTheDocument();
  });
});
