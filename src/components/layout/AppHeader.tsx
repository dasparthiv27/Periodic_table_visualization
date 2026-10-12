import React from 'react';
import { Atom, RotateCcw, Info } from 'lucide-react';
import { IconButton } from '../common/IconButton';
import './AppHeader.css';

export interface AppHeaderProps {
  onReset?: () => void;
  onOpenInfo?: () => void;
  activeElementSymbol?: string;
  activeElementName?: string;
  isOffline?: boolean;
  updateReady?: boolean;
  onApplyUpdate?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onReset,
  onOpenInfo,
  activeElementSymbol,
  activeElementName,
  isOffline = false,
  updateReady = false,
  onApplyUpdate,
}) => {
  return (
    <header className="app-header">
      <div className="container header-container">
        {/* Brand */}
        <div className="brand-section">
          <div className="brand-logo-wrap" aria-hidden="true">
            <Atom size={22} color="var(--text-accent)" />
          </div>
          <div className="brand-info">
            <span className="brand-kicker">FIELD NOTES <span aria-hidden="true">/</span> NO. 01</span>
            <h1 className="brand-title">Atomic Explorer</h1>
            <span className="brand-tagline">
              Periodic table · particle-scale exploration
            </span>
          </div>
        </div>

        {/* Center active element status */}
        {activeElementName && (
          <div className="header-center" aria-live="polite">
            <span className="specimen-label">SELECTED SPECIMEN</span>
            <span className="specimen-name"><b>{activeElementSymbol}</b><span>{activeElementName}</span></span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="header-actions">
          {isOffline && <span className="connection-status" role="status">Offline · cached app</span>}
          {updateReady && <button type="button" className="update-ready-button" onClick={onApplyUpdate}>Update ready · reload</button>}
          {onReset && (
            <IconButton
              aria-label="Set electron count equal to proton count for a neutral atom"
              variant="default"
              size="md"
              onClick={onReset}
              icon={<RotateCcw size={16} />}
            />
          )}

          {onOpenInfo && (
            <IconButton
              aria-label="Scientific Model & Architectural Information"
              variant="default"
              size="md"
              onClick={onOpenInfo}
              icon={<Info size={16} />}
            />
          )}

        </div>
      </div>
    </header>
  );
};
