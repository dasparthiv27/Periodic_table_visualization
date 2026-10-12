import React from 'react';
import { Play, Pause, Layers, Eye, RotateCcw, Orbit, Settings2, ChevronDown } from 'lucide-react';
import { VisualizationMode } from '../../types/atom';
import { IconButton } from '../../components/common/IconButton';
import './VisualizationControls.css';

export interface VisualizationControlsProps {
  mode: VisualizationMode;
  onModeChange: (mode: VisualizationMode) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackDisabled?: boolean;
  showShellLabels: boolean;
  onToggleShellLabels: () => void;
  showPaths?: boolean;
  onTogglePaths?: () => void;
  showParticles?: boolean;
  onToggleParticles?: () => void;
  onResetView?: () => void;
  onResetPreferences?: () => void;
}

export const VisualizationControls: React.FC<VisualizationControlsProps> = ({
  mode,
  onModeChange,
  isPlaying,
  onTogglePlay,
  playbackDisabled = false,
  showShellLabels,
  onToggleShellLabels,
  showPaths = true,
  onTogglePaths,
  showParticles = true,
  onToggleParticles,
  onResetView,
  onResetPreferences,
}) => {
  return (
    <div className="viz-controls-bar">
      <div className="viz-modes-group">
        <button
          type="button"
          aria-pressed={mode === 'bohr'}
          className={`viz-mode-btn ${mode === 'bohr' ? 'viz-mode-btn--active' : ''}`}
          onClick={() => onModeChange('bohr')}
        >
          <Layers size={14} />
          <span>Bohr Shells</span>
        </button>

        <button
          type="button"
          aria-pressed={mode === 'orbital'}
          className={`viz-mode-btn ${mode === 'orbital' ? 'viz-mode-btn--active' : ''}`}
          onClick={() => onModeChange('orbital')}
        >
          <span>Orbitals</span>
        </button>

        <button
          type="button"
          aria-pressed={mode === 'nucleus-3d'}
          className={`viz-mode-btn ${mode === 'nucleus-3d' ? 'viz-mode-btn--active' : ''}`}
          onClick={() => onModeChange('nucleus-3d')}
        >
          <span>3D Nucleus</span>
        </button>
      </div>

      <div className="viz-action-buttons">
        {mode !== 'orbital' && <IconButton
          aria-label={isPlaying ? 'Pause atom animation' : 'Play atom animation'}
          size="sm"
          disabled={playbackDisabled}
          onClick={onTogglePlay}
          icon={isPlaying ? <Pause size={14} /> : <Play size={14} />}
        />}
        <details className="viz-settings">
          <summary aria-label="Visualization settings" title="Visualization settings">
            <Settings2 size={14} aria-hidden="true" />
            <span>Settings</span>
            <ChevronDown size={12} aria-hidden="true" />
          </summary>
          <div className="viz-settings-menu" aria-label="Additional visualization settings">
            {mode === 'nucleus-3d' ? <>
              <IconButton aria-label={showPaths ? 'Hide electron shell paths' : 'Show electron shell paths'} size="sm" variant={showPaths ? 'primary' : 'default'} onClick={onTogglePaths} icon={<Orbit size={14} />} />
              <IconButton aria-label={showParticles ? 'Hide particles' : 'Show particles'} size="sm" variant={showParticles ? 'primary' : 'default'} onClick={onToggleParticles} icon={<Eye size={14} />} />
              <IconButton aria-label="Reset 3D view" size="sm" onClick={onResetView} icon={<RotateCcw size={14} />} />
            </> : mode === 'bohr' ? <IconButton
              aria-label={showShellLabels ? 'Hide shell labels' : 'Show shell labels'}
              size="sm"
              variant={showShellLabels ? 'primary' : 'default'}
              onClick={onToggleShellLabels}
              icon={<Eye size={14} />}
            /> : <span className="viz-settings-note">No additional settings for this mode.</span>}
            <IconButton aria-label="Reset saved visualization preferences" size="sm" onClick={onResetPreferences} icon={<RotateCcw size={14} />} />
          </div>
        </details>
      </div>
    </div>
  );
};
