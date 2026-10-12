import React, { Suspense, lazy, useState } from 'react';
import { Info, Box } from 'lucide-react';
import { AtomCounts, AtomDerivedProperties, VisualizationMode } from '../../types/atom';
import { VisualizationControls } from './VisualizationControls';
import { Nucleus } from './Nucleus';
import { ElectronOrbit } from './ElectronOrbit';
import { OrbitalExplorer } from './OrbitalExplorer';
import { useReducedMotionPreference } from '../../hooks/useReducedMotionPreference';
import type { UiPreferences } from '../../hooks/ui-preferences';
const ThreeNucleus = lazy(() => import('./ThreeNucleus').then((module) => ({ default: module.ThreeNucleus })));
import './AtomScene.css';

export interface AtomSceneProps {
  counts: AtomCounts;
  derived: AtomDerivedProperties;
  mode: VisualizationMode;
  onModeChange: (mode: VisualizationMode) => void;
  preferences: UiPreferences;
  onPreferenceChange: <K extends keyof UiPreferences>(key: K, value: UiPreferences[K]) => void;
  onResetPreferences: () => void;
}

export const AtomScene: React.FC<AtomSceneProps> = ({
  counts,
  derived,
  mode,
  onModeChange,
  preferences,
  onPreferenceChange,
  onResetPreferences,
}) => {
  const prefersReducedMotion = useReducedMotionPreference();
  const [resetKey, setResetKey] = useState(0);
  const isPlaying = preferences.animationEnabled && !prefersReducedMotion;

  const { protons, neutrons } = counts;
  const symbol = derived.element ? derived.element.symbol : 'X';
  const shells = derived.electronShells;

  // Base orbit radius calculations
  const baseRadius = 55;
  const radiusStep = 28;

  return (
    <div className="atom-scene-panel">
      {/* Controls Bar */}
      <VisualizationControls
        mode={mode}
        onModeChange={onModeChange}
        isPlaying={isPlaying}
        playbackDisabled={prefersReducedMotion}
        onTogglePlay={() => onPreferenceChange('animationEnabled', !preferences.animationEnabled)}
        showShellLabels={preferences.showShellLabels}
        onToggleShellLabels={() => onPreferenceChange('showShellLabels', !preferences.showShellLabels)}
        showPaths={preferences.showPaths}
        onTogglePaths={() => onPreferenceChange('showPaths', !preferences.showPaths)}
        showParticles={preferences.showParticles}
        onToggleParticles={() => onPreferenceChange('showParticles', !preferences.showParticles)}
        onResetView={() => setResetKey((key) => key + 1)}
        onResetPreferences={onResetPreferences}
      />

      <div className="atom-scene-canvas-wrap">
        <div className="stage-annotation" data-visualization-mode={mode} role="group" aria-label={`Atomic field specimen ${symbol}; atomic number ${protons}; mass number ${derived.massNumber}`}>
          <div className="stage-plate-mark"><span className="signal-mark" />FIELD STUDY <span>/</span> ATOMIC STRUCTURE</div>
          <div className="stage-readouts">
            <span><small>Z</small><b>{String(protons).padStart(3, '0')}</b></span>
            <span><small>A</small><b>{String(derived.massNumber).padStart(3, '0')}</b></span>
          </div>
          <span className="stage-scale-note">SCHEMATIC · NOT TO SCALE</span>
        </div>
        {mode === 'bohr' ? (
          <svg
            className="atom-svg"
            viewBox="-240 -240 480 480"
            role="img"
            aria-label={`Atomic visualization for ${derived.element?.name || 'custom nuclide'} with ${protons} protons, ${neutrons} neutrons, and ${counts.electrons} electrons`}
          >
            <defs>
              <radialGradient id="nucleusAmbientGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ef4444" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="nucleusCoreGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="60%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#881337" />
              </radialGradient>

              <filter id="electronGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Electron Orbits */}
            {preferences.showParticles && shells.map((electronCount, index) => {
              if (electronCount === 0) return null;
              const orbitRadius = baseRadius + index * radiusStep;
              return (
                <ElectronOrbit
                  key={`shell-${index}`}
                  shellIndex={index}
                  radius={orbitRadius}
                  electronCount={electronCount}
                  isPlaying={isPlaying}
                  showLabel={preferences.showShellLabels}
                />
              );
            })}

            {/* Central Nucleus */}
            {preferences.showParticles && <Nucleus
              protons={protons}
              neutrons={neutrons}
              symbol={symbol}
            />}
          </svg>
        ) : mode === 'nucleus-3d' ? (
          <div className="atom-3d-wrap">
            <Suspense fallback={<div className="viz-webgl-fallback" role="status">Loading interactive 3D view…</div>}>
              <ThreeNucleus counts={counts} shells={shells} playing={isPlaying} showPaths={preferences.showPaths} showParticles={preferences.showParticles} resetKey={resetKey} />
            </Suspense>
            <div className="particle-legend" role="group" aria-label="Particle legend">
              <span><i className="legend-dot legend-proton" />Protons</span>
              <span><i className="legend-dot legend-neutron" />Neutrons</span>
              <span><i className="legend-dot legend-electron" />Electrons</span>
            </div>
          </div>
        ) : mode === 'orbital' ? (
          <OrbitalExplorer element={derived.element} netCharge={derived.netCharge} />
        ) : (
          <div className="mode-placeholder-view">
            <Box size={40} color="var(--color-cyan)" />
            <h3 style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-primary)' }}>
              {mode === 'orbital' ? 'Quantum Orbital Cloud' : '3D Nucleon Physics'}
            </h3>
            <p style={{ maxWidth: 360, fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
              {mode === 'orbital'
                ? 'A probability-cloud view is not included. Explore the dataset electron configuration or return to the simplified Bohr shell view.'
                : 'This visualization mode is not available. Return to Bohr Shells to continue exploring.'}
            </p>
            <button
              type="button"
              className="neutralize-btn"
              onClick={() => onModeChange('bohr')}
            >
              Return to Bohr Shells View
            </button>
          </div>
        )}
      </div>

      {/* Scientific Caveat Footer */}
      <footer className="educational-caveat">
        <Info size={16} />
        <strong className="atom-interaction-hint">
          {mode === 'nucleus-3d' || mode === 'orbital'
            ? 'Drag to rotate; scroll or pinch to zoom.'
            : 'Adjust particle counts to change the atom.'}
        </strong>
        <span>
          <strong>Educational Model:</strong> The Bohr view uses simplified fixed paths, not literal electron tracks. The Orbital view samples hydrogenic 1s/2p one-electron probability densities; it does not calculate a full multi-electron atom.
        </span>
      </footer>
    </div>
  );
};
