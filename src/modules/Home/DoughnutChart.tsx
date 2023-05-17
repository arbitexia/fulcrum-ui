/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { Box, styled, Typography } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { doughnutChartData, doughnutChartOptions } from '@/_mock';

ChartJS.register(ArcElement, Tooltip, Legend);

const StyledText = styled(Typography)({
  position: 'absolute',
  textAlign: 'center',
  top: '50%',
  left: '58%',
  transform: 'translate(-50px, -50px)',
  fontSize: '24px',
  span: {
    fontSize: '14px',
  },
});

export const HomeDoughnutChart = (): JSX.Element => {
  return (
    <Box sx={{ position: 'relative' }}>
      <StyledText variant="h5">
        35 <br />
        <Box component="span"> new out of</Box> <br /> 312
      </StyledText>
      <Doughnut options={doughnutChartOptions} data={doughnutChartData} />
    </Box>
  );
};
