import { useState, useMemo, useCallback } from 'react';
import { AtomCounts, AtomDerivedProperties, VisualizationMode } from '../types/atom';
import { SAMPLE_ELEMENTS_MAP } from '../data/elements';
import { deriveAtomProperties } from '../lib/chemistry/atomic-properties';
import { clamp } from '../lib/utils';

export interface UseAtomStateReturn {
  counts: AtomCounts;
  derived: AtomDerivedProperties;
  mode: VisualizationMode;
  selectedElementNumber: number | null;
  setProtons: (val: number | ((prev: number) => number)) => void;
  setNeutrons: (val: number | ((prev: number) => number)) => void;
  setElectrons: (val: number | ((prev: number) => number)) => void;
  setMode: (mode: VisualizationMode) => void;
  selectElement: (atomicNumber: number) => void;
  resetToNeutral: () => void;
}

const DEFAULT_PROTONS = 6; // Carbon default

export function useAtomState(initialProtons = DEFAULT_PROTONS, initialMode: VisualizationMode = 'bohr'): UseAtomStateReturn {
  const initialElement = SAMPLE_ELEMENTS_MAP.get(initialProtons);
  const initialNeutronCount = initialElement
    ? initialElement.commonIsotopes[0]?.neutrons ?? initialProtons
    : initialProtons;

  const [counts, setCounts] = useState<AtomCounts>({
    protons: initialProtons,
    neutrons: initialNeutronCount,
    electrons: initialProtons,
  });

  const [mode, setMode] = useState<VisualizationMode>(initialMode);

  // Derive all scientific properties
  const derived = useMemo<AtomDerivedProperties>(() => {
    return deriveAtomProperties(counts);
  }, [counts]);

  const setProtons = useCallback((valOrFn: number | ((prev: number) => number)) => {
    setCounts((prev) => {
      const requested = typeof valOrFn === 'function' ? valOrFn(prev.protons) : valOrFn;
      const nextProtons = Number.isFinite(requested) ? clamp(Math.trunc(requested), 1, 118) : prev.protons;
      return {
        ...prev,
        protons: nextProtons,
      };
    });
  }, []);

  const setNeutrons = useCallback((valOrFn: number | ((prev: number) => number)) => {
    setCounts((prev) => {
      const requested = typeof valOrFn === 'function' ? valOrFn(prev.neutrons) : valOrFn;
      const nextNeutrons = Number.isFinite(requested) ? clamp(Math.trunc(requested), 0, 180) : prev.neutrons;
      return {
        ...prev,
        neutrons: nextNeutrons,
      };
    });
  }, []);

  const setElectrons = useCallback((valOrFn: number | ((prev: number) => number)) => {
    setCounts((prev) => {
      const requested = typeof valOrFn === 'function' ? valOrFn(prev.electrons) : valOrFn;
      const nextElectrons = Number.isFinite(requested) ? clamp(Math.trunc(requested), 0, 118) : prev.electrons;
      return {
        ...prev,
        electrons: nextElectrons,
      };
    });
  }, []);

  const selectElement = useCallback((atomicNumber: number) => {
    if (!Number.isInteger(atomicNumber) || atomicNumber < 1 || atomicNumber > 118) return;
    const el = SAMPLE_ELEMENTS_MAP.get(atomicNumber);
    const neutrons = el?.commonIsotopes[0]?.neutrons ?? atomicNumber;

    setCounts({
      protons: atomicNumber,
      neutrons,
      electrons: atomicNumber, // Neutral ground state
    });
  }, []);

  const resetToNeutral = useCallback(() => {
    setCounts((prev) => ({
      ...prev,
      electrons: prev.protons,
    }));
  }, []);

  return {
    counts,
    derived,
    mode,
    selectedElementNumber: counts.protons,
    setProtons,
    setNeutrons,
    setElectrons,
    setMode,
    selectElement,
    resetToNeutral,
  };
}
