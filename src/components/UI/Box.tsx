/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { styled, Box } from '@mui/material';

export const UIFlexWrapBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

export const UIFlexSpaceBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const UIFlexCenterBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const UIFlexColumnBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexFlow: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const UILayoutMain = styled('main')({
  minHeight: '100vh',
  width: `calc(100% - 96px)`,
  marginLeft: `96px`,
  overflowY: 'auto',
  backgroundColor: '#ECEFF1',
});
