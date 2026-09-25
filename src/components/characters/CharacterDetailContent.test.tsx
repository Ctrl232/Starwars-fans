import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithTheme } from '@/test/render';
import { filmsCatalog, LUKE_ID, lukeDetail, lukeNameOnly } from '@/test/fixtures';
import { getCharacterFilms } from '@/lib/characters';
import { CharacterDetailContent } from './CharacterDetailContent';

const lukeFilms = getCharacterFilms(LUKE_ID, lukeDetail, filmsCatalog);

describe('CharacterDetailContent', () => {
  it('lista las películas en orden de episodio con su director', () => {
    renderWithTheme(<CharacterDetailContent character={lukeDetail} films={lukeFilms} />);

    const titles = screen.getAllByRole('heading', { level: 4 }).map((h) => h.textContent);
    expect(titles).toEqual(['A New Hope', 'The Empire Strikes Back']);
    expect(screen.getByText('George Lucas')).toBeInTheDocument();
    expect(screen.getByText('Irvin Kershner')).toBeInTheDocument();
  });

  it('muestra los planetas de cada película como chips', () => {
    renderWithTheme(<CharacterDetailContent character={lukeDetail} films={lukeFilms} />);

    const planets = screen.getByLabelText('Planetas de The Empire Strikes Back');
    expect(within(planets).getByText('Hoth')).toBeInTheDocument();
    expect(within(planets).getByText('Dagobah')).toBeInTheDocument();
    expect(screen.getByText('4 planetas visitados')).toBeInTheDocument();
  });

  it('oculta los datos vacíos y muestra un aviso cuando el API solo trae el nombre', () => {
    renderWithTheme(<CharacterDetailContent character={lukeNameOnly} films={lukeFilms} />);

    expect(screen.queryByText('Año de nacimiento')).not.toBeInTheDocument();
    expect(screen.getByText(/no tiene datos biográficos/i)).toBeInTheDocument();
    expect(screen.getByText('2 películas')).toBeInTheDocument();
  });

  it('muestra estado vacío cuando no hay películas', () => {
    renderWithTheme(<CharacterDetailContent character={lukeDetail} films={[]} />);
    expect(screen.getByText('Sin películas registradas')).toBeInTheDocument();
  });
});
