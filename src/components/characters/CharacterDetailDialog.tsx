'use client';
import { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { skipToken, useQuery } from '@apollo/client/react';
import { CharacterDetailQuery, FilmsCatalogQuery } from '@/graphql/queries';
import { catalogFilms, getCharacterFilms } from '@/lib/characters';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { CharacterAvatar } from './CharacterAvatar';
import { CharacterDetailContent } from './CharacterDetailContent';
import { CharacterDetailSkeleton } from './CharacterDetailSkeleton';

interface CharacterDetailDialogProps {
  characterId: string | null;
  onClose: () => void;
}

const TITLE_ID = 'character-detail-title';

export function CharacterDetailDialog({ characterId, onClose }: CharacterDetailDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, loading, error, refetch } = useQuery(
    CharacterDetailQuery,
    characterId ? { variables: { id: characterId } } : skipToken,
  );

  // Catálogo de películas: normalmente ya está en caché (lo pidió el listado).
  const films = useQuery(FilmsCatalogQuery, characterId ? {} : skipToken);

  const character = data?.person ?? null;
  const characterFilms =
    characterId && character && films.data
      ? getCharacterFilms(characterId, character, catalogFilms(films.data))
      : null;

  const isLoading = loading || films.loading;
  const showSkeleton = isLoading && !(character && characterFilms);
  const failed = Boolean(error || films.error) && !(character && characterFilms);
  const characterName = character?.name;

  // Título de la pestaña con el personaje abierto (se restaura al cerrar).
  useEffect(() => {
    if (!characterId || !characterName) return;
    const previousTitle = document.title;
    document.title = `${characterName} · Star Wars Fans`;
    return () => {
      document.title = previousTitle;
    };
  }, [characterId, characterName]);

  return (
    <Dialog
      open={Boolean(characterId)}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      scroll="paper"
      aria-labelledby={TITLE_ID}
    >
      <DialogTitle id={TITLE_ID} component="div" sx={{ pr: 7 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          {showSkeleton && !character ? (
            <>
              <Skeleton variant="circular" width={56} height={56} />
              <Skeleton width={200} height={40} />
            </>
          ) : (
            <>
              <CharacterAvatar name={character?.name} size={56} />
              <Typography variant="h5" component="h2" sx={{ fontWeight: 800 }}>
                {character?.name ?? 'Detalle del personaje'}
              </Typography>
            </>
          )}
        </Stack>
        <IconButton
          aria-label="Cerrar detalle"
          onClick={onClose}
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers aria-busy={isLoading}>
        {showSkeleton && !failed && <CharacterDetailSkeleton />}
        {failed && (
          <ErrorState
            title="No pudimos cargar el personaje"
            onRetry={() => {
              if (error) void refetch();
              if (films.error) void films.refetch();
            }}
            retrying={isLoading}
          />
        )}
        {!loading && !error && data && !character && (
          <EmptyState
            title="Personaje no encontrado"
            description="El enlace puede estar incompleto o el personaje ya no existe en el API."
          />
        )}
        {character && characterFilms && <CharacterDetailContent character={character} films={characterFilms} />}
      </DialogContent>
    </Dialog>
  );
}
