/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { Box } from '@mui/material';

type UITabPanelProps = {
  children?: React.ReactNode | React.ReactNode[];
  dir?: string;
  index: number;
  value: number;
};

export const UITabPanel = ({
  children,
  value,
  index,
  ...rest
}: UITabPanelProps): JSX.Element => (
  <Box component="div" role="tabpanel" hidden={value !== index} {...rest}>
    {value === index && <Box sx={{ padding: '20px 0px' }}>{children}</Box>}
  </Box>
);
