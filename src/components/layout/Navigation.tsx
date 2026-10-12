import React from 'react';
import { Orbit, Table, BookOpen, Brain } from 'lucide-react';
import './Navigation.css';

export type ActiveTab = 'simulator' | 'table' | 'science' | 'quiz';

export interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="app-nav" aria-label="Main Navigation">
      <div className="container nav-container">
        <button
          type="button"
          className={`nav-tab ${activeTab === 'simulator' ? 'nav-tab--active' : ''}`}
          aria-current={activeTab === 'simulator' ? 'page' : undefined}
          onClick={() => onTabChange('simulator')}
        >
          <span className="nav-index" aria-hidden="true">01</span>
          <Orbit size={16} />
          <span>Atom Builder & Simulator</span>
        </button>

        <button
          type="button"
          className={`nav-tab ${activeTab === 'quiz' ? 'nav-tab--active' : ''}`}
          aria-current={activeTab === 'quiz' ? 'page' : undefined}
          onClick={() => onTabChange('quiz')}
        >
          <span className="nav-index" aria-hidden="true">02</span>
          <Brain size={16} />
          <span>Chemistry Quiz</span>
        </button>

        <button
          type="button"
          className={`nav-tab ${activeTab === 'table' ? 'nav-tab--active' : ''}`}
          aria-current={activeTab === 'table' ? 'page' : undefined}
          onClick={() => onTabChange('table')}
        >
          <span className="nav-index" aria-hidden="true">03</span>
          <Table size={16} />
          <span>Periodic Table</span>
        </button>

        <button
          type="button"
          className={`nav-tab ${activeTab === 'science' ? 'nav-tab--active' : ''}`}
          aria-current={activeTab === 'science' ? 'page' : undefined}
          onClick={() => onTabChange('science')}
        >
          <span className="nav-index" aria-hidden="true">04</span>
          <BookOpen size={16} />
          <span>Scientific Principles</span>
        </button>
      </div>
    </nav>
  );
};
