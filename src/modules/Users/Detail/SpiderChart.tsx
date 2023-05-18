/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { FC, useRef } from 'react';
import { Box } from '@mui/material';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  ChartOptions,
  Filler,
  Tooltip,
  Legend,
  ChartData,
  LegendItem,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);
type SpiderChartProps = {
  chartData: ChartData<'radar'>;
};
const SpiderChart: FC<SpiderChartProps> = ({ chartData }) => {
  const chartRef = useRef(null);
  const chartOptions: ChartOptions<'radar'> = {
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

  return (
    <Box>
      <Radar
        width={540}
        height={540}
        data={chartData}
        options={chartOptions}
        ref={chartRef}
      />
    </Box>
  );
};

export default SpiderChart;
