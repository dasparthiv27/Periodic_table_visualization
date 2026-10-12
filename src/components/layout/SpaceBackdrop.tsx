import React, { useState } from 'react';
import { useReducedMotionPreference } from '../../hooks/useReducedMotionPreference';
import './SpaceBackdrop.css';

interface SpaceBackdropProps {
  accentColor?: string;
}

/** Ambient CSS-only backdrop; decorative layers never capture input. */
export const SpaceBackdrop: React.FC<SpaceBackdropProps> = ({ accentColor = 'var(--color-cyan)' }) => {
  const [videoUnavailable, setVideoUnavailable] = useState(false);
  const prefersReducedMotion = useReducedMotionPreference();
  const useStaticBackdrop = videoUnavailable || prefersReducedMotion;

  return (
  <div
    className={`space-backdrop${useStaticBackdrop ? ' space-backdrop--static' : ''}`}
    aria-hidden="true"
    style={{ '--space-category-accent': accentColor } as React.CSSProperties}
  >
    {!useStaticBackdrop && (
      <video
        className="space-backdrop__video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        tabIndex={-1}
        onError={() => setVideoUnavailable(true)}
        aria-hidden="true"
      >
        <source src="/videos/atomic_quantum_background_10s.mp4" type="video/mp4" />
      </video>
    )}
    <span className="space-backdrop__nebula space-backdrop__nebula--blue" />
    <span className="space-backdrop__nebula space-backdrop__nebula--violet" />
    <span className="space-backdrop__nebula space-backdrop__nebula--category" />
    <span className="space-backdrop__stars" />
  </div>
  );
};
