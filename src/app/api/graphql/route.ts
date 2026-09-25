import { NextResponse, type NextRequest } from 'next/server';
import { postToUpstream, UpstreamError, type GraphQLRequestBody } from '@/lib/graphql/upstream';

/** Límite de tamaño del body: las queries de la app pesan < 2 KB. */
const MAX_BODY_BYTES = 10_000;

function isGraphQLRequestBody(value: unknown): value is GraphQLRequestBody {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.query === 'string' &&
    (candidate.variables === undefined ||
      (typeof candidate.variables === 'object' && candidate.variables !== null))
  );
}

/**
 * Proxy (BFF) hacia el API de SWAPI.
 * - El navegador solo habla con nuestro dominio: se evita CORS y se puede
 *   restringir `connect-src 'self'` en la CSP.
 * - Valida el body antes de reenviarlo y aplica fallback al endpoint alterno.
 * - Solo lectura: se rechazan mutations/subscriptions.
 */
export async function POST(request: NextRequest) {
  const raw = await request.text();

  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ errors: [{ message: 'Payload demasiado grande' }] }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ errors: [{ message: 'JSON inválido' }] }, { status: 400 });
  }

  if (!isGraphQLRequestBody(body)) {
    return NextResponse.json({ errors: [{ message: 'Body GraphQL inválido' }] }, { status: 400 });
  }

  if (/^\s*(mutation|subscription)\b/i.test(body.query)) {
    return NextResponse.json({ errors: [{ message: 'Operación no permitida' }] }, { status: 405 });
  }

  try {
    const result = await postToUpstream(body, { next: { revalidate: 3600 } });
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  } catch (error) {
    if (error instanceof UpstreamError) {
      console.error('[graphql-proxy]', error.message, error.attempts);
    }
    return NextResponse.json(
      { errors: [{ message: 'El servicio de Star Wars no está disponible. Intenta de nuevo.' }] },
      { status: 502 },
    );
  }
}
