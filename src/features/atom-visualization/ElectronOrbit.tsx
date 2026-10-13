import React from 'react';
import './ElectronOrbit.css';

export interface ElectronOrbitProps {
  shellIndex: number; // 0-based: 0 -> n=1 (K), 1 -> n=2 (L)
  radius: number;
  electronCount: number;
  isPlaying: boolean;
  showLabel: boolean;
}

const SHELL_LETTERS = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

export const ElectronOrbit: React.FC<ElectronOrbitProps> = ({
  shellIndex,
  radius,
  electronCount,
  isPlaying,
  showLabel,
}) => {
  const n = shellIndex + 1;
  const shellLetter = SHELL_LETTERS[shellIndex] || `n=${n}`;
  // Vary orbit speed: inner shells orbit faster (Keplerian-like educational effect)
  const durationSeconds = 8 + shellIndex * 4;
  const direction = shellIndex % 2 === 0 ? 'normal' : 'reverse';

  // Compute angles for each electron
  const electrons = Array.from({ length: electronCount }, (_, idx) => {
    const angleRad = (idx / electronCount) * 2 * Math.PI;
    const x = Math.cos(angleRad) * radius;
    const y = Math.sin(angleRad) * radius;
    return { id: idx, x, y };
  });

  return (
    <g className="electron-orbit-group">
      {/* Orbital track ring */}
      <circle
        r={radius}
        fill="none"
        stroke="rgba(50, 147, 255, 0.12)"
        strokeWidth="7"
        className="orbit-path orbit-path--glow"
      />
      <circle
        r={radius}
        fill="none"
        stroke={shellIndex % 3 === 1 ? 'rgba(181, 143, 255, 0.62)' : 'rgba(92, 211, 255, 0.72)'}
        strokeWidth="1"
        className="orbit-path"
      />
      <circle
        r={radius}
        fill="none"
        stroke="rgba(224, 247, 255, 0.38)"
        strokeWidth="0.45"
        strokeDasharray="1 9"
        className="orbit-path orbit-path--detail"
      />

      {/* Shell label */}
      {showLabel && (
        <text
          x={radius + 4}
          y={-3}
          fill="rgba(161, 215, 241, 0.8)"
          className="orbit-shell-label"
        >
          {shellLetter} ({electronCount})
        </text>
      )}

      {/* Rotating electron cluster */}
      <g
        className={`orbit-rotator ${isPlaying ? 'orbit-rotator--animated' : ''}`}
        style={{
          animationDuration: `${durationSeconds}s`,
          animationDirection: direction,
        }}
      >
        {electrons.map((el) => (
          <g key={el.id} transform={`translate(${el.x}, ${el.y})`}>
            <circle r={8} fill="rgba(26, 131, 255, 0.22)" filter="url(#electronGlow)" />
            <circle r={5} fill="rgba(61, 201, 255, 0.62)" filter="url(#electronGlow)" />
            <circle r={2.6} fill="#d9fcff" stroke="#ffffff" strokeWidth="0.8" />
          </g>
        ))}
      </g>
    </g>
  );
};
