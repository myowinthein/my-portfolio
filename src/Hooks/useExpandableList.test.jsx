import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import useExpandableList from './useExpandableList';

describe('useExpandableList', () => {
  it('shows only the initial count of items by default', () => {
    const { result } = renderHook(() => useExpandableList([1, 2, 3, 4, 5], 2));
    expect(result.current.visible).toEqual([1, 2]);
    expect(result.current.showAll).toBe(false);
  });

  it('shows all items after toggle', () => {
    const { result } = renderHook(() => useExpandableList([1, 2, 3, 4, 5], 2));
    act(() => result.current.toggle());
    expect(result.current.visible).toEqual([1, 2, 3, 4, 5]);
    expect(result.current.showAll).toBe(true);
  });

  it('collapses back to the initial count after toggling twice', () => {
    const { result } = renderHook(() => useExpandableList([1, 2, 3, 4, 5], 2));
    act(() => result.current.toggle());
    act(() => result.current.toggle());
    expect(result.current.visible).toEqual([1, 2]);
    expect(result.current.showAll).toBe(false);
  });

  it('returns the full list unchanged when initialCount exceeds its length', () => {
    const { result } = renderHook(() => useExpandableList([1, 2], 5));
    expect(result.current.visible).toEqual([1, 2]);
  });
});
