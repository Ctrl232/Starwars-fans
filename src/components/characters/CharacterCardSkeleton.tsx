import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export function CharacterCardSkeleton() {
  return (
    <Card aria-hidden sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
          <Skeleton variant="circular" width={48} height={48} />
          <Skeleton variant="text" width="60%" height={32} />
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="rounded" width={120} height={24} />
        </Stack>
        <Skeleton variant="rounded" height={36} />
      </CardContent>
    </Card>
  );
}
