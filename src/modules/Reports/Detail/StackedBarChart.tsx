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
  LineElement,
  ChartOptions,
  Filler,
  Tooltip,
  Legend,
  ChartData,
  LegendItem,
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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          textAlign: 'center',
          boxWidth: 8,
          boxHeight: 8,
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            const legendItem: LegendItem[] = datasets.map((data, i) => ({
              text: data?.label ?? '',
              fillStyle: data.borderColor as string,
              strokeStyle: data.borderColor as string,
              datasetIndex: i,
            }));

            return legendItem;
          },
        },
      },
    },
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Bar Chart - Stacked',
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <Box>
      <Bar
        width={540}
        height={540}
        data={chartData}
        options={chartOptions}
        ref={chartRef}
      />
    </Box>
  );
};

export default StackedBarChart;
