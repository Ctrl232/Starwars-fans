'use client';
import { useCallback, useMemo, useState } from 'react';
import { NetworkStatus } from '@apollo/client';
import { useApolloClient, useQuery } from '@apollo/client/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { CharacterDetailQuery as CharacterDetailResult, FilmsCatalogQuery as FilmsCatalogResult } from '@/gql/graphql';
import { CharacterDetailQuery, CharactersPageQuery, FilmsCatalogQuery } from '@/graphql/queries';
import { catalogFilms, countFilmsByCharacter } from '@/lib/characters';
import { useCharacterRoute } from '@/hooks/useCharacterRoute';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { compact } from '@/lib/utils';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { CharacterGrid } from './CharacterGrid';
import { CharacterDetailDialog } from './CharacterDetailDialog';

export const PAGE_SIZE = 12;

interface CharacterExplorerProps {
  initialCharacter?: { id: string; data: CharacterDetailResult } | null;
  initialFilms?: FilmsCatalogResult | null;
}

export function CharacterExplorer({ initialCharacter, initialFilms }: CharacterExplorerProps) {
  const client = useApolloClient();

  // Hidrata la caché con el detalle renderizado en el servidor: el modal
  // abre con datos inmediatamente y Apollo no repite la petición.
  useState(() => {
    if (initialCharacter?.data.person) {
      client.writeQuery({
        query: CharacterDetailQuery,
        variables: { id: initialCharacter.id },
        data: initialCharacter.data,
      });
    }
    if (initialFilms?.allFilms) {
      client.writeQuery({ query: FilmsCatalogQuery, data: initialFilms });
    }
    return null;
  });

  const { selectedId, open, close } = useCharacterRoute();

  // ── Listado paginado ────────────────────────────────────────────────
  const {
    data: pageData,
    error: pageError,
    loading: pageLoading,
    networkStatus,
    fetchMore,
    refetch,
  } = useQuery(CharactersPageQuery, { variables: { first: PAGE_SIZE } });

  const people = compact(pageData?.allPeople?.people);
  const totalCount = pageData?.allPeople?.totalCount ?? null;
  const pageInfo = pageData?.allPeople?.pageInfo;
  const isFetchingMore = networkStatus === NetworkStatus.fetchMore;
  const [loadMoreError, setLoadMoreError] = useState(false);

  const loadMore = useCallback(async () => {
    if (!pageInfo?.hasNextPage || isFetchingMore) return;
    setLoadMoreError(false);
    try {
      await fetchMore({ variables: { after: pageInfo.endCursor } });
    } catch {
      setLoadMoreError(true);
    }
  }, [fetchMore, isFetchingMore, pageInfo]);

  const canAutoLoad = Boolean(pageInfo?.hasNextPage) && !isFetchingMore && !loadMoreError;
  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    enabled: canAutoLoad,
    onLoadMore: () => void loadMore(),
  });

  // ── Catálogo de películas (conteo por tarjeta y detalle) ──────────
  const { data: filmsData } = useQuery(FilmsCatalogQuery);
  const filmCounts = useMemo(
    () => (filmsData ? countFilmsByCharacter(catalogFilms(filmsData)) : undefined),
    [filmsData],
  );

  const prefetchCharacter = useCallback(
    (id: string) => {
      void client.query({ query: CharacterDetailQuery, variables: { id } }).catch(() => undefined);
    },
    [client],
  );

  // ── Render ─────────────────────────────────────────────────────────
  const renderList = () => {
    if (pageError && people.length === 0) {
      return <ErrorState onRetry={() => void refetch()} retrying={pageLoading} />;
    }
    if (pageLoading && people.length === 0) {
      return <CharacterGrid characters={[]} onSelect={open} skeletons={PAGE_SIZE} />;
    }
    if (people.length === 0) {
      return <EmptyState title="No hay personajes disponibles" description="El API no devolvió resultados." />;
    }

    return (
      <>
        <CharacterGrid
          characters={people}
          onSelect={open}
          onPrefetch={prefetchCharacter}
          filmCounts={filmCounts}
          skeletons={isFetchingMore ? 4 : 0}
        />
        <Box ref={sentinelRef} sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          {loadMoreError ? (
            <ErrorState
              title="No pudimos cargar más personajes"
              onRetry={() => void loadMore()}
              retrying={isFetchingMore}
            />
          ) : pageInfo?.hasNextPage ? (
            // Botón de respaldo: accesible con teclado y útil si el observer no dispara.
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => void loadMore()}
              disabled={isFetchingMore}
              startIcon={isFetchingMore ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {isFetchingMore ? 'Cargando…' : 'Cargar más personajes'}
            </Button>
          ) : (
            <Typography color="text.secondary">
              Viste los {people.length} personajes. Que la Fuerza te acompañe.
            </Typography>
          )}
        </Box>
      </>
    );
  };

  const statusText =
    totalCount !== null ? `Mostrando ${people.length} de ${totalCount} personajes` : '';

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1">
          Personajes de <Box component="span" sx={{ color: 'primary.main' }}>Star Wars</Box>
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 640 }}>
          Explora a los habitantes de la galaxia, las películas en las que aparecen, quién las dirigió y
          los planetas que visitaron.
        </Typography>
      </Stack>

      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" aria-live="polite" sx={{ minHeight: 20 }}>
          {statusText}
        </Typography>
      </Stack>

      <Box id="characters-results">{renderList()}</Box>

      <CharacterDetailDialog characterId={selectedId} onClose={close} />
    </Container>
  );
}
