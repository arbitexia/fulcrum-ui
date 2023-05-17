/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { Typography, ListItem, styled } from '@mui/material';
import { UIWhiteCard, UIList } from '@/components/UI';

export const StyledListItem = styled(ListItem)({
  padding: '2.5px 20px',
});

const HomeRiskIndicator = (): JSX.Element => {
  return (
    <UIWhiteCard sx={{ height: '50%' }}>
      <Typography variant="h6" color="text.secondary">
        Top 5 Risk Indicators per percent of the population
      </Typography>
      <UIList sx={{ fontSize: '13px', lineHeight: '16px' }}>
        <StyledListItem>1. Flight Risk - 4%</StyledListItem>
        <StyledListItem>2. Financial Stressors - 2% </StyledListItem>
        <StyledListItem>3. Badge Access out of Normal time - 2%</StyledListItem>
        <StyledListItem>
          4. E-mails sent to Personal Account - 2%
        </StyledListItem>
        <StyledListItem>5. Access to Critical Facilities - 1%</StyledListItem>
      </UIList>
    </UIWhiteCard>
  );
};

export default HomeRiskIndicator;
