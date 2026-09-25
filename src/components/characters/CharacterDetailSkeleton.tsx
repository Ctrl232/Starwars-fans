import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

export function CharacterDetailSkeleton() {
  return (
    <Stack spacing={3} aria-hidden>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
        {Array.from({ length: 9 }, (_, i) => (
          <Box key={i}>
            <Skeleton width="50%" />
            <Skeleton width="80%" height={28} />
          </Box>
        ))}
      </Box>
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} variant="rounded" height={120} />
      ))}
    </Stack>
  );
}
