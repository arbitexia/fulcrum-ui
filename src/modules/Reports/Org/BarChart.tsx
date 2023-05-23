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
  return (
    <Box
      sx={{ width: `1000px`, position: 'relative' }}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Bar
        options={isTitle ? barChartWithTitleOptions : barChartNoTitleOptions}
        data={chartData}
        width={1000}
        height={600}
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
