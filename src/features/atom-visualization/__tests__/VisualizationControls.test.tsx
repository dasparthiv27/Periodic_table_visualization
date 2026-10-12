import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { VisualizationControls } from '../VisualizationControls';

describe('visualization controls', () => {
  it('keeps orbital mode selectable without showing an unrelated animation control', () => {
    const onModeChange = vi.fn();
    render(<VisualizationControls mode="orbital" onModeChange={onModeChange} isPlaying={false} onTogglePlay={vi.fn()} showShellLabels onToggleShellLabels={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Orbitals' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Play atom animation' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Bohr Shells' }));
    expect(onModeChange).toHaveBeenCalledWith('bohr');
  });

  it('keeps playback visible and groups secondary 3D settings accessibly', () => {
    const onTogglePlay = vi.fn();
    const onTogglePaths = vi.fn();
    const onToggleParticles = vi.fn();
    const onResetView = vi.fn();
    render(<VisualizationControls mode="nucleus-3d" onModeChange={vi.fn()} isPlaying onTogglePlay={onTogglePlay} showShellLabels onToggleShellLabels={vi.fn()} showPaths onTogglePaths={onTogglePaths} showParticles onToggleParticles={onToggleParticles} onResetView={onResetView} />);
    fireEvent.click(screen.getByRole('button', { name: 'Pause atom animation' }));
    const settings = screen.getByText('Settings').closest('details');
    expect(settings).not.toHaveAttribute('open');
    fireEvent.click(screen.getByText('Settings'));
    expect(settings).toHaveAttribute('open');
    fireEvent.click(screen.getByRole('button', { name: 'Hide electron shell paths' }));
    fireEvent.click(screen.getByRole('button', { name: 'Hide particles' }));
    fireEvent.click(screen.getByRole('button', { name: 'Reset 3D view' }));
    expect(onTogglePlay).toHaveBeenCalledOnce();
    expect(onTogglePaths).toHaveBeenCalledOnce();
    expect(onToggleParticles).toHaveBeenCalledOnce();
    expect(onResetView).toHaveBeenCalledOnce();
  });
});
