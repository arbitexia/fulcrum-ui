/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { Typography } from '@mui/material';
import Image from 'next/image';
import { UIWhiteCard, UIFlexSpaceBox } from '@/components/UI';
import { StateCardProps } from '@/types';
import { appImageLoader } from '@/libs/image-loader';

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
      <UIFlexSpaceBox>
        <Typography variant="h4">{cardInfo.amount}</Typography>
        {cardInfo.icon ? (
          <UIFlexSpaceBox>
            <Image
              src={cardInfo.icon}
              loader={appImageLoader}
              width={8}
              height={8}
              alt="up"
            />
            <Typography variant="h5" color="text.secondary">
              {cardInfo.info}
            </Typography>
          </UIFlexSpaceBox>
        ) : (
          <Typography variant="h6">{cardInfo.info}</Typography>
        )}
      </UIFlexSpaceBox>
    </UIWhiteCard>
  );
};
