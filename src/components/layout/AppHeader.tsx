'use client';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import NextLink from 'next/link';

export function AppHeader() {
  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(8px)', borderBottom: 1, borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2 }}>
          <Link
            component={NextLink}
            href="/"
            underline="none"
            aria-label="Star Wars Fans, ir al inicio"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Typography
              component="span"
              variant="h6"
              sx={{ fontWeight: 800, letterSpacing: '0.12em', color: 'primary.main' }}
            >
              STAR WARS
            </Typography>
            <Typography component="span" variant="h6" sx={{ color: 'text.primary', fontWeight: 400 }}>
              fans
            </Typography>
          </Link>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
