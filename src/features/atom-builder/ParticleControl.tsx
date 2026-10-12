import React, { useEffect, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { IconButton } from '../../components/common/IconButton';
import './ParticleControl.css';

export interface ParticleControlProps {
  name: string;
  count: number;
  min?: number;
  max?: number;
  chargeBadge: string;
  accentColor: string;
  glowColor: string;
  description: string;
  onChange: (val: number) => void;
}

const ParticleControlComponent: React.FC<ParticleControlProps> = ({
  name,
  count,
  min = 0,
  max = 118,
  chargeBadge,
  accentColor,
  description,
  onChange,
}) => {
  const inputId = `particle-${name.toLowerCase()}-input`;
  const sliderId = `particle-${name.toLowerCase()}-slider`;
  const labelId = `particle-${name.toLowerCase()}-label`;
  const descriptionId = `particle-${name.toLowerCase()}-description`;
  const errorId = `${inputId}-error`;
  const [draft, setDraft] = useState(String(count));
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    setDraft(String(count));
  }, [count]);

  const updateDraft = (value: string) => {
    setDraft(value);
    const parsed = Number(value);
    if (/^\d+$/.test(value) && Number.isSafeInteger(parsed) && parsed >= min && parsed <= max) {
      setValidationMessage('');
      onChange(parsed);
    } else {
      setValidationMessage(`Enter a whole number from ${min} to ${max}. The last valid count remains in use.`);
    }
  };

  return (
    <div className="particle-control">
      <div className="particle-control-top">
        <div className="particle-label-group">
          <span
            className="particle-indicator"
            style={{ backgroundColor: accentColor }}
            aria-hidden="true"
          />
          <label htmlFor={inputId} id={labelId} className="particle-title">
            {name}
          </label>
          <span
            className="particle-charge-badge"
            style={{
              backgroundColor: `${accentColor}20`,
              color: accentColor,
              border: `1px solid ${accentColor}40`,
            }}
          >
            {chargeBadge}
          </span>
        </div>

        <div className="particle-control-input-group">
          <IconButton
            aria-label={`Decrease ${name} count`}
            size="sm"
            onClick={() => onChange(count - 1)}
            disabled={count <= min}
            icon={<Minus size={14} />}
          />

          <input
            id={inputId}
            type="number"
            min={min}
            max={max}
            step={1}
            value={draft}
            onChange={(e) => updateDraft(e.target.value)}
            className="particle-input"
            aria-invalid={Boolean(validationMessage)}
            aria-describedby={validationMessage ? `${descriptionId} ${errorId}` : descriptionId}
          />

          <IconButton
            aria-label={`Increase ${name} count`}
            size="sm"
            onClick={() => onChange(count + 1)}
            disabled={count >= max}
            icon={<Plus size={14} />}
          />
        </div>
      </div>

      <div className="particle-slider-wrap">
        <input
          id={sliderId}
          type="range"
          min={min}
          max={max}
          value={count}
          onChange={(e) => { const next = parseInt(e.target.value, 10); setDraft(String(next)); setValidationMessage(''); onChange(next); }}
          className="particle-slider"
          aria-labelledby={labelId}
          aria-describedby={descriptionId}
          style={{
            accentColor: accentColor,
          }}
        />
      </div>

      {validationMessage && <span id={errorId} className="particle-validation-message" role="alert">{validationMessage}</span>}

      <span id={descriptionId} style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
        {description}
      </span>
    </div>
  );
};

export const ParticleControl = React.memo(ParticleControlComponent);
