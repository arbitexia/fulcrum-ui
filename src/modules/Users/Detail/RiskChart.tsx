/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartOptions {
  options: ApexOptions;
  series: ApexOptions['series'];
}

const RiskChart = ({ options, series }: ChartOptions): JSX.Element => {
  return (
    <Chart
      options={options}
      series={series}
      type="area"
      sx={{
        padding: '2rem',
        paddingLeft: '2.7rem',
        '&.apexcharts-svg': { overflow: 'visible' },
      }}
    />
  );
};

export default RiskChart;
