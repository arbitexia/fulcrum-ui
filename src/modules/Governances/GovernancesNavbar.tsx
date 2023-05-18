/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */

import React from 'react';
import { Typography } from '@mui/material';
import { UIContainer, UIFlexSpaceBox } from '@/components/UI';

const GovernancesNavbar = (): JSX.Element => {
  return (
    <UIContainer disableGutters sx={{ padding: '8px 8px 8px 0px' }}>
      <UIFlexSpaceBox sx={{ alignItems: 'flex-end' }}>
        <Typography variant="h4" sx={{ mr: 4 }}>
          Governance
        </Typography>
      </UIFlexSpaceBox>
    </UIContainer>
  );
};

export default GovernancesNavbar;
