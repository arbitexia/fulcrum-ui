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
  PointElement,
  LineElement,
  ChartOptions,
  Filler,
  Tooltip,
  Legend,
  ChartData,
  LegendItem,
  ArcElement,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
ChartJS.register(
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

type PieChartProps = {
  chartData: ChartData<'pie'>;
};
const PieChart: FC<PieChartProps> = ({ chartData }) => {
  const chartRef = useRef(null);
  const chartOptions: ChartOptions<'pie'> = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <Box>
      <Pie
        width={540}
        height={540}
        data={chartData}
        options={chartOptions}
        ref={chartRef}
      />
    </Box>
  );
};

export default PieChart;
