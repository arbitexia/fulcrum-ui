/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ScatterDataPoint,
  BubbleDataPoint,
} from 'chart.js';
import { _DeepPartialObject } from 'chart.js/types/utils';
import { StateCardItemType } from '@/types';

ChartJS.register(Title, Tooltip, Legend);

export const homeStatusCards: StateCardItemType[] = [
  {
    title: 'Total Persons',
    amount: '31,203',
    info: '1',
    icon: '/images/icons/up.svg',
  },
  {
    title: 'Data Sources',
    amount: '15',
    info: '1',
    icon: '/images/icons/up.svg',
  },
  {
    title: '# Risk Indicators',
    amount: '46',
    info: '3',
    icon: '/images/icons/up.svg',
  },
  {
    title: 'Record Analyzed',
    amount: '5.1M',
    info: '12K',
    icon: '/images/icons/up.svg',
  },
  {
    title: 'Leads Reviewed',
    amount: '126',
    info: 'in the last year',
  },
  {
    title: 'Cases Opened',
    amount: '12',
    info: 'in the last year',
  },
];

export const modelList = {
  label: 'Model Name',
  items: [
    { id: 1, name: 'Sabotage Model' },
    { id: 2, name: 'Data Exfiltration Model' },
    { id: 3, name: 'Disgruntlement Model' },
    { id: 4, name: 'High risk infrequent events' },
    { id: 5, name: 'Workplace Violence Model' },
    { id: 6, name: 'Fraud Model' },
  ],
};

export const rankList = {
  label: 'Rank By',
  items: [
    { id: 1, name: 'Number of Indicators' },
    { id: 2, name: 'Increases in last 90 days' },
    { id: 3, name: 'Variations from Peers' },
  ],
};

export const populationList = {
  label: 'Population',
  items: [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Engineering in Omaha' },
    { id: 3, name: 'Privileged Users' },
    { id: 4, name: 'Clearance Holders' },
  ],
};

export const barChartOptions: _DeepPartialObject<unknown> = {
  plugins: {
    legend: {
      display: false,
    },
  },
  responsive: true,
  barThickness: 15,
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        // showLabelBackdrop: true,
        // backdropColor: 'red',
        // color: 'white',
        // backdropPadding: 5,
        // callback: (value: string) => `${value}22`,
      },
    },
    y: {
      stacked: true,
      title: {
        display: true,
        color: '#7C909B',
        fontSize: '14px',
        text: 'Risk Score',
      },
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        stepSize: 10,
        // callback: (value: string) => `${value}22`,
      },
    },
  },
};

export const doughnutChartData: ChartData<
  'doughnut',
  (number | ScatterDataPoint | BubbleDataPoint | null)[]
> = {
  labels: ['Green', 'Gray'],
  datasets: [
    {
      data: [100, 300],
      backgroundColor: ['#3fc43b', '#d3d3d3'],
      hoverBackgroundColor: ['#3fc43b', '#d3d3d3'],
    },
  ],
};

export const doughnutChartOptions: _DeepPartialObject<unknown> = {
  plugins: {
    legend: {
      display: false,
    },
  },
  responsive: true,
  cutout: 75,

  circumference: 90 * Math.PI,
  rotation: 69.9 * Math.PI,
};

export const justificationList = [
  {
    title: 'High Risk Score',
    items: [
      {
        title: 'Score 1',
      },
      {
        title: 'Score 2',
      },
      {
        title: 'Score 3',
      },
    ],
  },
  {
    title: 'Report from Manager',
  },
  {
    title: 'Report from IT Security',
  },
  {
    title: 'Report from Tip Line',
  },
  {
    title: 'Report from Law Enforcement',
  },
  {
    title: 'Other',
  },
];
