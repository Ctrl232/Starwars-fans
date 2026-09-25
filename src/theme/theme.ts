'use client';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
    primary: { main: '#FFE81F', contrastText: '#0B0D17' },
    secondary: { main: '#4FC3F7' },
    background: { default: '#0B0D17', paper: '#141726' },
    divider: 'rgba(255, 232, 31, 0.12)',
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '0.04em' },
    h2: { fontWeight: 700 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(255, 255, 255, 0.06)',
          transition: 'transform 150ms ease, border-color 150ms ease',
          '&:hover, &:focus-within': {
            transform: 'translateY(-2px)',
            borderColor: 'rgba(255, 232, 31, 0.4)',
          },
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
            '&:hover, &:focus-within': { transform: 'none' },
          },
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': { outline: '2px solid #4FC3F7', outlineOffset: 2 },
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
