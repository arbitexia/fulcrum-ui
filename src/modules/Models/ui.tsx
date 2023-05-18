/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */

import { styled, TableCell } from '@mui/material';

export const StyledNoBorderCell = styled(TableCell)({
  fontSize: '14px',
  fontWeight: 700,
  lineHeight: '20px',
  borderBottom: 'none',
});

export const StyledBorderCell = styled(TableCell)({
  borderBottom: '1px solid #ECEFF1',
});
