/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query CharactersPage($first: Int!, $after: String) {\n    allPeople(first: $first, after: $after) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      people {\n        ...CharacterSummary\n      }\n    }\n  }\n": typeof types.CharactersPageDocument,
    "\n  query CharactersIndex {\n    allPeople {\n      totalCount\n      people {\n        ...CharacterSummary\n      }\n    }\n  }\n": typeof types.CharactersIndexDocument,
    "\n  fragment CharacterSummary on Person {\n    id\n    name\n    gender\n    birthYear\n    species {\n      id\n      name\n    }\n  }\n": typeof types.CharacterSummaryFragmentDoc,
    "\n  query CharacterDetail($id: ID!) {\n    person(id: $id) {\n      id\n      name\n      birthYear\n      gender\n      height\n      mass\n      eyeColor\n      hairColor\n      skinColor\n      homeworld {\n        id\n        name\n      }\n      species {\n        id\n        name\n      }\n      filmConnection {\n        films {\n          id\n        }\n      }\n    }\n  }\n": typeof types.CharacterDetailDocument,
    "\n  query FilmsCatalog {\n    allFilms {\n      films {\n        id\n        title\n        episodeID\n        director\n        releaseDate\n        planetConnection {\n          planets {\n            id\n            name\n          }\n        }\n        characterConnection {\n          characters {\n            id\n          }\n        }\n      }\n    }\n  }\n": typeof types.FilmsCatalogDocument,
};
const documents: Documents = {
    "\n  query CharactersPage($first: Int!, $after: String) {\n    allPeople(first: $first, after: $after) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      people {\n        ...CharacterSummary\n      }\n    }\n  }\n": types.CharactersPageDocument,
    "\n  query CharactersIndex {\n    allPeople {\n      totalCount\n      people {\n        ...CharacterSummary\n      }\n    }\n  }\n": types.CharactersIndexDocument,
    "\n  fragment CharacterSummary on Person {\n    id\n    name\n    gender\n    birthYear\n    species {\n      id\n      name\n    }\n  }\n": types.CharacterSummaryFragmentDoc,
    "\n  query CharacterDetail($id: ID!) {\n    person(id: $id) {\n      id\n      name\n      birthYear\n      gender\n      height\n      mass\n      eyeColor\n      hairColor\n      skinColor\n      homeworld {\n        id\n        name\n      }\n      species {\n        id\n        name\n      }\n      filmConnection {\n        films {\n          id\n        }\n      }\n    }\n  }\n": types.CharacterDetailDocument,
    "\n  query FilmsCatalog {\n    allFilms {\n      films {\n        id\n        title\n        episodeID\n        director\n        releaseDate\n        planetConnection {\n          planets {\n            id\n            name\n          }\n        }\n        characterConnection {\n          characters {\n            id\n          }\n        }\n      }\n    }\n  }\n": types.FilmsCatalogDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CharactersPage($first: Int!, $after: String) {\n    allPeople(first: $first, after: $after) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      people {\n        ...CharacterSummary\n      }\n    }\n  }\n"): (typeof documents)["\n  query CharactersPage($first: Int!, $after: String) {\n    allPeople(first: $first, after: $after) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      people {\n        ...CharacterSummary\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CharactersIndex {\n    allPeople {\n      totalCount\n      people {\n        ...CharacterSummary\n      }\n    }\n  }\n"): (typeof documents)["\n  query CharactersIndex {\n    allPeople {\n      totalCount\n      people {\n        ...CharacterSummary\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CharacterSummary on Person {\n    id\n    name\n    gender\n    birthYear\n    species {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment CharacterSummary on Person {\n    id\n    name\n    gender\n    birthYear\n    species {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CharacterDetail($id: ID!) {\n    person(id: $id) {\n      id\n      name\n      birthYear\n      gender\n      height\n      mass\n      eyeColor\n      hairColor\n      skinColor\n      homeworld {\n        id\n        name\n      }\n      species {\n        id\n        name\n      }\n      filmConnection {\n        films {\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query CharacterDetail($id: ID!) {\n    person(id: $id) {\n      id\n      name\n      birthYear\n      gender\n      height\n      mass\n      eyeColor\n      hairColor\n      skinColor\n      homeworld {\n        id\n        name\n      }\n      species {\n        id\n        name\n      }\n      filmConnection {\n        films {\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FilmsCatalog {\n    allFilms {\n      films {\n        id\n        title\n        episodeID\n        director\n        releaseDate\n        planetConnection {\n          planets {\n            id\n            name\n          }\n        }\n        characterConnection {\n          characters {\n            id\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query FilmsCatalog {\n    allFilms {\n      films {\n        id\n        title\n        episodeID\n        director\n        releaseDate\n        planetConnection {\n          planets {\n            id\n            name\n          }\n        }\n        characterConnection {\n          characters {\n            id\n          }\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;