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
  TooltipItem,
} from 'chart.js';
import { _DeepPartialObject } from 'chart.js/types/utils';

ChartJS.register(Title, Tooltip, Legend);

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
    { id: 1, name: 'Weighted Risk Scores' },
    { id: 2, name: 'Number of Indicators' },
    { id: 3, name: 'Increases in last 90 days' },
    { id: 4, name: 'Variations from Peers' },
  ],
};

export const analysts = {
  label: 'Analyst Name',
  items: [
    { id: 1, name: 'Diego Martinez' },
    { id: 2, name: 'Ollie Luba' },
    { id: 3, name: 'Kevin Homa' },
    { id: 4, name: 'James Burnham' },
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
    tooltip: {
      callbacks: {
        label: (tooltipItem: TooltipItem<'bar'>) => {
          const { dataIndex, dataset, parsed } = tooltipItem;
          const { y } = parsed;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const names: string[] = dataset?.names ?? null;
          if (names && names.length > 0) {
            const name = names[dataIndex];
            if (name) {
              return `${name} - ${Math.round(y)}`;
            }
          }
          return Math.round(y);
        },
        title: (toolTipItem: TooltipItem<'bar'>[]) => {
          if (toolTipItem && toolTipItem.length > 0) {
            const { dataset } = toolTipItem[0];
            return dataset.label;
          }
          return '';
        },
      },
    },
  },
  responsive: true,
  barThickness: 15,
  scales: {
    x: {
      title: {
        display: true,
        color: '#7C909B',
        fontSize: '14px',
        text: 'Persons of Concern',
      },
      stacked: true,
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        display: false,
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
