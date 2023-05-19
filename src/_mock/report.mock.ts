/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */
import {
  OrganizationTableType,
  ProgramTableType,
  ReportsColumnType,
} from '@/types';

export const programMetricsColumns: ReportsColumnType[] = [
  {
    id: 'status',
    headerName: 'Individual Status Change',
  },
  {
    id: 'date',
    headerName: 'Date/Time',
    sortable: true,
  },
  {
    id: 'analyst',
    headerName: 'Analyst',
  },
  {
    id: 'name',
    headerName: 'Name',
  },
  {
    id: 'eid',
    headerName: 'EID',
  },
  {
    id: 'title',
    headerName: 'Title',
  },
  {
    id: 'businessArea',
    headerName: 'Business Area',
  },
];

export const organizationMetricsColumns: ReportsColumnType[] = [
  {
    id: 'name',
    headerName: 'Name',
  },
  {
    id: 'category',
    headerName: 'Category',
    sortable: true,
  },
  {
    id: 'percentPopulation',
    headerName: 'Percent of the Population',
  },
  {
    id: 'numberOfIndividuals',
    headerName: 'Number Of Individuals',
  },
  {
    id: 'trend',
    headerName: '1 yr Trend',
  },
];

export const programTableData: ProgramTableType[] = [
  {
    id: 1,
    status: 'In-Progress',
    date: '2022-04--22T08:15:30-05:00',
    analyst: 'John Thomas',
    name: 'Matt Dickson',
    eid: 125601,
    title: 'Nuclear Engineer',
    businessArea: 'Engineering',
  },
];

export const organizationTableData: OrganizationTableType[] = [
  {
    id: 1,
    name: 'Performance Rating',
    category: 'Performance',
    percentPopulation: 3.2,
    numberOfIndividuals: 252,
    trend: 'up',
  },
  {
    id: 2,
    name: 'Job Title',
    category: 'Access to Critical Assets',
    percentPopulation: 2.8,
    numberOfIndividuals: 202,
    trend: 'up',
  },
];

const labelsTotalRiskScore = [
  '70',
  '60',
  '65',
  '55',
  '45',
  '40',
  '30',
  '20',
  '5',
  '0',
];
export const chartDataTotalRiskScore = {
  labels: labelsTotalRiskScore,
  datasets: [
    {
      data: [100, 200, 300, 400, 500],
      backgroundColor: 'rgb(39 123 210)',
    },
  ],
};

const labelsRiskIndicator = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const chartDataRiskIndicator = {
  labels: labelsRiskIndicator,
  datasets: [
    {
      data: [100, 200, 300, 400, 500],
      backgroundColor: 'rgb(39 123 210)',
    },
  ],
};

export const riskStatusChartData = {
  labels: [
    'Lead Identified',
    'Case Open',
    'Corrective Action Taken',
    'Case closed - No Further Action',
    'Enhanced Monitoring',
  ],
  datasets: [
    {
      data: [12, 19, 3, 5, 2],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 206, 86)',
        'rgb(75, 192, 192)',
        'rgb(255, 159, 64)',
      ],
    },
  ],
};

const statusOverTimeLabels = ['2019Q2', '2019Q3', '2019Q4', '2020Q1'];
export const statusOverTimeChartData = {
  labels: statusOverTimeLabels,
  datasets: [
    {
      data: [0, 2, 5, 8],
      backgroundColor: 'rgb(255, 99, 132)',
    },
    {
      data: [2, 2, 5, 12],
      backgroundColor: 'rgb(75, 192, 192)',
    },
    {
      data: [4, 2, 5, 10],
      backgroundColor: 'rgb(53, 162, 235)',
    },
  ],
};

export const PersonsPerChartData = {
  labels: [
    'Sales',
    'Business Development',
    'Corporate Strategy',
    'Customer Service',
    'Engineering',
    'Finance',
    'IT Support Staff',
    'Marketing',
    'Operations',
  ],
  datasets: [
    {
      data: [12, 19, 3, 5, 2, 1, 15, 6, 8],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 206, 86)',
        'rgb(75, 192, 192)',
        'rgb(255, 159, 64)',
        'rgb(25, 88, 100)',
        'rgb(56, 206, 2)',
        'rgb(78, 88, 22)',
        'rgb(90, 5, 2)',
      ],
    },
  ],
};
