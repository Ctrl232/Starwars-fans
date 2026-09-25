import Grid from '@mui/material/Grid';
import type { CharacterSummaryFragment } from '@/gql/graphql';
import { CharacterCard } from './CharacterCard';
import { CharacterCardSkeleton } from './CharacterCardSkeleton';

interface CharacterGridProps {
  characters: ReadonlyArray<CharacterSummaryFragment>;
  onSelect: (id: string) => void;
  onPrefetch?: (id: string) => void;
  filmCounts?: ReadonlyMap<string, number>;
  skeletons?: number;
}

const GRID_SIZE = { xs: 12, sm: 6, md: 4, lg: 3 } as const;

export function CharacterGrid({ characters, onSelect, onPrefetch, filmCounts, skeletons = 0 }: CharacterGridProps) {
  return (
    <Grid container spacing={2} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
      {characters.map((character) => (
        <Grid key={character.id} size={GRID_SIZE} component="li">
          <CharacterCard
            character={character}
            onSelect={onSelect}
            onPrefetch={onPrefetch}
            filmCount={filmCounts ? (filmCounts.get(character.id) ?? 0) : undefined}
          />
        </Grid>
      ))}
      {Array.from({ length: skeletons }, (_, index) => (
        <Grid key={`skeleton-${index}`} size={GRID_SIZE} component="li" aria-hidden>
          <CharacterCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}
