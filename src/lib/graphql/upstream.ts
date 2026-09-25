import { GRAPHQL_ENDPOINTS, UPSTREAM_TIMEOUT_MS } from './config';

export interface GraphQLRequestBody {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
}

export interface GraphQLResponse<TData> {
  data?: TData | null;
  errors?: ReadonlyArray<{ message: string }>;
}

export class UpstreamError extends Error {
  constructor(
    message: string,
    readonly attempts: ReadonlyArray<{ endpoint: string; reason: string }>,
  ) {
    super(message);
    this.name = 'UpstreamError';
  }
}

type FetchInit = RequestInit & { next?: { revalidate?: number | false } };

/**
 * Envía la operación al API real. Recorre los endpoints en orden y devuelve
 * la primera respuesta válida (HTTP 2xx con JSON). Cada intento tiene timeout,
 * así una caída del endpoint principal no deja la UI colgada.
 */
export async function postToUpstream<TData>(
  body: GraphQLRequestBody,
  init: FetchInit = {},
  endpoints: readonly string[] = GRAPHQL_ENDPOINTS,
): Promise<GraphQLResponse<TData>> {
  const attempts: Array<{ endpoint: string; reason: string }> = [];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        ...init,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      });

      if (!res.ok) {
        attempts.push({ endpoint, reason: `HTTP ${res.status}` });
        continue;
      }

      return (await res.json()) as GraphQLResponse<TData>;
    } catch (error) {
      attempts.push({
        endpoint,
        reason: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  throw new UpstreamError('Ningún endpoint de GraphQL respondió', attempts);
}
