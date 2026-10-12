import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SpaceBackdrop } from '../SpaceBackdrop';

describe('SpaceBackdrop', () => {
  afterEach(() => vi.restoreAllMocks());

  it('uses the public MP4 path and switches to a static scene after a media error', () => {
    const { container } = render(<SpaceBackdrop />);
    const video = container.querySelector('video') as HTMLVideoElement;

    expect(video.querySelector('source')).toHaveAttribute('src', '/videos/atomic_quantum_background_10s.mp4');
    expect(video).toHaveProperty('muted', true);
    expect(video).toHaveProperty('loop', true);
    expect(video).toHaveAttribute('playsinline');

    fireEvent.error(video);

    expect(container.querySelector('video')).not.toBeInTheDocument();
    expect(container.querySelector('.space-backdrop')).toHaveClass('space-backdrop--static');
  });

  it('uses the static fallback when reduced motion is preferred', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList);

    const { container } = render(<SpaceBackdrop />);

    expect(container.querySelector('video')).not.toBeInTheDocument();
    expect(container.querySelector('.space-backdrop')).toHaveClass('space-backdrop--static');
  });
});
