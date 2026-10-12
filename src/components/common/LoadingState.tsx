import React from 'react';
import './LoadingState.css';

export interface LoadingStateProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'Loading atomic simulation...',
  size = 'md',
}) => {
  const pixelSize = size === 'sm' ? 24 : size === 'lg' ? 48 : 36;

  return (
    <div role="status" aria-live="polite" className="loading-state">
      <div className={`loading-indicator loading-indicator--${size}`} aria-hidden="true" style={{ '--indicator-size': `${pixelSize}px` } as React.CSSProperties} />
      <span className="loading-label">{label}</span>
    </div>
  );
};
