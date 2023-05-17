/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { createTheme, PaletteMode, Theme } from '@mui/material';

export const createAppTheme = (mode: PaletteMode): Theme =>
  createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1600,
      },
    },
    palette: {
      mode,
      text: {
        primary: '#283238',
        secondary: '#7C909B',
      },
    },
    typography: {
      fontFamily: `'Roboto Flex', sans-serif`,
      h1: {
        fontSize: '96px',
        fontWeight: 'bold',
      },
      h2: {
        fontSize: '48px',
        fontWeight: '400',
      },
      h3: {
        fontSize: '34px',
        fontWeight: '500',
      },
      h4: {
        fontSize: '24px',
        fontWeight: '400',
        lineHeight: '32px',
        letterSpacing: '0.2px',
      },
      h5: {
        fontSize: '18px',
        fontWeight: '400',
        lineHeight: '32px',
        letterSpacing: '0.15px',
      },
      h6: {
        fontSize: '14px',
        fontWeight: '400',
        lineHeight: '20px',
      },
    },
  });

export const isDarkTheme = (theme: Theme): boolean => {
  if (theme.palette.mode === 'light') return false;
  return true;
};
