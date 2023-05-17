/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import RiskChart from './RiskChart';
import { ApexOptions } from 'apexcharts';

interface RiskChartViewProps {
  selectedRisk: number;
}

export const RiskChartView = ({
  selectedRisk,
}: RiskChartViewProps): JSX.Element => {
  const options: ApexOptions = {
    chart: {
      id: 'basic-bar',
      toolbar: {
        show: false,
      },
      stacked: true,
    },
    xaxis: {
      categories: [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
        'JAN',
      ],
    },
    yaxis: {
      min: 0,
      tickAmount: 9,
      opposite: true,
    },
    stroke: {
      curve: 'straight',
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      show: true,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
  };

  const series = [
    {
      name: 'series-1',
      data: [6, 6, 6, 6, 6, 6, 6, 8, 8, 10, 10, 10, 12],
    },
    {
      name: 'series-2',
      data: [6, 6, 6, 6, 6, 6, 6, 8, 8, 10, 10, 10, 12],
    },
    {
      name: 'series-3',
      data: [6, 6, 6, 6, 6, 6, 6, 8, 8, 10, 10, 10, 12],
    },
  ];

  const optionsExpand: ApexOptions = {
    chart: {
      id: 'basic-bar',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
        'JAN',
      ],
    },
    yaxis: {
      min: 0,
      tickAmount: 9,
      opposite: true,
    },
    stroke: {
      curve: 'straight',
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      show: true,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
  };

  const seriesExpand = [
    {
      name: 'series-1',
      data: [6, 6, 6, 6, 6, 6, 6, 8, 8, 10, 10, 10, 12],
    },
  ];

  return (
    <RiskChart
      selectedRisk={selectedRisk}
      options={options}
      series={series}
      type="area"
      optionsExpand={optionsExpand}
      seriesExpand={seriesExpand}
    />
  );
};
