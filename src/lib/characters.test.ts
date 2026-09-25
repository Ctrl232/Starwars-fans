import { describe, expect, it } from 'vitest';
import { filmsCatalog, LUKE_ID, lukeNameOnly, VADER_ID } from '@/test/fixtures';
import { countFilmsByCharacter, getCharacterFilms, uniquePlanetCount } from './characters';

describe('characters', () => {
  it('obtiene las películas cruzando characterConnection aunque filmConnection venga vacío', () => {
    const films = getCharacterFilms(LUKE_ID, lukeNameOnly, filmsCatalog);
    expect(films.map((f) => f.title)).toEqual(['A New Hope', 'The Empire Strikes Back']);
  });

  it('también respeta los IDs que traiga filmConnection', () => {
    const withConnection = { filmConnection: { films: [{ id: 'ZmlsbXM6NA==' }] } };
    const films = getCharacterFilms(LUKE_ID, withConnection, filmsCatalog);
    expect(films.map((f) => f.episodeID)).toEqual([1, 4, 5]);
  });

  it('cuenta películas por personaje y planetas únicos', () => {
    const counts = countFilmsByCharacter(filmsCatalog);
    expect(counts.get(LUKE_ID)).toBe(2);
    expect(counts.get(VADER_ID)).toBe(3);
    expect(uniquePlanetCount(filmsCatalog)).toBe(4);
  });
});
