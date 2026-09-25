import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithTheme } from '@/test/render';
import { lukeSummary } from '@/test/fixtures';
import { CharacterCard } from './CharacterCard';

describe('CharacterCard', () => {
  it('muestra la información resumida del personaje', () => {
    renderWithTheme(<CharacterCard character={lukeSummary} onSelect={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Luke Skywalker' })).toBeInTheDocument();
    expect(screen.getByText('Masculino')).toBeInTheDocument();
    expect(screen.getByText('Nacimiento: 19BBY')).toBeInTheDocument();
  });

  it('llama a onSelect con el id al usar el CTA (mouse y teclado)', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderWithTheme(<CharacterCard character={lukeSummary} onSelect={onSelect} />);

    const cta = screen.getByRole('button', { name: 'Ver detalle de Luke Skywalker' });
    await user.click(cta);
    expect(onSelect).toHaveBeenCalledWith('cGVvcGxlOjE=');

    cta.focus();
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('precarga el detalle al enfocar el CTA', async () => {
    const user = userEvent.setup();
    const onPrefetch = vi.fn();
    renderWithTheme(<CharacterCard character={lukeSummary} onSelect={vi.fn()} onPrefetch={onPrefetch} />);

    await user.tab();
    expect(onPrefetch).toHaveBeenCalledWith('cGVvcGxlOjE=');
  });
});

describe('CharacterCard con datos incompletos', () => {
  it('no muestra chips vacíos y sí el conteo de películas', () => {
    renderWithTheme(
      <CharacterCard
        character={{ ...lukeSummary, gender: null, birthYear: null }}
        onSelect={vi.fn()}
        filmCount={4}
      />,
    );

    expect(screen.getByText('4 películas')).toBeInTheDocument();
    expect(screen.queryByText(/Nacimiento/)).not.toBeInTheDocument();
  });
});
