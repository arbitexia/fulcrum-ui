/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */
import { ChartOptions } from 'chart.js';
export const reportsTabData = [
  {
    label: 'Program Metrics',
    url: 'program-metrics',
  },
  {
    label: 'Organization Metrics',
    url: 'organization-metrics',
  },
];

export const barChartWithTitleOptions: ChartOptions<'bar'> = {
  plugins: {
    legend: {
      display: false,
    },
  },
  responsive: true,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Risk Scores',
        font: { size: 22, weight: '700' },
      },
      stacked: true,
      grid: {
        display: false,
        drawBorder: false,
      },
    },
    y: {
      stacked: true,
      title: {
        display: true,
        text: 'Number of Persons',
        font: { size: 22, weight: '700' },
      },
    },
  },
};

export const barChartNoTitleOptions: ChartOptions<'bar'> = {
  plugins: {
    legend: {
      display: false,
    },
  },
  responsive: true,
  scales: {
    x: {
      title: {
        display: false,
      },
      stacked: true,
      grid: {
        display: false,
        drawBorder: false,
      },
    },
    y: {
      stacked: true,
      title: {
        display: false,
      },
    },
  },
};

export const totalStatus = {
  default: 'New',
  values: [
    'New',
    'In-Progress',
    'Reviewed',
    'Case Opened',
    'Corrective Action',
    'Case Closed',
  ],
};

export const personsPerList = {
  items: [
    {
      id: 1,
      name: 'Job Title',
    },
    {
      id: 2,
      name: 'Location',
    },
    {
      id: 3,
      name: 'Business Unit',
    },
    {
      id: 4,
      name: 'Clearance',
    },
    {
      id: 5,
      name: 'Employee Status',
    },
  ],
  label: '',
};
