/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import React from 'react';
import { Typography } from '@mui/material';
import { UIContainer, UIFlexSpaceBox } from '@/components/UI';

const ReportsNavbar = (): JSX.Element => {
  return (
    <UIContainer disableGutters sx={{ padding: '24px 38px 0 38px' }}>
      <UIFlexSpaceBox sx={{ alignItems: 'flex-end' }}>
        <Typography variant="h4" sx={{ mr: 4 }}>
          Reports
        </Typography>
      </UIFlexSpaceBox>
    </UIContainer>
  );
};

export default ReportsNavbar;
