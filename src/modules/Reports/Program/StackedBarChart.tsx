/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */
import { FC, useRef } from 'react';
import { Box } from '@mui/material';
import {
  Chart as ChartJS,
  BarElement,
  PointElement,
  ChartOptions,
  Filler,
  Tooltip,
  Legend,
  ChartData,
  CategoryScale,
  LinearScale,
  Title,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  PointElement,
  Title,
  Filler,
  Tooltip,
  Legend
);

type StackedBarChartProps = {
  chartData: ChartData<'bar'>;
};
const StackedBarChart: FC<StackedBarChartProps> = ({ chartData }) => {
  const chartRef = useRef(null);
  const chartOptions: ChartOptions<'bar'> = {
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        title: {
          display: false,
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Persons of Concern',
          font: { size: 22, weight: '700' },
        },
      },
    },
  };

  return (
    <Bar
      width={670}
      height={420}
      data={chartData}
      options={chartOptions}
      ref={chartRef}
    />
  );
};

export default StackedBarChart;
