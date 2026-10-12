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
  return (
    <g className="nucleus-group" transform="translate(0, 0)">
      {/* Outer ambient nuclear glow */}
      <circle
        r={radius * 1.5}
        fill="url(#nucleusAmbientGlow)"
        opacity="0.6"
        className="nucleus-glow-pulse"
      />

      {/* Main core circle */}
      <circle
        r={radius}
        fill="url(#nucleusCoreGrad)"
        stroke="rgba(244, 63, 94, 0.4)"
        strokeWidth="1.5"
      />

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
