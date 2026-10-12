import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Panel } from '../common/Panel';
import { IconButton } from '../common/IconButton';
import { LoadingState } from '../common/LoadingState';

describe('UI Foundation Components', () => {
  it('renders Panel with title, subtitle and children', () => {
    render(
      <Panel title="Nuclear Reactor" subtitle="Core metrics">
        <p>Active core content</p>
      </Panel>
    );

    expect(screen.getByText('Nuclear Reactor')).toBeInTheDocument();
    expect(screen.getByText('Core metrics')).toBeInTheDocument();
    expect(screen.getByText('Active core content')).toBeInTheDocument();
  });

  it('renders IconButton with accessible label and handles clicks', () => {
    const handleClick = vi.fn();
    render(
      <IconButton
        aria-label="Increase count"
        onClick={handleClick}
      >
        <span>+</span>
      </IconButton>
    );

    const btn = screen.getByRole('button', { name: 'Increase count' });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables IconButton when disabled prop is provided', () => {
    render(
      <IconButton
        aria-label="Disabled action"
        disabled
      >
        <span>-</span>
      </IconButton>
    );

    const btn = screen.getByRole('button', { name: 'Disabled action' });
    expect(btn).toBeDisabled();
  });

  it('renders LoadingState with proper role status', () => {
    render(<LoadingState label="Synthesizing atoms..." />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Synthesizing atoms...')).toBeInTheDocument();
  });
});
