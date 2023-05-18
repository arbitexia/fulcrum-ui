/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */

import { Box, List, ListItem, ListItemButton, styled } from '@mui/material';

export const StyledJustificationBox = styled(Box)({
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '18px',
  color: '#7C909B',
});

export const StyledJustificationList = styled(List)({
  width: '250px',
  height: '150px',
  border: '1px solid #CCCCCC',
  borderRadius: '6px',
  marginBottom: '15px',
  overflow: 'auto',
});

export const StyledListItem = styled(ListItem)({
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '20px',
  color: '#0050BE',
  paddingTop: 0,
  paddingBottom: 0,
});

export const StyledListItemButton = styled(ListItemButton)({
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '20px',
  color: '#0050BE',
  paddingTop: 0,
  paddingBottom: 0,
});
