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
    align: 'center',
  },
  {
    id: 'numberOfIndividuals',
    headerName: 'Number Of Individuals',
    align: 'center',
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
  '50',
  '45',
  '40',
  '35',
  '30',
  '25',
  '20',
  '15',
  '10',
  '5',
  '0',
];
export const chartDataTotalRiskScore = {
  labels: labelsTotalRiskScore,
  datasets: [
    {
      maxBarThickness: 20,
      data: [
        0, 1, 6, 26, 32, 31, 17, 6, 32, 252, 1480, 4876, 13463, 16415, 4663,
      ],
      backgroundColor: 'rgb(78,113,190)',
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
      maxBarThickness: 10,
      data: [200, 225, 180, 250, 300, 298, 260, 300, 297, 295, 300, 312],
      backgroundColor: 'rgb(78,113,190)',
    },
  ],
};

export const riskStatusChartData = {
  labels: [
    'Case Open',
    'Corrective Action Taken',
    'Case closed - No Further Action',
    'Enhanced Monitoring',
    'Lead Identified',
  ],
  datasets: [
    {
      data: [28, 21, 10, 31, 10],
      backgroundColor: ['#FFC000', '#F57C2B', '#92D050', '#C00000', '#959595'],
    },
  ],
};

const statusOverTimeLabels = ['2019Q2', '2019Q3', '2019Q4', '2020Q1'];
export const statusOverTimeChartData = {
  labels: statusOverTimeLabels,
  datasets: [
    {
      maxBarThickness: 50,
      data: [1, 3, 2, 2],
      backgroundColor: 'rgb(254, 192, 0)',
    },
    {
      maxBarThickness: 50,
      data: [1, 4, 1, 0],
      backgroundColor: 'rgb(236, 125, 49)',
    },
    {
      maxBarThickness: 50,
      data: [0, 2, 0, 1],
      backgroundColor: 'rgb(146, 209, 80)',
    },
    {
      maxBarThickness: 50,
      data: [0, 0, 4, 5],
      backgroundColor: 'rgb(193, 3, 0)',
    },
    {
      maxBarThickness: 50,
      data: [0, 0, 0, 3],
      backgroundColor: 'rgb(166, 166, 166)',
    },
  ],
};

export const personsPerChartData = {
  labels: [
    'Business Development',
    'Corporate Strategy',
    'Customer Service',
    'Engineering',
    'Finance',
    'IT Support Staff',
    'Marketing',
    'Operations',
    'Sales',
  ],
  datasets: [
    {
      data: [4, 12, 12, 4, 4, 24, 16, 16, 8],
      backgroundColor: [
        'rgb(97, 160, 219)',
        'rgb(247,127, 41)',
        'rgb(165, 165, 165)',
        'rgb(252, 196, 0)',
        'rgb(55, 106, 195)',
        'rgb(107, 172,62)',
        'rgb(32, 93, 151)',
        'rgb(165, 71, 7)',
        'rgb(105,105, 105)',
      ],
    },
  ],
};

export const riskScoreHover = [
  { name: 'Mean', score: 5.7 },
  { name: 'Median', score: 4.8 },
  { name: 'Standard Deviation', score: 5.1 },
  { name: 'Skewness', score: 2.2 },
  { name: 'Minimum', score: 0.0 },
  { name: 'Maximum', score: 61.6 },
  { name: 'Total Persons', score: 41300 },
];
