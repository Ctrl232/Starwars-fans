import { afterEach, describe, expect, it, vi } from 'vitest';
import { postToUpstream, UpstreamError } from './upstream';

const body = { query: '{ allPeople { totalCount } }' };
const endpoints = ['https://primary.test/graphql', 'https://fallback.test/graphql'];

describe('postToUpstream', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('usa el endpoint alterno si el principal falla', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('down', { status: 503 }))
      .mockResolvedValueOnce(Response.json({ data: { allPeople: { totalCount: 82 } } }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await postToUpstream(body, {}, endpoints);

    expect(result.data).toEqual({ allPeople: { totalCount: 82 } });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toBe('https://fallback.test/graphql');
  });

  it('lanza UpstreamError con el detalle de cada intento si todos fallan', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));

    await expect(postToUpstream(body, {}, endpoints)).rejects.toBeInstanceOf(UpstreamError);
  });
});
