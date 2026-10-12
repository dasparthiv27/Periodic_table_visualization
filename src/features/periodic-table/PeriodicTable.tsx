import React, { useState, useMemo, useCallback } from 'react';
import { Table, Sparkles, ChevronDown } from 'lucide-react';
import { Panel } from '../../components/common/Panel';
import { ElementData, ElementCategory, ElementBlock, StandardState } from '../../types/element';
import { ELEMENTS } from '../../data/elements';
import { ElementTile } from './ElementTile';
import { TableFilters } from './TableFilters';
import { TemperatureSlider } from './TemperatureSlider';
import { getElementMatches } from './element-filters';
import './periodic-table.css';

export interface PeriodicTableProps {
  selectedAtomicNumber: number | null;
  onSelectElement: (element: ElementData) => void;
}

/**
 * Calculates CSS grid row and column coordinates for an element
 * within the standard 18-column, 7-period IUPAC periodic table with split f-block.
 * Row 1 is reserved for Group numbers (1..18).
 */
function getGridCoordinates(element: ElementData): { gridRow: number; gridColumn: number } {
  // Lanthanides (La 57 to Lu 71) -> f-block Row 10, Cols 4 to 18
  if (element.atomicNumber >= 57 && element.atomicNumber <= 71) {
    return {
      gridRow: 10,
      gridColumn: element.atomicNumber - 57 + 4,
    };
  }

  // Actinides (Ac 89 to Lr 103) -> f-block Row 11, Cols 4 to 18
  if (element.atomicNumber >= 89 && element.atomicNumber <= 103) {
    return {
      gridRow: 11,
      gridColumn: element.atomicNumber - 89 + 4,
    };
  }

  // Main table: Periods 1 to 7 -> Rows 2 to 8
  const row = element.period + 1;
  let col = element.group ?? 1;

  if (element.period === 1) {
    col = element.atomicNumber === 1 ? 1 : 18;
  }

  return {
    gridRow: row,
    gridColumn: col,
  };
}

const ELEMENT_GRID_STYLES = new Map(ELEMENTS.map((element) => {
  const { gridRow, gridColumn } = getGridCoordinates(element);
  return [element.atomicNumber, { gridRow, gridColumn }] as const;
}));

/**
 * Predicts state of matter at a specific Kelvin temperature at 1 atm.
 */
function predictStateAtTemp(element: ElementData, tempK: number): StandardState {
  if (element.meltingPoint === null || element.boilingPoint === null) {
    return element.standardState === 'unknown' ? 'unknown' : element.standardState;
  }
  if (tempK < element.meltingPoint) return 'solid';
  if (tempK >= element.meltingPoint && tempK < element.boilingPoint) return 'liquid';
  return 'gas';
}

const PeriodicTableComponent: React.FC<PeriodicTableProps> = ({
  selectedAtomicNumber,
  onSelectElement,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ElementCategory | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<number | 'unassigned' | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<ElementBlock | null>(null);
  const [temperatureK, setTemperatureK] = useState(293); // 20 °C default
  const [isTempModeEnabled, setIsTempModeEnabled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filter matching evaluation
  const { matchingMap, matchCount } = useMemo(() => getElementMatches(ELEMENTS, {
    query: searchQuery,
    category: selectedCategory,
    period: selectedPeriod,
    group: selectedGroup,
    block: selectedBlock,
  }), [searchQuery, selectedCategory, selectedPeriod, selectedGroup, selectedBlock]);

  const hasActiveFilter = Boolean(searchQuery.trim() || selectedCategory || selectedPeriod || selectedGroup !== null || selectedBlock);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedPeriod(null);
    setSelectedGroup(null);
    setSelectedBlock(null);
  }, []);

  return (
    <Panel
      title="Periodic Table of the Elements"
      subtitle="Canonical 118-element IUPAC interactive periodic table"
      icon={<Table size={18} />}
      actions={
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            className="table-collapse-button"
            aria-expanded={!isCollapsed}
            aria-controls="periodic-table-content"
            onClick={() => setIsCollapsed((collapsed) => !collapsed)}
          >
            <ChevronDown size={14} aria-hidden="true" />
            <span>{isCollapsed ? 'Show table' : 'Hide table'}</span>
          </button>
          <span className="sample-badge">
            <Sparkles size={12} color="var(--color-cyan)" />
            <span>All 118 Elements</span>
          </span>
        </div>
      }
    >
      <div id="periodic-table-content" className="periodic-table-wrapper" hidden={isCollapsed}>
        {/* Search & Category Filter Controls */}
        <TableFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={setSelectedPeriod}
          selectedGroup={selectedGroup}
          onSelectGroup={setSelectedGroup}
          selectedBlock={selectedBlock}
          onSelectBlock={setSelectedBlock}
          onResetFilters={handleResetFilters}
          matchCount={matchCount}
          totalCount={ELEMENTS.length}
        />

        {/* Phase State Temperature Simulator */}
        <TemperatureSlider
          temperatureK={temperatureK}
          onTemperatureChange={setTemperatureK}
          isEnabled={isTempModeEnabled}
          onToggleEnabled={() => setIsTempModeEnabled((prev) => !prev)}
        />

        {/* Empty Search Result Fallback */}
        {matchCount === 0 && (
          <div className="empty-results-banner" role="alert">
            <p>
              No chemical elements match &ldquo;<strong>{searchQuery}</strong>&rdquo;
              {selectedCategory ? ` in category "${selectedCategory}"` : ''}.
            </p>
            <button
              type="button"
              className="reset-filters-btn"
              onClick={handleResetFilters}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* 18-Column Grid Container with Horizontal Scroll */}
        <div className="table-scroll-container">
          <div
            className="ptable-grid"
            role="group"
            aria-label="Periodic table of elements"
          >
            {/* Row 1: Group Column Headers (1 to 18) */}
            {Array.from({ length: 18 }, (_, idx) => {
              const groupNum = idx + 1;
              return (
                <div
                  key={`grp-hdr-${groupNum}`}
                  className="group-header"
                  style={{ gridRow: 1, gridColumn: groupNum }}
                  aria-hidden="true"
                >
                  {groupNum}
                </div>
              );
            })}

            {/* Elements (1 to 118) */}
            {ELEMENTS.map((el) => {
              const isMatched = matchingMap.get(el.atomicNumber) ?? true;
              const isDimmed = hasActiveFilter && !isMatched;
              const predictedState = isTempModeEnabled
                ? predictStateAtTemp(el, temperatureK)
                : null;

              return (
                <ElementTile
                  key={el.atomicNumber}
                  element={el}
                  isSelected={selectedAtomicNumber === el.atomicNumber}
                  onSelect={onSelectElement}
                  isDimmed={isDimmed}
                  predictedState={predictedState}
                  style={ELEMENT_GRID_STYLES.get(el.atomicNumber)}
                />
              );
            })}

            {/* Lanthanide Marker (Period 6, Column 3) */}
            <div
              className="series-marker-tile"
              style={{
                gridRow: 7, // Period 6 + 1
                gridColumn: 3,
                '--marker-color': 'var(--cat-lanthanide)',
              } as React.CSSProperties}
              title="Lanthanide series (atomic numbers 57 to 71)"
              aria-hidden="true"
            >
              <span className="marker-numbers">57–71</span>
              <span className="marker-name">La–Lu</span>
            </div>

            {/* Actinide Marker (Period 7, Column 3) */}
            <div
              className="series-marker-tile"
              style={{
                gridRow: 8, // Period 7 + 1
                gridColumn: 3,
                '--marker-color': 'var(--cat-actinide)',
              } as React.CSSProperties}
              title="Actinide series (atomic numbers 89 to 103)"
              aria-hidden="true"
            >
              <span className="marker-numbers">89–103</span>
              <span className="marker-name">Ac–Lr</span>
            </div>

            {/* Row 9: Visual Gap Separator */}
            <div className="f-block-gap" style={{ gridRow: 9 }} aria-hidden="true" />

            {/* Row 10, Cols 1 to 3: Lanthanide Series Header Label */}
            <div
              className="series-header-card"
              style={{
                gridRow: 10,
                '--series-color': '#ec4899',
              } as React.CSSProperties}
            >
              <span>Lanthanides ★</span>
            </div>

            {/* Row 11, Cols 1 to 3: Actinide Series Header Label */}
            <div
              className="series-header-card"
              style={{
                gridRow: 11,
                '--series-color': '#c084fc',
              } as React.CSSProperties}
            >
              <span>Actinides ⚝</span>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export const PeriodicTable = React.memo(PeriodicTableComponent);
