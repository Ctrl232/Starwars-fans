import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('solo emite el último valor después del delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'l' },
    });

    rerender({ value: 'lu' });
    rerender({ value: 'luk' });
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe('l');

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('luk');
  });
});
