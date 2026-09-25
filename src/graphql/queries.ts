import { graphql } from '@/gql';

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
        films {
          id
        }
      }
    }
  }
`);

export const FilmsCatalogQuery = graphql(`
  query FilmsCatalog {
    allFilms {
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
        characterConnection {
          characters {
            id
          }
        }
      }
    }
  }
`);
