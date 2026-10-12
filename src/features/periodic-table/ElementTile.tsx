import React from 'react';
import { ElementData, StandardState } from '../../types/element';
import { ELEMENT_CATEGORIES } from '../../data/element-categories';
import { cn } from '../../lib/utils';
import './periodic-table.css';

export interface ElementTileProps {
  element: ElementData;
  isSelected: boolean;
  onSelect: (element: ElementData) => void;
  isDimmed?: boolean;
  predictedState?: StandardState | null;
  style?: React.CSSProperties;
}

const ElementTileComponent: React.FC<ElementTileProps> = ({
  element,
  isSelected,
  onSelect,
  isDimmed = false,
  predictedState,
  style,
}) => {
  const categoryMeta = ELEMENT_CATEGORIES[element.category];
  const accentColor = categoryMeta?.badgeColor || '#38bdf8';

  // State-specific border highlight if temperature mode active
  const stateColor =
    predictedState === 'solid'
      ? '#94a3b8'
      : predictedState === 'liquid'
      ? '#38bdf8'
      : predictedState === 'gas'
      ? '#c084fc'
      : predictedState === 'unknown'
      ? '#64748b'
      : null;

  return (
    <button
      type="button"
      onClick={() => onSelect(element)}
      className={cn(
        'element-tile',
        isSelected && 'element-tile--selected',
        isDimmed && 'element-tile--dimmed'
      )}
      style={{
        '--tile-accent': accentColor,
        ...(stateColor ? { borderColor: stateColor } : {}),
        ...style,
      } as React.CSSProperties}
      aria-pressed={isSelected}
      aria-label={`${element.name}, atomic number ${element.atomicNumber}, symbol ${element.symbol}, atomic mass ${element.atomicMass}, category ${categoryMeta?.name || element.category}${predictedState ? `, state: ${predictedState}` : ''}`}
      tabIndex={isDimmed ? -1 : 0}
    >
      <div className="tile-top">
        <span className="tile-number">{element.atomicNumber}</span>
        {predictedState ? (
          <span
            className="tile-state-tag"
            style={{ color: stateColor || undefined }}
            title={`Predicted state: ${predictedState}`}
          >
            {predictedState.toUpperCase().slice(0, 3)}
          </span>
        ) : (
          <span className="tile-mass">
            {typeof element.atomicMass === 'number'
              ? Number(element.atomicMass.toFixed(2))
              : element.atomicMass}
          </span>
        )}
      </div>

      <span className="tile-symbol">{element.symbol}</span>

      <span className="tile-name">{element.name}</span>
    </button>
  );
};

export const ElementTile = React.memo(ElementTileComponent);
