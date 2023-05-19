/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */
import React, { FC } from 'react';
import { Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { barChartNoTitleOptions, barChartWithTitleOptions } from '@/constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
ChartJS.defaults.datasets.bar.maxBarThickness = 20;

type ReportsBarChartProps = {
  chartData: ChartData<'bar'>;
  isTitle?: boolean;
};

export const ReportsBarChart: FC<ReportsBarChartProps> = ({
  chartData,
  isTitle,
}) => {
  return (
    <Box width={1000}>
      <Bar
        options={isTitle ? barChartWithTitleOptions : barChartNoTitleOptions}
        data={chartData}
        width={1000}
        height={600}
      />
    </Box>
  );
};
