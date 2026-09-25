import 'server-only';
import { cache } from 'react';
import { print } from 'graphql';
import { addTypenameToDocument } from '@apollo/client/utilities';
import type { TypedDocumentNode } from '@apollo/client';
import { CharacterDetailQuery } from '@/graphql/queries';
import type { CharacterDetailQuery as CharacterDetailResult } from '@/gql/graphql';
import { postToUpstream } from './upstream';

/** Revalidación del caché de datos de Next (los datos de SWAPI casi no cambian). */
const REVALIDATE_SECONDS = 60 * 60 * 24;

/**
 * Ejecuta una query tipada desde el servidor (Server Components / generateMetadata).
 * Agrega `__typename` para que el resultado pueda hidratar la caché de Apollo
 * en el cliente sin volver a pedir los datos.
 */
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

/**
 * `cache` deduplica la llamada dentro de un mismo request:
 * generateMetadata y la página comparten un único fetch.
 */
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
