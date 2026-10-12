import React from 'react';
import { Thermometer, Power } from 'lucide-react';
import './TemperatureSlider.css';

export interface TemperatureSliderProps {
  temperatureK: number;
  onTemperatureChange: (tempK: number) => void;
  isEnabled: boolean;
  onToggleEnabled: () => void;
}

interface Preset {
  label: string;
  kelvin: number;
}

const PRESETS: Preset[] = [
  { label: '0 K (Abs. Zero)', kelvin: 0 },
  { label: '77 K (Liq. N₂)', kelvin: 77 },
  { label: '195 K (Dry Ice)', kelvin: 195 },
  { label: '293 K (Room Temp)', kelvin: 293 },
  { label: '373 K (Boiling H₂O)', kelvin: 373 },
  { label: '1811 K (Fe Melting)', kelvin: 1811 },
  { label: '5778 K (Sun Photosphere)', kelvin: 5778 },
];

export const TemperatureSlider: React.FC<TemperatureSliderProps> = ({
  temperatureK,
  onTemperatureChange,
  isEnabled,
  onToggleEnabled,
}) => {
  const celsius = (temperatureK - 273.15).toFixed(1);

  return (
    <div className="temp-slider-card" aria-label="Temperature state simulator">
      <div className="temp-slider-header">
        <div className="temp-title-group">
          <Thermometer size={16} color="var(--color-amber)" />
          <span className="temp-title">Phase State vs. Temperature</span>
        </div>

        <div className="temp-readout">
          <span className="temp-val-k">{temperatureK} K</span>
          <span className="temp-val-c">({celsius} °C)</span>
        </div>

        <button
          type="button"
          onClick={onToggleEnabled}
          className={`temp-toggle-btn ${isEnabled ? 'temp-toggle-btn--active' : ''}`}
          aria-pressed={isEnabled}
        >
          <Power size={13} />
          <span>{isEnabled ? 'Active' : 'Enable Phase View'}</span>
        </button>
      </div>

      {isEnabled && (
        <>
          <div className="temp-slider-row">
            <input
              type="range"
              min={0}
              max={6000}
              step={10}
              value={temperatureK}
              onChange={(e) => onTemperatureChange(Number(e.target.value))}
              className="temp-range-input"
              aria-label="Temperature slider in Kelvin"
            />
          </div>

          <div className="temp-presets-row" role="group" aria-label="Temperature presets">
            {PRESETS.map((p) => (
              <button
                key={p.kelvin}
                type="button"
                className="temp-preset-chip"
                onClick={() => onTemperatureChange(p.kelvin)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="temp-legend-strip">
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#94a3b8' }} />
              <span>Solid (T &lt; T_melt)</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#38bdf8' }} />
              <span>Liquid (T_melt ≤ T &lt; T_boil)</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#c084fc' }} />
              <span>Gas (T ≥ T_boil)</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#475569' }} />
              <span>Unknown / Superheavy</span>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: '10px' }}>
              At standard atmospheric pressure (1 atm)
            </span>
          </div>
        </>
      )}
    </div>
  );
};
