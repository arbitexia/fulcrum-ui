/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */

import { limitValue, roundScoreIntelligently } from '@/libs/math-utils';

type TrendColor = {
  textColor: string;
  bgColor: string;
};

export type StatusDict = {
  [status: string]: TrendColor;
};

export const trendColorList: TrendColor[] = [
  {
    textColor: '#009688',
    bgColor: '#B2DFDB',
  },
  {
    textColor: '#9C27B0',
    bgColor: '#E1BEE7',
  },
  {
    textColor: '#3F51B5',
    bgColor: '#C5CAE9',
  },
  {
    textColor: '#03A9F4',
    bgColor: '#B3E5FC',
  },
  {
    textColor: '#FBC02D',
    bgColor: '#FFF9C4',
  },
  {
    textColor: '#FF9800',
    bgColor: '#FFE0B2',
  },
  {
    textColor: '#795548',
    bgColor: '#D7CCC8',
  },
  {
    textColor: '#8BC34A',
    bgColor: '#DCEDC8',
  },
];

export const getColorPair = (index: number): TrendColor => {
  if (index >= trendColorList.length) {
    const textColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    const bgColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    trendColorList.push({
      textColor,
      bgColor,
    });
  }
  return trendColorList[index];
};

const tableScoreColorScale: { [truncatedScore: number]: string } = {
  3: '#FF5722',
  2: '#FFC107',
  1: '#4CAF50',
  0: '#0050BE',
};

const defaultScoreColorForTable = '#C62828';

export const getScoreColorGeneric = (
  score: number,
  scoreToReturnColor: {
    [truncatedScore: number]: string;
  } = tableScoreColorScale,
  defaultColor: string = defaultScoreColorForTable
): string => {
  // integer division to get the most significant digit
  const truncatedScore = limitValue(score, 0, 100) / 10;
  return (
    scoreToReturnColor[roundScoreIntelligently(truncatedScore)] ?? defaultColor
  );
};

export const getScoreColor = (score: number): string => {
  return getScoreColorGeneric(
    score,
    tableScoreColorScale,
    defaultScoreColorForTable
  );
};

const riskColorTable: { [truncatedScore: number]: string } = {
  7: '#C62828',
  5: '#FF5722',
  2: '#FFC107',
  0: '#4CAF50',
};

export const riskColorDefaultValue = '#0050BE';

export const getRiskTableScoreColor = (score: number): string => {
  return getScoreColorGeneric(score, riskColorTable, riskColorDefaultValue);
};

export const statusColors: StatusDict = {
  new: {
    textColor: '#586D79',
    bgColor: '#FBE9E7',
  },
  'In-Progress': {
    textColor: '#586D79',
    bgColor: '#F7FB2D80',
  },
  Reviewed: {
    textColor: '#586D79',
    bgColor: '#4CAF50',
  },
  'Case Opened': {
    textColor: '#586D79',
    bgColor: '#FBC02D80',
  },
  'Case Closed': {
    textColor: '#586D79',
    bgColor: '#B3E5FC',
  },
};

export const getStatusColor = (
  statusId: keyof StatusDict,
  defaultKey: keyof StatusDict = 'new'
): TrendColor => {
  if (statusId in statusColors) {
    return statusColors[statusId];
  }
  return statusColors[defaultKey];
};

export const outlierColor = 'rgb(0,0,0)';
