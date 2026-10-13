import React from 'react';
import './Nucleus.css';

export interface NucleusProps {
  protons: number;
  neutrons: number;
  symbol: string;
  radius?: number;
}

export const Nucleus: React.FC<NucleusProps> = ({
  protons,
  neutrons,
  symbol,
  radius = 28,
}) => {
  const nucleonCount = protons + neutrons;
  const particleRadius = Math.max(1.25, Math.min(5.2, 21 / Math.sqrt(Math.max(nucleonCount, 1))));
  const nucleons = Array.from({ length: nucleonCount }, (_, index) => {
    const angle = index * Math.PI * (3 - Math.sqrt(5));
    const distance = radius * 0.78 * Math.sqrt((index + 0.5) / Math.max(nucleonCount, 1));
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, isProton: index < protons };
  });

  return (
    <g className="nucleus-group" transform="translate(0, 0)">
      {/* Outer ambient nuclear glow */}
      <circle
        r={radius * 1.5}
        fill="url(#nucleusAmbientGlow)"
        opacity="0.6"
        className="nucleus-glow-pulse"
      />

      <circle r={radius} fill="url(#nucleusCoreGrad)" opacity="0.38" />

      {nucleons.map((nucleon, index) => (
        <g key={`${nucleon.isProton ? 'p' : 'n'}-${index}`}>
          <circle
            cx={nucleon.x}
            cy={nucleon.y}
            r={particleRadius}
            fill={nucleon.isProton ? 'url(#protonSphereGrad)' : 'url(#neutronSphereGrad)'}
            className="nucleon-sphere"
          />
          <circle cx={nucleon.x - particleRadius * 0.28} cy={nucleon.y - particleRadius * 0.3} r={particleRadius * 0.22} fill="rgba(255,255,255,0.72)" className="nucleon-specular" />
        </g>
      ))}

      {/* Symbol in center */}
      <text
        y={-2}
        textAnchor="middle"
        dominantBaseline="middle"
        className="nucleus-symbol"
        fill="#ffffff"
      >
        {symbol}
      </text>

      {/* Nucleon sub-count indicator */}
      <text
        y={radius * 0.55}
        textAnchor="middle"
        dominantBaseline="middle"
        className="nucleus-counts"
        fill="#94a3b8"
      >
        {protons}p · {neutrons}n
      </text>
    </g>
  );
};
