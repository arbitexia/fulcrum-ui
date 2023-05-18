/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { Typography, styled } from '@mui/material';
import { UIWhiteCard } from '@/components/UI';
import { useAppSelector } from '@/hooks';
import { getTopRiskIndicatorsByModelId } from '@/redux/slices/stat.slice';
import { getNumberTopRiskIndicators } from '@/redux/slices/config.slice';
import { roundScore } from '@/libs/math-utils';

export const StyledListItem = styled('li')({
  padding: '2.5px 20px',
});

const HomeRiskIndicator = ({ modelId }: { modelId: string }): JSX.Element => {
  const numberTopRiskIndicators = useAppSelector(getNumberTopRiskIndicators);
  const topRiskIndicatorsByModelId = useAppSelector(
    getTopRiskIndicatorsByModelId(modelId)
  );
  return (
    <UIWhiteCard sx={{ height: '50%' }}>
      <Typography variant="h6" color="text.secondary">
        Top {numberTopRiskIndicators} Risk Indicators per percent of the
        population
      </Typography>
      <ol style={{ fontSize: '15px', lineHeight: '18px' }}>
        {topRiskIndicatorsByModelId &&
          topRiskIndicatorsByModelId.map(({ attribute, percentage }, index) => (
            <StyledListItem key={index}>
              {attribute} - {roundScore(percentage, 100, 2)}%
            </StyledListItem>
          ))}
      </ol>
    </UIWhiteCard>
  );
};

export default HomeRiskIndicator;
