/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { Paper, Stack } from '@mui/material';
import { DefaultChildProps } from '@/types';

export const UIWhiteCard = ({
  children,
  sx,
  spacing,
  elevation,
  ...rest
}: DefaultChildProps): JSX.Element => (
  <Stack
    component={Paper}
    elevation={elevation || 0}
    spacing={spacing || 3}
    sx={(theme) => ({
      position: 'relative',
      padding: theme.spacing(2, 3),
      borderRadius: '12px',
      ...sx,
    })}
    {...rest}
  >
    {children}
  </Stack>
);
