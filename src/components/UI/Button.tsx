/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { styled, Button } from '@mui/material';

export const UIModalButton = styled(Button)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '8px 30px',
  backgroundColor: '#ECEFF1',
  letterSpacing: '0.25px',
  border: '1px solid #D0D8DC',
  borderRadius: '6px',
  minWidth: '101px',
  height: '36px',
  color: '#485A63',
  textTransform: 'capitalize',
  p: {
    fontWeight: 700,
    fontSize: '13px',
    color: '#485A63 !important',
  },
});

export const UIDefaultButton = styled(Button)({
  backgroundColor: '#FFFFFF',
  letterSpacing: '0.25px',
  borderRadius: '6px',
  minWidth: '94px',
  height: '36px',
  color: '#2E2C34',
  fontWeight: 400,
  fontSize: '13px',
  textTransform: 'none',
});
