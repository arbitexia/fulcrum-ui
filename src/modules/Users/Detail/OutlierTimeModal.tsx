/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ScatterDataPoint,
  BubbleDataPoint,
  TooltipItem,
  ChartOptions,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { Typography, Box } from '@mui/material';
import { UIDefaultDialog } from '@/components/UI';
import { useAppSelector } from '@/hooks';
import { getOutlierChartData } from '@/redux/slices';
import { OutlierModalProps } from '@/types/graph.type';
import { formatDate } from '@/libs/time-utils';
import { getFrameStart } from '@/redux/slices/entity.slice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const OutlierTimeModal = ({
  open,
  onClose,
  entityId,
  categoryIndex,
  attributeIndex,
  attributeName,
}: OutlierModalProps): JSX.Element => {
  const frameStart: number = useAppSelector(
    getFrameStart(entityId, categoryIndex, attributeIndex)
  );
  const outlierData: ChartData<
    'scatter',
    (number | ScatterDataPoint | BubbleDataPoint | null)[]
  > =
    useAppSelector(
      getOutlierChartData(entityId, categoryIndex, attributeIndex)
    ) || null;

  const chartRef = useRef(null);
  const options: ChartOptions<'scatter'> = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: true,
        },
        ticks: {
          callback: (tickValue) => {
            const tickValueNumber =
              typeof tickValue === 'string' ? parseInt(tickValue) : tickValue;
            const weekTimeEpoch = frameStart + tickValueNumber;
            const weekTime = new Date(weekTimeEpoch);
            return formatDate(weekTime, 'en-US', {
              weekday: 'short',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            });
          },
        },
      },
      y: {
        grid: {
          display: true,
        },
        ticks: {
          callback: (tickValue) => {
            const weekDate = new Date(tickValue);
            return formatDate(weekDate);
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'scatter'>) => {
            const { x, y } = tooltipItem.parsed;
            const dateTimeEpoch: number = x + y;
            const labelDate = new Date(dateTimeEpoch);
            return formatDate(labelDate, 'en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            });
          },
        },
      },
    },
  };
  return (
    <UIDefaultDialog
      open={open}
      onClose={onClose}
      title={`Outlier time - Number of ${attributeName}`}
      modalWidth="1200px"
    >
      <Typography fontSize={14}>
        <b>Peer Group</b> - Business Area - San Jose
      </Typography>
      <Box sx={{ padding: '16px 60px' }}>
        <Scatter options={options} data={outlierData} ref={chartRef} />
      </Box>
    </UIDefaultDialog>
  );
};
