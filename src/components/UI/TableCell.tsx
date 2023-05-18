/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import { TableCell, styled } from '@mui/material';

export const UIBorderCell = styled(TableCell)({
  borderBottom: '1px solid #ECEFF1',
  fontSize: '14px',
});

export const UINoBorderCell = styled(TableCell)({
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '20px',
  borderBottom: 'none',
});
