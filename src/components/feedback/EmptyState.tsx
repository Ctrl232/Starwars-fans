import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SearchOffIcon from '@mui/icons-material/SearchOff';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Box
      role="status"
      sx={{
        textAlign: 'center',
        py: 8,
        px: 2,
        border: 1,
        borderColor: 'divider',
        borderStyle: 'dashed',
        borderRadius: 3,
      }}
    >
      <SearchOffIcon aria-hidden sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
      <Typography variant="h6" component="p" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography color="text.secondary" sx={{ mb: action ? 2 : 0 }}>
          {description}
        </Typography>
      )}
      {action}
    </Box>
  );
}
