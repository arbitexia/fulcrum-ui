/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */

import { styled, Box, Checkbox, CheckboxProps } from '@mui/material';

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

export const UIFlexEndBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  flexWrap: 'wrap',
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
  width: `100vw`,
  marginLeft: `30px`,
  overflowY: 'auto',
  backgroundColor: '#ECEFF1',
});

export const UIScorebox = styled(Box)(() => ({
  paddingLeft: '1rem',
}));

interface UICheckboxProps extends CheckboxProps {
  textColor?: string;
}

export const UICheckbox = styled(Checkbox, {
  shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'textColor',
})<UICheckboxProps>(({ checked, color }) => ({
  color: checked ? 'green' : color,
  '& svg': {
    fontSize: '30px',
  },
}));
