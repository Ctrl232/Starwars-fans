import type { CharacterDetailQuery, FilmsCatalogQuery } from '@/gql/graphql';
import { compact } from './utils';

export type CharacterDetail = NonNullable<CharacterDetailQuery['person']>;
export type CatalogFilm = NonNullable<
  NonNullable<NonNullable<FilmsCatalogQuery['allFilms']>['films']>[number]
>;

export function catalogFilms(catalog: FilmsCatalogQuery | null | undefined): CatalogFilm[] {
  return compact(catalog?.allFilms?.films);
}

export function getCharacterFilms(
  characterId: string,
  character: Pick<CharacterDetail, 'filmConnection'> | null | undefined,
  films: ReadonlyArray<CatalogFilm>,
): CatalogFilm[] {
  const idsFromPerson = new Set(compact(character?.filmConnection?.films).map((film) => film.id));

  return films
    .filter(
      (film) =>
        idsFromPerson.has(film.id) ||
        compact(film.characterConnection?.characters).some((c) => c.id === characterId),
    )
    .sort((a, b) => (a.episodeID ?? 0) - (b.episodeID ?? 0));
}

export function countFilmsByCharacter(films: ReadonlyArray<CatalogFilm>): Map<string, number> {
  const counts = new Map<string, number>();
  for (const film of films) {
    for (const character of compact(film.characterConnection?.characters)) {
      counts.set(character.id, (counts.get(character.id) ?? 0) + 1);
    }
  }
  return counts;
}

export function uniquePlanetCount(films: ReadonlyArray<CatalogFilm>): number {
  const ids = new Set<string>();
  films.forEach((film) => compact(film.planetConnection?.planets).forEach((p) => ids.add(p.id)));
  return ids.size;
}
