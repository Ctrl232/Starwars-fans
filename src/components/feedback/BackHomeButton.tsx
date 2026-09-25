'use client';
import Button from '@mui/material/Button';
import NextLink from 'next/link';

export function BackHomeButton() {
  return (
    <Button component={NextLink} href="/" variant="contained">
      Volver al inicio
    </Button>
  );
}
