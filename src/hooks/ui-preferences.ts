import { useCallback, useRef, useState } from 'react';
import type { VisualizationMode } from '../types/atom';

export const UI_PREFERENCES_KEY = 'atomic-explorer-ui-preferences-v1';

export interface UiPreferences {
  visualizationMode: VisualizationMode;
  animationEnabled: boolean;
  showShellLabels: boolean;
  showPaths: boolean;
  showParticles: boolean;
}

export const DEFAULT_UI_PREFERENCES: UiPreferences = {
  visualizationMode: 'bohr',
  animationEnabled: true,
  showShellLabels: true,
  showPaths: true,
  showParticles: true,
};

type PreferenceStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
const MODES: VisualizationMode[] = ['bohr', 'orbital', 'nucleus-3d'];

function browserStorage(): PreferenceStorage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

function normalizePreferences(raw: unknown): UiPreferences {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ...DEFAULT_UI_PREFERENCES };
  const input = raw as Record<string, unknown>;
  return {
    visualizationMode: MODES.includes(input.visualizationMode as VisualizationMode)
      ? (input.visualizationMode as VisualizationMode)
      : DEFAULT_UI_PREFERENCES.visualizationMode,
    animationEnabled: typeof input.animationEnabled === 'boolean' ? input.animationEnabled : DEFAULT_UI_PREFERENCES.animationEnabled,
    showShellLabels: typeof input.showShellLabels === 'boolean' ? input.showShellLabels : DEFAULT_UI_PREFERENCES.showShellLabels,
    showPaths: typeof input.showPaths === 'boolean' ? input.showPaths : DEFAULT_UI_PREFERENCES.showPaths,
    showParticles: typeof input.showParticles === 'boolean' ? input.showParticles : DEFAULT_UI_PREFERENCES.showParticles,
  };
}

export function loadUiPreferences(storage: PreferenceStorage | null = browserStorage()): UiPreferences {
  try {
    const value = storage?.getItem(UI_PREFERENCES_KEY);
    return value ? normalizePreferences(JSON.parse(value) as unknown) : { ...DEFAULT_UI_PREFERENCES };
  } catch {
    return { ...DEFAULT_UI_PREFERENCES };
  }
}

export function saveUiPreferences(preferences: unknown, storage: PreferenceStorage | null = browserStorage()): void {
  try {
    storage?.setItem(UI_PREFERENCES_KEY, JSON.stringify(normalizePreferences(preferences)));
  } catch {
    // Storage may be disabled or full; in-memory preferences continue to work.
  }
}

export function resetUiPreferences(storage: PreferenceStorage | null = browserStorage()): UiPreferences {
  try {
    storage?.removeItem(UI_PREFERENCES_KEY);
  } catch {
    // Reset still applies in memory when storage is unavailable.
  }
  return { ...DEFAULT_UI_PREFERENCES };
}

export function useUiPreferences() {
  const [preferences, setPreferences] = useState(loadUiPreferences);
  const current = useRef(preferences);
  current.current = preferences;

  const updatePreference = useCallback(<K extends keyof UiPreferences>(key: K, value: UiPreferences[K]) => {
    const next = normalizePreferences({ ...current.current, [key]: value });
    current.current = next;
    setPreferences(next);
    saveUiPreferences(next);
  }, []);

  const resetPreferences = useCallback(() => {
    const next = resetUiPreferences();
    current.current = next;
    setPreferences(next);
  }, []);

  return { preferences, updatePreference, resetPreferences };
}
