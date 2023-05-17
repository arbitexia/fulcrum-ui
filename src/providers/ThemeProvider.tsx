/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { ReactElement, ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useAppSelector } from '@/hooks';
import { appSelector } from '@/redux/slices';
import { createAppTheme } from '@/theme';

interface AppThemeProviderProps {
  children: ReactNode | ReactNode[];
}

const AppThemeProvider = ({
  children,
}: AppThemeProviderProps): ReactElement => {
  const { theme } = useAppSelector(appSelector);

  return (
    <ThemeProvider theme={createAppTheme(theme.mode)}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
