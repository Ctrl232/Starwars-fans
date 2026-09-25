'use client';
import { useState, type ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { makeApolloClient } from '@/lib/apollo/client';
import theme from '@/theme/theme';

export function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(makeApolloClient);

  return (
    <AppRouterCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
