import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retrying?: boolean;
}

export function ErrorState({
  title = 'No pudimos cargar la información',
  message = 'Revisa tu conexión o inténtalo de nuevo en unos segundos.',
  onRetry,
  retrying = false,
}: ErrorStateProps) {
  return (
    <Alert
      severity="error"
      variant="outlined"
      role="alert"
      action={
        onRetry ? (
          <Button
            color="inherit"
            size="small"
            startIcon={<RefreshIcon aria-hidden />}
            onClick={onRetry}
            disabled={retrying}
          >
            {retrying ? 'Reintentando…' : 'Reintentar'}
          </Button>
        ) : undefined
      }
    >
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  );
}
