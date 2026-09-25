import type { CharacterSummaryFragment } from '@/gql/graphql';
import type { CatalogFilm, CharacterDetail } from '@/lib/characters';

export const LUKE_ID = 'cGVvcGxlOjE=';
export const VADER_ID = 'cGVvcGxlOjQ=';

export const lukeSummary: CharacterSummaryFragment = {
  id: LUKE_ID,
  name: 'Luke Skywalker',
  gender: 'male',
  birthYear: '19BBY',
  species: null,
};

export const lukeDetail: CharacterDetail = {
  id: LUKE_ID,
  name: 'Luke Skywalker',
  birthYear: '19BBY',
  gender: 'male',
  height: 172,
  mass: 77,
  eyeColor: 'blue',
  hairColor: 'blond',
  skinColor: 'fair',
  homeworld: { id: 'cGxhbmV0czox', name: 'Tatooine' },
  species: null,
  filmConnection: { films: [] },
};

export const lukeNameOnly: CharacterDetail = {
  id: LUKE_ID,
  name: 'Luke Skywalker',
  birthYear: null,
  gender: null,
  height: null,
  mass: null,
  eyeColor: null,
  hairColor: null,
  skinColor: null,
  homeworld: null,
  species: null,
  filmConnection: { films: [] },
};

export const filmsCatalog: CatalogFilm[] = [
  {
    id: 'ZmlsbXM6Mg==',
    title: 'The Empire Strikes Back',
    episodeID: 5,
    director: 'Irvin Kershner',
    releaseDate: '1980-05-17',
    planetConnection: {
      planets: [
        { id: 'cGxhbmV0czo0', name: 'Hoth' },
        { id: 'cGxhbmV0czo1', name: 'Dagobah' },
      ],
    },
    characterConnection: { characters: [{ id: LUKE_ID }, { id: VADER_ID }] },
  },
  {
    id: 'ZmlsbXM6MQ==',
    title: 'A New Hope',
    episodeID: 4,
    director: 'George Lucas',
    releaseDate: '1977-05-25',
    planetConnection: {
      planets: [
        { id: 'cGxhbmV0czox', name: 'Tatooine' },
        { id: 'cGxhbmV0czoy', name: 'Alderaan' },
      ],
    },
    characterConnection: { characters: [{ id: LUKE_ID }, { id: VADER_ID }] },
  },
  {
    id: 'ZmlsbXM6NA==',
    title: 'The Phantom Menace',
    episodeID: 1,
    director: 'George Lucas',
    releaseDate: '1999-05-19',
    planetConnection: { planets: [{ id: 'cGxhbmV0czox', name: 'Tatooine' }] },
    characterConnection: { characters: [{ id: VADER_ID }] },
  },
];
