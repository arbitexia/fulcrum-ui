/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import { Paper, TableCell, TextField, styled } from '@mui/material';

export const TableBorderCell = styled(TableCell)({
  borderBottom: '1px solid #ECEFF1',
  fontSize: '14px',
});

export const NotificationItem = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
  boxShadow: 'none',
}));

export const NotificationTextField = styled(TextField)({
  width: '250px',
  background: '#FFFFFF',
  justifyContent: 'center',
  input: {
    padding: '0 8px',
    height: '32px',
    fontWeight: '400',
    fontSize: '13px',
    lineHeight: '20px',
    color: '#0050BE',
    '&::placeholder': {
      opacity: 1,
    },
    overflowX: 'clip',
    overflowY: 'clip',
  },
});
