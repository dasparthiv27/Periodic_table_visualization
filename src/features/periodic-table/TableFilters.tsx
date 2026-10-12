import React from 'react';
import { Search, X, RotateCcw, Filter } from 'lucide-react';
import { ElementBlock, ElementCategory } from '../../types/element';
import { ELEMENT_CATEGORIES } from '../../data/element-categories';
import './TableFilters.css';

export interface TableFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: ElementCategory | null;
  onSelectCategory: (cat: ElementCategory | null) => void;
  selectedPeriod: number | null;
  onSelectPeriod: (period: number | null) => void;
  selectedGroup: number | 'unassigned' | null;
  onSelectGroup: (group: number | 'unassigned' | null) => void;
  selectedBlock: ElementBlock | null;
  onSelectBlock: (block: ElementBlock | null) => void;
  onResetFilters: () => void;
  matchCount: number;
  totalCount: number;
}

const CATEGORY_LIST = Object.values(ELEMENT_CATEGORIES);

export const TableFilters: React.FC<TableFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedPeriod,
  onSelectPeriod,
  selectedGroup,
  onSelectGroup,
  selectedBlock,
  onSelectBlock,
  onResetFilters,
  matchCount,
  totalCount,
}) => {
  const hasActiveFilters = Boolean(searchQuery.trim() || selectedCategory || selectedPeriod || selectedGroup !== null || selectedBlock);

  return (
    <div className="table-filters-panel" role="search" aria-label="Periodic table filter controls">
      {/* Top bar: search box + counter + reset */}
      <div className="table-filters-top">
        <div className="table-search-box">
          <span className="search-icon-wrap" aria-hidden="true">
            <Search size={16} />
          </span>
          <input
            type="text"
            className="table-search-input"
            placeholder="Search by name, symbol, or atomic number (e.g. Iron, Fe, 26)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search chemical elements"
          />
          {searchQuery && (
            <button
              type="button"
              className="table-search-clear"
              onClick={() => onSearchChange('')}
              aria-label="Clear search text"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-stats-group">
          <span className="match-count-badge">
            <Filter size={12} />
            <span>{matchCount} / {totalCount} Elements</span>
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              className="reset-filters-btn"
              onClick={onResetFilters}
              aria-label="Reset all element discovery filters"
            >
              <RotateCcw size={12} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      <div className="structure-filter-row" role="group" aria-label="Filter by periodic-table position">
        <label>Period<select aria-label="Filter by period" value={selectedPeriod ?? ''} onChange={(event) => onSelectPeriod(event.target.value ? Number(event.target.value) : null)}>
          <option value="">All periods</option>{Array.from({ length: 7 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}
        </select></label>
        <label>Group<select aria-label="Filter by group" value={selectedGroup ?? ''} onChange={(event) => onSelectGroup(event.target.value === 'unassigned' ? 'unassigned' : event.target.value ? Number(event.target.value) : null)}>
          <option value="">All groups</option>{Array.from({ length: 18 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}<option value="unassigned">Unassigned (f-block)</option>
        </select></label>
        <label>Block<select aria-label="Filter by block" value={selectedBlock ?? ''} onChange={(event) => onSelectBlock((event.target.value || null) as ElementBlock | null)}>
          <option value="">All blocks</option>{(['s', 'p', 'd', 'f'] as ElementBlock[]).map((block) => <option key={block} value={block}>{block.toUpperCase()} block</option>)}
        </select></label>
      </div>

      {/* Category Pills */}
      <div className="category-pills-row" role="group" aria-label="Chemical categories">
        <button
          type="button"
          className={`category-pill ${selectedCategory === null ? 'category-pill--active' : ''}`}
          onClick={() => onSelectCategory(null)}
          aria-pressed={selectedCategory === null}
        >
          <span>All Categories</span>
        </button>

        {CATEGORY_LIST.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`category-pill ${isSelected ? 'category-pill--active' : ''}`}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              style={{
                '--pill-color': cat.badgeColor,
              } as React.CSSProperties}
              aria-pressed={isSelected}
              title={cat.description}
            >
              <span className="category-dot" aria-hidden="true" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
