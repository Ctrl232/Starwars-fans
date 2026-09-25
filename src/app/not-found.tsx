import Container from '@mui/material/Container';
import { EmptyState } from '@/components/feedback/EmptyState';
import { BackHomeButton } from '@/components/feedback/BackHomeButton';

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <EmptyState
        title="Esta no es la página que buscas"
        description="La ruta no existe en esta galaxia."
        action={<BackHomeButton />}
      />
    </Container>
  );
}
