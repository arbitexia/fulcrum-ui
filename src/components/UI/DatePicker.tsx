/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { DatePicker } from '@mui/x-date-pickers';
import { styled } from '@mui/material';

export const UIDefaultDatePicker = styled(DatePicker)({
  width: '250px',
  height: '36px',
  background: '#FFFFFF',
  border: '1px solid #D0D8DC',
  borderRadius: '6px',
  justifyContent: 'center',
  input: {
    fontWeight: '400',
    fontSize: '13px',
    lineHeight: '20px',
    color: '#0050BE',
    overflowX: 'clip',
    overflowY: 'clip',
  },
  borderBottom: '1px solid #D0D8DC',
  '& .MuiInputAdornment-root': { marginLeft: '5px' },
  '&:hover': { borderBottom: '1px solid #D0D8DC' },
  div: { '::before, ::after': { borderBottom: 'none !important' } },
  overflowX: 'scroll',
  overflowY: 'hidden',
});
