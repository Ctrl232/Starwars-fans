import type { CodegenConfig } from '@graphql-codegen/cli';

/**
 * Genera los tipos TypeScript a partir del schema real del API.
 * - `src/gql/`: función `graphql()` tipada (TypedDocumentNode) + tipos de cada query.
 * - `schema.graphql`: copia del schema para revisar el contrato sin salir del repo.
 *
 * Se puede apuntar a otro endpoint con la variable GRAPHQL_SCHEMA.
 */
const config: CodegenConfig = {
  schema: process.env.GRAPHQL_SCHEMA ?? 'https://swapi-graphql.netlify.app/graphql',
  documents: ['src/**/*.{ts,tsx}', '!src/gql/**/*'],
  ignoreNoDocuments: true,
  generates: {
    'src/gql/': {
      preset: 'client',
      presetConfig: { fragmentMasking: false },
      config: { useTypeImports: true, enumsAsTypes: true },
    },
    'schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
};

export default config;
