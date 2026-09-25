import { screen } from '@testing-library/react';
import { GraphQLError } from 'graphql';
import type { MockLink } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithTheme } from '@/test/render';
import { filmsCatalog, LUKE_ID, lukeNameOnly } from '@/test/fixtures';
import { CharacterDetailQuery, FilmsCatalogQuery } from '@/graphql/queries';
import { CharacterDetailDialog } from './CharacterDetailDialog';

type MockedResponse = MockLink.MockedResponse;

const catalogMock: MockedResponse = {
  request: { query: FilmsCatalogQuery },
  result: { data: { allFilms: { __typename: 'FilmsConnection', films: filmsCatalog.map(withTypenames) } } },
};

function withTypenames(film: (typeof filmsCatalog)[number]) {
  return {
    __typename: 'Film',
    ...film,
    planetConnection: {
      __typename: 'FilmPlanetsConnection',
      planets: (film.planetConnection?.planets ?? []).map((p) => ({ __typename: 'Planet', ...p })),
    },
    characterConnection: {
      __typename: 'FilmCharactersConnection',
      characters: (film.characterConnection?.characters ?? []).map((c) => ({ __typename: 'Person', ...c })),
    },
  };
}

function renderDialog(mocks: MockedResponse[], id: string) {
  return renderWithTheme(
    <MockedProvider mocks={mocks}>
      <CharacterDetailDialog characterId={id} onClose={vi.fn()} />
    </MockedProvider>,
  );
}

describe('CharacterDetailDialog', () => {
  it('muestra el personaje con sus películas resueltas desde el catálogo', async () => {
    const detailMock: MockedResponse = {
      request: { query: CharacterDetailQuery, variables: { id: LUKE_ID } },
      result: {
        data: {
          person: {
            __typename: 'Person',
            ...lukeNameOnly,
            filmConnection: { __typename: 'PersonFilmsConnection', films: [] },
          },
        },
      },
    };
    renderDialog([detailMock, catalogMock], LUKE_ID);

    expect(await screen.findByRole('heading', { name: 'Luke Skywalker' })).toBeInTheDocument();
    expect(await screen.findByText('A New Hope')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAccessibleName('Luke Skywalker');
  });

  it('muestra "no encontrado" cuando el API responde con error para un ID inválido', async () => {
    const notFoundMock: MockedResponse = {
      request: { query: CharacterDetailQuery, variables: { id: 'xxxx' } },
      result: { errors: [new GraphQLError('No entry in local cache')], data: { person: null } },
    };
    renderDialog([notFoundMock, catalogMock], 'xxxx');

    expect(await screen.findByText('Personaje no encontrado')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Reintentar' })).not.toBeInTheDocument();
  });
});
