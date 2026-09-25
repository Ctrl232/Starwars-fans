export const GRAPHQL_ENDPOINTS: readonly string[] = [
  process.env.SWAPI_GRAPHQL_URL || 'https://swapi-graphql.netlify.app/graphql',
  process.env.SWAPI_GRAPHQL_FALLBACK_URL || 'https://swapi.loquenecesito.co/graphql',
].filter(Boolean);

export const GRAPHQL_PROXY_PATH = '/api/graphql';

export const UPSTREAM_TIMEOUT_MS = 8000;
