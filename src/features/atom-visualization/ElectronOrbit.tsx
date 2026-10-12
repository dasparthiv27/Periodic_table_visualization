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
        stroke="rgba(209, 198, 176, 0.34)"
        strokeWidth="1.2"
        strokeDasharray="3 3"
        className="orbit-path"
      />

      {/* Shell label */}
      {showLabel && (
        <text
          x={radius + 4}
          y={-3}
          fill="rgba(237, 231, 220, 0.72)"
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
            {/* Glow blur behind electron */}
            <circle r={5} fill="rgba(103, 171, 195, 0.44)" filter="url(#electronGlow)" />
            {/* Core electron dot */}
            <circle
              r={3}
              fill="#69a9c2"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
          </g>
        ))}
      </g>
    </g>
  );
};
