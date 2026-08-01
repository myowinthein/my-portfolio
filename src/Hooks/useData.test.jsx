import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import useData from './useData';
import { BlogContext } from '../Context/ContextProvider';

describe('useData', () => {
  it('returns the value provided by BlogContext', () => {
    const value = { blogsData: [], isLoading: false };
    const wrapper = ({ children }) => (
      <BlogContext.Provider value={value}>{children}</BlogContext.Provider>
    );
    const { result } = renderHook(() => useData(), { wrapper });
    expect(result.current).toBe(value);
  });

  it('returns undefined when rendered outside a provider', () => {
    const { result } = renderHook(() => useData());
    expect(result.current).toBeUndefined();
  });
});
