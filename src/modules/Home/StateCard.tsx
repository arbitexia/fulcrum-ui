/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { Typography } from '@mui/material';
import { UIWhiteCard, UIFlexSpaceBox } from '@/components/UI';
import { StateCardProps } from '@/types';

export const HomeStateCard = ({ cardInfo }: StateCardProps): JSX.Element => {
  return (
    <UIWhiteCard
      spacing={1}
      sx={{
        flex: '1 1 0',
        minWidth: '192px',
        height: '86px',
      }}
    >
      <Typography variant="h6" color="text.secondary">
        {cardInfo.title}
      </Typography>
      <UIFlexSpaceBox sx={{ justifyContent: 'center' }}>
        <Typography align="center" variant="h4">
          {cardInfo.amount}
        </Typography>
      </UIFlexSpaceBox>
    </UIWhiteCard>
  );
};
