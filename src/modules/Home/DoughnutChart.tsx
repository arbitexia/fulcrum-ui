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
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ScatterDataPoint,
  BubbleDataPoint,
} from 'chart.js';
import { doughnutChartOptions } from '@/_mock';

ChartJS.register(ArcElement, Tooltip, Legend);

const StyledText = styled(Typography)({
  position: 'absolute',
  textAlign: 'center',
  top: '50%',
  left: '52%',
  transform: 'translate(-50px, -50px)',
  fontSize: '24px',
  span: {
    fontSize: '14px',
  },
});

export const HomeDoughnutChart = ({
  triagedAmount,
  totalAmount,
}: {
  triagedAmount: number;
  totalAmount: number;
}): JSX.Element => {
  const totalRemaining =
    triagedAmount > totalAmount
      ? triagedAmount - totalAmount
      : totalAmount - triagedAmount;
  const total = triagedAmount > totalAmount ? triagedAmount : totalAmount;
  const amount = triagedAmount > totalAmount ? totalAmount : triagedAmount;
  const doughnutChartData: ChartData<
    'doughnut',
    (number | ScatterDataPoint | BubbleDataPoint | null)[]
  > = {
    labels: ['Triaged', 'New'],
    datasets: [
      {
        data: [amount, totalRemaining],
        backgroundColor: ['#38C628FF', '#d3d3d3'],
        hoverBackgroundColor: ['#38C628FF', '#d3d3d3'],
      },
    ],
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <StyledText variant="h5">
        {amount} <br />
        <Box component="span"> triaged out of</Box> <br /> {total}
      </StyledText>
      <Doughnut options={doughnutChartOptions} data={doughnutChartData} />
    </Box>
  );
};
