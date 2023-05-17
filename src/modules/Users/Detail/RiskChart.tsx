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
  selectedRisk: number;
  options: ApexOptions;
  series: ApexOptions['series'];
  type: string;
  optionsExpand: ApexOptions;
  seriesExpand: ApexOptions['series'];
}

const RiskChart = ({
  selectedRisk,
  options,
  series,
  optionsExpand,
  seriesExpand,
}: ChartOptions): JSX.Element => {
  if (selectedRisk === -1) {
    return <Chart options={options} series={series} type="area" />;
  }

  return <Chart options={optionsExpand} series={seriesExpand} type="area" />;
};

export default RiskChart;
