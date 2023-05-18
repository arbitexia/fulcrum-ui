/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import {
  ProfileRiskTableType,
  ProfileBasisTableType,
  ProfileCommentType,
} from '@/types';

export const modelsWithScoreList = [
  { id: 1, title: 'Sabotage Model', score: 40 },
  { id: 2, title: 'Data Exfiltration Model', score: 20 },
  { id: 3, title: 'Disgruntlement Model', score: 15 },
  { id: 4, title: 'High risk infrequent events', score: 10 },
  { id: 5, title: 'Workplace Violence Model', score: 5 },
  { id: 6, title: 'Fraud Model', score: 1 },
];

const createRiskData = (
  id: number,
  indicator: string,
  score: number,
  max: number,
  trend: number,
  up: number
): ProfileRiskTableType => {
  return {
    id,
    indicator,
    score,
    max,
    trend,
    up,
  };
};

export const riskTableData: ProfileRiskTableType[] = [
  createRiskData(1, 'Access to Critical Assets', 9, 10, 13, 0),
  createRiskData(2, 'Data Exfiltration', 12, 16, 6, 0),
  createRiskData(3, 'Flight Risk', 8, 15, 6.2, 0),
  createRiskData(4, 'Foreign Nexus', 6, 15, 2, 1),
  createRiskData(5, 'Disciplinary Actions', 5, 10, 0, 2),
  createRiskData(6, 'Poor Performance', 2, 15, 0, 2),
  createRiskData(7, 'Financial Distress', 2, 10, 0, 2),
  createRiskData(8, 'Unusual Badge Access', 0, 10, 1, 1),
];

export const riskCollapseData: ProfileRiskTableType[] = [
  createRiskData(1, 'Emails Outside Normal Behavior', 7.5, 15, 2, 0),
  createRiskData(2, 'High Risk Emails Sent', 3, 15, 2, 0),
  createRiskData(3, 'USB Usage Alerts - from DLP', 1.5, 15, 2, 0),
];

const createBasisData = (
  id: number,
  date: string,
  emailSent: number,
  attachSent: number,
  size: string
): ProfileBasisTableType => {
  return { id, date, emailSent, attachSent, size };
};

export const basisTableData = [
  createBasisData(1, '5/15/2022', 12, 11, '7.8KB'),
  createBasisData(2, '5/15/2022', 2, 1, '1.2KB'),
  createBasisData(3, '5/15/2022', 12, 3, '1.2GB'),
  createBasisData(4, '5/15/2022', 250, 50, '4.1MB'),
  createBasisData(5, '5/15/2022', 4, 12, '4.1KB'),
  createBasisData(6, '5/15/2022', 50, 13, '3.1KB'),
];

export type ProfileTimeLineRiskType = {
  id: number;
  trend: number;
  label: string;
  up: number;
  colorIndex: number;
};

export type ProfileTimeLineType = {
  id: number;
  score: number;
  date: string;
  items: ProfileTimeLineRiskType[];
};

export type HistoricalDataRiskIndicatorScore = {
  name: string;
  score: number;
};

export type HistoricalDataCategoryScore = {
  name: string;
  score: number;
  riskIndicators: HistoricalDataRiskIndicatorScore[];
};

export type HistoricalDataForEntityId = {
  [date: string]: HistoricalDataCategoryScore[];
};

const createCommentData = (
  id: number,
  avatar: string,
  online: boolean,
  name: string,
  date: string,
  comment: string,
  file?: string
): ProfileCommentType => {
  return { id, avatar, online, name, date, comment, file };
};

export const commentData: ProfileCommentType[] = [
  createCommentData(
    1,
    '',
    true,
    'Ollie Luba',
    '7/10/2022 9:14 AM',
    'Assessed foreign nexus and data exfiltration events. Attached screenshots from User Monitoring application.',
    'pdf'
  ),
  createCommentData(
    2,
    '',
    true,
    'Justin Bartlett',
    '6/20/2022 9:14 AM',
    'This comment goes over different models or is a side note about a risk indicator.'
  ),
  createCommentData(
    3,
    '',
    true,
    'Ollie Luba',
    '5/10/2022 9:14 AM',
    'Reviewed concerning behaviors with employee’s manager.'
  ),
];
