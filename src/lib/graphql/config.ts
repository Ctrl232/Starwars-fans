/**
 * Endpoints del API. Se leen de variables de entorno (ver .env.example) con
 * valores por defecto, así el proyecto corre sin configuración adicional.
 * El segundo endpoint es el alterno indicado en la prueba: si el principal
 * falla, el proxy reintenta automáticamente contra él.
 */
export const GRAPHQL_ENDPOINTS: readonly string[] = [
  process.env.SWAPI_GRAPHQL_URL ?? 'https://swapi-graphql.netlify.app/graphql',
  process.env.SWAPI_GRAPHQL_FALLBACK_URL ?? 'https://swapi.loquenecesito.co/graphql',
].filter(Boolean);

/** Ruta interna que usa el navegador (mismo origen → sin CORS). */
export const GRAPHQL_PROXY_PATH = '/api/graphql';

export const UPSTREAM_TIMEOUT_MS = 8000;
