/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */
import React, { FC, useState } from 'react';
import { Box, Typography } from '@mui/material';
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
import { UIFlexSpaceBox } from '@/components/UI';
import { riskScoreHover } from '@/_mock';
import { useTheme } from '@mui/system';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
type ReportsBarChartProps = {
  chartData: ChartData<'bar'>;
  isTitle?: boolean;
};

export const ReportsBarChart: FC<ReportsBarChartProps> = ({
  chartData,
  isTitle,
}) => {
  const [isHover, setHover] = useState<boolean>(false);
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: `1000px`,
        position: 'relative',
        [theme.breakpoints.up('xl')]: {
          width: '1200px',
        },
        [theme.breakpoints.up('lg')]: {
          width: '1017px',
        },
        [theme.breakpoints.up('md')]: {
          width: '800px',
        },
        [theme.breakpoints.up('sm')]: {
          width: '540px',
        },
      }}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Bar
        options={isTitle ? barChartWithTitleOptions : barChartNoTitleOptions}
        data={chartData}
      />
      {isHover && isTitle && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 84,
            background: 'rgb(217, 217,217)',
            padding: 2,
            width: '250px',
          }}
        >
          {riskScoreHover.map((obj, index) => (
            <UIFlexSpaceBox key={`riskScore ${index}`}>
              <Typography>{obj.name}</Typography>
              <Typography>{obj.score}</Typography>
            </UIFlexSpaceBox>
          ))}
        </Box>
      )}
    </Box>
  );
};
