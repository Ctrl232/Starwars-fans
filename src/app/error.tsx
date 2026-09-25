'use client';
import Container from '@mui/material/Container';
import { ErrorState } from '@/components/feedback/ErrorState';

/** Error boundary de la ruta: cualquier error inesperado muestra un estado recuperable. */
export default function RouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <ErrorState title="Algo salió mal" message="Ocurrió un error inesperado." onRetry={reset} />
    </Container>
  );
}
