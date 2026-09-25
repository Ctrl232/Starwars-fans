import 'server-only';
import { cache } from 'react';
import { print } from 'graphql';
import { addTypenameToDocument } from '@apollo/client/utilities';
import type { TypedDocumentNode } from '@apollo/client';
import { CharacterDetailQuery, FilmsCatalogQuery } from '@/graphql/queries';
import type {
  CharacterDetailQuery as CharacterDetailResult,
  FilmsCatalogQuery as FilmsCatalogResult,
} from '@/gql/graphql';
import { postToUpstream } from './upstream';

const REVALIDATE_SECONDS = 60 * 60 * 24;

export async function fetchGraphQL<TData, TVariables extends Record<string, unknown>>(
  document: TypedDocumentNode<TData, TVariables>,
  variables: TVariables,
): Promise<TData | null> {
  const response = await postToUpstream<TData>(
    { query: print(addTypenameToDocument(document)), variables },
    { next: { revalidate: REVALIDATE_SECONDS } },
  );
  return response.data ?? null;
}

export const getCharacterDetail = cache(
  async (id: string): Promise<CharacterDetailResult | null> => {
    try {
      return await fetchGraphQL(CharacterDetailQuery, { id });
    } catch {
      // Si el API falla en SSR, el cliente mostrará el estado de error con "Reintentar".
      return null;
    }
  },
);

export const getFilmsCatalog = cache(async (): Promise<FilmsCatalogResult | null> => {
  try {
    return await fetchGraphQL(FilmsCatalogQuery, {});
  } catch {
    return null;
  }
});
