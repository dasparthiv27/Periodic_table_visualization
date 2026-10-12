import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_UI_PREFERENCES,
  loadUiPreferences,
  resetUiPreferences,
  saveUiPreferences,
  UI_PREFERENCES_KEY,
  useUiPreferences,
} from '../ui-preferences';

function createStorage() {
  const values = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => values.set(key, value)),
    removeItem: vi.fn((key: string) => values.delete(key)),
    values,
  };
}

describe('UI preference persistence', () => {
  it('loads sensible defaults when nothing has been saved', () => {
    expect(loadUiPreferences(createStorage())).toEqual(DEFAULT_UI_PREFERENCES);
  });

  it('saves and restores validated display preferences', () => {
    const storage = createStorage();
    saveUiPreferences({ ...DEFAULT_UI_PREFERENCES, visualizationMode: 'nucleus-3d', showPaths: false }, storage);
    expect(loadUiPreferences(storage)).toMatchObject({ visualizationMode: 'nucleus-3d', showPaths: false });
    expect(storage.values.get(UI_PREFERENCES_KEY)).not.toContain('protons');
  });

  it('falls back safely for malformed or invalid saved values', () => {
    const storage = createStorage();
    storage.setItem(UI_PREFERENCES_KEY, '{broken');
    expect(loadUiPreferences(storage)).toEqual(DEFAULT_UI_PREFERENCES);
    storage.setItem(UI_PREFERENCES_KEY, JSON.stringify({ visualizationMode: 'unknown', animationEnabled: 'yes', showPaths: false }));
    expect(loadUiPreferences(storage)).toMatchObject({ visualizationMode: 'bohr', animationEnabled: true, showPaths: false });
  });

  it('resets saved preferences', () => {
    const storage = createStorage();
    storage.setItem(UI_PREFERENCES_KEY, JSON.stringify({ visualizationMode: 'orbital' }));
    expect(resetUiPreferences(storage)).toEqual(DEFAULT_UI_PREFERENCES);
    expect(storage.getItem(UI_PREFERENCES_KEY)).toBeNull();
  });

  it('continues with defaults when storage reads or writes fail', () => {
    const failingStorage = {
      getItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('blocked'); },
      removeItem: () => { throw new Error('blocked'); },
    };
    expect(loadUiPreferences(failingStorage)).toEqual(DEFAULT_UI_PREFERENCES);
    expect(() => saveUiPreferences(DEFAULT_UI_PREFERENCES, failingStorage)).not.toThrow();
    expect(resetUiPreferences(failingStorage)).toEqual(DEFAULT_UI_PREFERENCES);
  });

  it('updates and resets preferences through the application hook', () => {
    const storage = createStorage();
    const originalLocalStorage = window.localStorage;
    Object.defineProperty(window, 'localStorage', { configurable: true, value: storage });
    function Harness() {
      const { preferences, updatePreference, resetPreferences } = useUiPreferences();
      return <div><output>{preferences.showPaths ? 'paths on' : 'paths off'}</output>
        <button onClick={() => updatePreference('showPaths', false)}>Hide paths</button>
        <button onClick={resetPreferences}>Reset preferences</button></div>;
    }
    try {
      render(<Harness />);
      fireEvent.click(screen.getByRole('button', { name: 'Hide paths' }));
      expect(screen.getByText('paths off')).toBeInTheDocument();
      expect(loadUiPreferences(storage).showPaths).toBe(false);
      fireEvent.click(screen.getByRole('button', { name: 'Reset preferences' }));
      expect(screen.getByText('paths on')).toBeInTheDocument();
      expect(storage.getItem(UI_PREFERENCES_KEY)).toBeNull();
    } finally {
      Object.defineProperty(window, 'localStorage', { configurable: true, value: originalLocalStorage });
    }
  });
});
