import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithTheme } from '@/test/render';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('permite reintentar', async () => {
    const onRetry = vi.fn();
    renderWithTheme(<ErrorState onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('No pudimos cargar la información');
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
