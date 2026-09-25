import { graphql } from '@/gql';

/** Página del listado (paginación por cursor). */
export const CharactersPageQuery = graphql(`
  query CharactersPage($first: Int!, $after: String) {
    allPeople(first: $first, after: $after) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      people {
        ...CharacterSummary
      }
    }
  }
`);

/**
 * Índice liviano de todos los personajes (solo campos del listado).
 * El API no expone un filtro por nombre, así que la búsqueda se resuelve
 * en cliente sobre este índice (82 registros, se pide una sola vez y queda en caché).
 */
export const CharactersIndexQuery = graphql(`
  query CharactersIndex {
    allPeople {
      totalCount
      people {
        ...CharacterSummary
      }
    }
  }
`);

export const CharacterSummaryFragment = graphql(`
  fragment CharacterSummary on Person {
    id
    name
    gender
    birthYear
    species {
      id
      name
    }
  }
`);

/** Detalle completo: películas, director y planetas de cada película. */
export const CharacterDetailQuery = graphql(`
  query CharacterDetail($id: ID!) {
    person(id: $id) {
      id
      name
      birthYear
      gender
      height
      mass
      eyeColor
      hairColor
      skinColor
      homeworld {
        id
        name
      }
      species {
        id
        name
      }
      filmConnection {
        totalCount
        films {
          id
          title
          episodeID
          director
          releaseDate
          planetConnection {
            planets {
              id
              name
            }
          }
        }
      }
    }
  }
`);
