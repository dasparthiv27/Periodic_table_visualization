import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { X, ExternalLink, Atom } from 'lucide-react';
import { useAtomState } from '../hooks/useAtomState';
import { useUiPreferences } from '../hooks/ui-preferences';
import { usePwaStatus } from '../hooks/usePwaStatus';
import { AppHeader } from '../components/layout/AppHeader';
import { Navigation, ActiveTab } from '../components/layout/Navigation';
import { ResponsiveLayout } from '../components/layout/ResponsiveLayout';
import { SpaceBackdrop } from '../components/layout/SpaceBackdrop';
import { ELEMENT_CATEGORIES } from '../data/element-categories';
import { AtomBuilder } from '../features/atom-builder';
import { AtomScene } from '../features/atom-visualization';
import { ElementDetails } from '../features/element-details';
import { ElementComparison } from '../features/element-details/ElementComparison';
import { PeriodicTable } from '../features/periodic-table';
import { Panel } from '../components/common/Panel';
import { IconButton } from '../components/common/IconButton';
import { LoadingState } from '../components/common/LoadingState';
import type { ElementData } from '../types/element';
import './App.css';

const ChemistryQuiz = lazy(() => import('../features/chemistry-quiz/ChemistryQuiz').then((module) => ({ default: module.ChemistryQuiz })));

export const App: React.FC = () => {
  const { preferences, updatePreference, resetPreferences } = useUiPreferences();
  const pwaStatus = usePwaStatus();
  const {
    counts,
    derived,
    mode,
    selectedElementNumber,
    setProtons,
    setNeutrons,
    setElectrons,
    setMode,
    selectElement,
    resetToNeutral,
  } = useAtomState(6, preferences.visualizationMode); // Default Carbon
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleModeChange = useCallback((nextMode: typeof mode) => {
    setMode(nextMode);
    updatePreference('visualizationMode', nextMode);
  }, [setMode, updatePreference]);

  const handleResetPreferences = useCallback(() => {
    resetPreferences();
    setMode('bohr');
  }, [resetPreferences, setMode]);

  const handleSelectElement = useCallback((element: ElementData) => {
    selectElement(element.atomicNumber);
  }, [selectElement]);

  const handleSelectFromTable = useCallback((element: ElementData) => {
    handleSelectElement(element);
    setActiveTab('simulator');
  }, [handleSelectElement]);

  useEffect(() => {
    if (!showInfoModal) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();
    const handleDialogKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowInfoModal(false);
      } else if (event.key === 'Tab') {
        if (!focusable?.length) {
          event.preventDefault();
          dialogRef.current?.focus();
        } else if (event.shiftKey && document.activeElement === focusable[0]) {
          event.preventDefault();
          focusable[focusable.length - 1]?.focus();
        } else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) {
          event.preventDefault();
          focusable[0]?.focus();
        }
      }
    };
    document.addEventListener('keydown', handleDialogKeydown);
    return () => {
      document.removeEventListener('keydown', handleDialogKeydown);
      previousFocus?.focus();
    };
  }, [showInfoModal]);

  return (
    <div className="app-root">
      <SpaceBackdrop accentColor={derived.element ? ELEMENT_CATEGORIES[derived.element.category].colorVar : 'var(--color-cyan)'} />
      {/* Sticky Header */}
      <AppHeader
        onReset={resetToNeutral}
        onOpenInfo={() => setShowInfoModal(true)}
        activeElementSymbol={derived.element?.symbol}
        activeElementName={derived.element?.name}
        isOffline={!pwaStatus.isOnline}
        updateReady={pwaStatus.updateReady}
        onApplyUpdate={pwaStatus.applyUpdate}
      />

      {/* View Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Tab Content */}
      {activeTab === 'simulator' && (
        <ResponsiveLayout
          leftSidebar={
            <AtomBuilder
              counts={counts}
              derived={derived}
              onProtonsChange={setProtons}
              onNeutronsChange={setNeutrons}
              onElectronsChange={setElectrons}
              onResetToNeutral={resetToNeutral}
            />
          }
          mainContent={
            <>
              <AtomScene
                counts={counts}
                derived={derived}
                mode={mode}
                onModeChange={handleModeChange}
                preferences={preferences}
                onPreferenceChange={updatePreference}
                onResetPreferences={handleResetPreferences}
              />
              <PeriodicTable
                selectedAtomicNumber={selectedElementNumber}
                onSelectElement={handleSelectElement}
              />
            </>
          }
          rightSidebar={
            <>
              <ElementDetails derived={derived} />
              <ElementComparison selectedAtomicNumber={selectedElementNumber} />
            </>
          }
        />
      )}

      {activeTab === 'table' && (
        <main className="container" style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-10)' }}>
          <PeriodicTable
            selectedAtomicNumber={selectedElementNumber}
            onSelectElement={handleSelectFromTable}
          />
        </main>
      )}

      {activeTab === 'science' && (
        <main className="container" style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-10)' }}>
          <Panel
            title="Scientific Architecture & Modeling Rules"
            subtitle="Physics ground rules and educational boundaries for Atomic Explorer"
            icon={<Atom size={20} />}
          >
            <div className="science-doc-panel">
              <p>
                Atomic Explorer is engineered to present authentic chemical physics principles while explicitly distinguishing pedagogical simplifications from rigorous quantum mechanics.
              </p>

              <div className="science-grid">
                <div className="science-card">
                  <h4>1. Nuclear Identity</h4>
                  <p>
                    <strong>Proton count (Z)</strong> dictates elemental identity and atomic number. Elements with zero protons are not chemical elements (e.g., free neutrons).
                  </p>
                  <code>Z = protons</code>
                </div>

                <div className="science-card">
                  <h4>2. Mass Number & Isotopes</h4>
                  <p>
                    <strong>Neutron count (N)</strong> determines the nuclear isotope and mass number. Mass number is the integer count of nucleons.
                  </p>
                  <code>A = Z + N</code>
                </div>

                <div className="science-card">
                  <h4>3. Net Charge & Ionization</h4>
                  <p>
                    <strong>Electron count</strong> determines electrical charge. Neutral atoms have equal protons and electrons. Cations have fewer electrons; anions have more.
                  </p>
                  <code>Charge = Protons - Electrons</code>
                </div>

                <div className="science-card">
                  <h4>4. Electron Shells vs. Orbitals</h4>
                  <p>
                    Shells group electrons by principal quantum number n, with the educational capacity rule 2n². Subshells describe configuration notation; neither notation means electrons travel on fixed circular paths. Physical electron states are represented by probability distributions.
                  </p>
                  <code>Shell capacity rule: 2n²</code>
                </div>

                <div className="science-card">
                  <h4>5. Reading Electron Configuration</h4>
                  <p>
                    In notation such as 2p⁴, 2 is the principal shell, p is the subshell type, and the superscript is the electron count there. Neutral configurations shown in Element Explorer are supplied by the element dataset; shell totals are shown separately.
                  </p>
                  <code>n · subshell · electron count</code>
                </div>
              </div>
            </div>
          </Panel>
        </main>
      )}

      {activeTab === 'quiz' && (
        <main className="container" style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-10)', maxWidth: 900 }}>
          <Suspense fallback={<LoadingState label="Loading chemistry quiz..." />}>
            <ChemistryQuiz />
          </Suspense>
        </main>
      )}

      {/* Information Modal */}
      {showInfoModal && (
        <div className="modal-backdrop" onClick={() => setShowInfoModal(false)}>
          <div
            className="modal-box"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 id="modal-title" style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)' }}>
                About Atomic Explorer
              </h3>
              <IconButton
                aria-label="Close dialog"
                variant="subtle"
                size="sm"
                onClick={() => setShowInfoModal(false)}
                icon={<X size={16} />}
              />
            </div>
            <div className="modal-content">
              <p>
                <strong>Atomic Explorer</strong> is an interactive web application designed to explore the periodic table of elements, nuclear isotopes, and electron configurations with real-time particle-level control.
              </p>
              <p>
                <strong>Current Phase:</strong> Phase 5 (Final Polish and Release Checks). Automated checks pass; manual browser and device review is still pending.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <a
                  href="https://iupac.org/what-we-do/periodic-table-of-elements/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  <span>IUPAC Periodic Table Reference</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="neutralize-btn"
                onClick={() => setShowInfoModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
