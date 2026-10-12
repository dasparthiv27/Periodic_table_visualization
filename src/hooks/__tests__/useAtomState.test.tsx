import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAtomState } from '../useAtomState';

describe('useAtomState', () => {
  it('selects an element with neutral electrons and its stored common isotope', () => {
    const { result } = renderHook(() => useAtomState());
    act(() => result.current.selectElement(8));
    expect(result.current.counts).toEqual({ protons: 8, neutrons: 8, electrons: 8 });
    expect(result.current.derived.element?.symbol).toBe('O');
    expect(result.current.derived.netCharge).toBe(0);
    expect(result.current.derived.massNumber).toBe(16);
    expect(result.current.derived.electronShells).toEqual([2, 6]);
  });

  it('derives charge and mass number after particle edits', () => {
    const { result } = renderHook(() => useAtomState());
    act(() => { result.current.setElectrons(4); result.current.setNeutrons(7); });
    expect(result.current.derived.netCharge).toBe(2);
    expect(result.current.derived.massNumber).toBe(13);
  });

  it('clamps and normalizes invalid particle counts and ignores non-finite values', () => {
    const { result } = renderHook(() => useAtomState());
    act(() => { result.current.setProtons(999); result.current.setNeutrons(-2); result.current.setElectrons(Number.NaN); });
    expect(result.current.counts).toEqual({ protons: 118, neutrons: 0, electrons: 6 });
    act(() => result.current.selectElement(0));
    expect(result.current.counts.protons).toBe(118);
  });
});
