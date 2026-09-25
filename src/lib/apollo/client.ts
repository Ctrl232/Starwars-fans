import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { GRAPHQL_PROXY_PATH } from '@/lib/graphql/config';

interface PeopleConnectionLike {
  people?: ReadonlyArray<unknown> | null;
}

export function createCache() {
  return new InMemoryCache({
    typePolicies: {
      Root: {
        queryType: true,
        fields: {
          allPeople: {
            keyArgs: (args) => (typeof args?.first === 'number' ? 'paged' : 'all'),
            merge(existing: PeopleConnectionLike | undefined, incoming: PeopleConnectionLike, { args }) {
              if (!existing || !args?.after) return incoming;
              return {
                ...incoming,
                people: [...(existing.people ?? []), ...(incoming.people ?? [])],
              };
            },
          },
        },
      },
    },
  });
}

export function makeApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri:
        typeof window === 'undefined'
          ? `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}${GRAPHQL_PROXY_PATH}`
          : GRAPHQL_PROXY_PATH,
    }),
    cache: createCache(),
  });
}
