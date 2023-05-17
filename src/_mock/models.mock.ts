/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import {
  ModelsTableDataType,
  ModelsRiskIndicatorDataType,
  ModelsCategoryDataType,
  FiltersTableDataType,
  RiskSingleRecordDataType,
  RiskHistoricalTableDataType,
  FiltersDataType,
} from '@/types';
import {
  HOUR_AS_MILLISECONDS_FROM_EPOCH,
  DAY_AS_MILLISECONDS_FROM_EPOCH,
  WEEK_AS_MILLISECONDS_FROM_EPOCH,
  MONTH_AS_MILLISECONDS_FROM_EPOCH,
  YEAR_AS_MILLISECONDS_FROM_EPOCH,
} from '@/libs/time-utils';
import { UISelectInterface } from '@/types/common.type';

const createModelTableData = (
  id: number,
  name: string,
  description: string,
  owner: string,
  lastUpdate: string,
  status = '',
  items: FiltersDataType[] = []
): ModelsTableDataType => {
  return {
    id,
    name,
    description,
    owner,
    lastUpdate,
    status,
    items,
  };
};

const createFilterTableData = (
  id: number,
  name: string,
  description: string,
  owner: string,
  lastUpdate: string,
  type: number,
  behaviour: number,
  matchResource: number,
  matchField: number,
  matchItems: { match: number; score: number }[],
  useData: number,
  useOverTime: number,
  useDateValue: number,
  useDateType: number,
  reduceType: number,
  reduceDateValue: number,
  reduceDateType: number,
  recordItems: { field: number; filter: number; value: string }[]
): FiltersTableDataType => {
  return {
    id,
    name,
    description,
    owner,
    lastUpdate,
    type,
    behaviour,
    matchResource,
    matchField,
    matchItems,
    useData,
    useOverTime,
    useDateValue,
    useDateType,
    reduceType,
    reduceDateValue,
    reduceDateType,
    recordItems,
  };
};

export const riskIndicatorsTableData: FiltersTableDataType[] = [
  createFilterTableData(
    1,
    'Performance Rating',
    'Assesses employee performance ratings',
    'John Thomas',
    '06/01/22 12:23 PM',
    1,
    1,
    1,
    1,
    [
      { match: 1, score: 100 },
      { match: 2, score: 50 },
    ],
    1,
    1,
    3,
    1,
    1,
    3,
    1,
    [{ field: 1, filter: 1, value: 'Add value or @list' }]
  ),
  createFilterTableData(
    2,
    'Job Title',
    'Risk scores certain job categories that have access to critical areas',
    'Melanie Carter',
    '05/12/22 12:23 PM',
    1,
    1,
    1,
    1,
    [
      { match: 1, score: 100 },
      { match: 2, score: 50 },
    ],
    1,
    1,
    3,
    1,
    1,
    3,
    1,
    [{ field: 1, filter: 1, value: 'Add value or @list' }]
  ),
  createFilterTableData(
    3,
    'Wage Garnishment',
    'Assigns higher risk  for individuals with high garnishment amounts',
    'John Thomas',
    '05/08/22 12:23 PM',
    1,
    1,
    1,
    1,
    [
      { match: 1, score: 100 },
      { match: 2, score: 50 },
    ],
    1,
    1,
    3,
    1,
    1,
    3,
    1,
    [{ field: 1, filter: 1, value: 'Add value or @list' }]
  ),
  createFilterTableData(
    4,
    'Single Email Risk Indicator',
    'Risk scores individual e-mail records and assigns a score',
    'John Thomas',
    '04/01/22 12:23 PM',
    1,
    1,
    1,
    1,
    [
      { match: 1, score: 100 },
      { match: 2, score: 50 },
    ],
    1,
    1,
    3,
    1,
    1,
    3,
    1,
    [{ field: 1, filter: 1, value: 'Add value or @list' }]
  ),
  createFilterTableData(
    5,
    'Flight Risk - ML',
    'Assesses the likelihood of individual leaving the organization',
    'Admin',
    '04/01/22 12:23 PM',
    1,
    1,
    1,
    1,
    [
      { match: 1, score: 100 },
      { match: 2, score: 50 },
    ],
    1,
    1,
    3,
    1,
    1,
    3,
    1,
    [{ field: 1, filter: 1, value: 'Add value or @list' }]
  ),
];

export const listsTableData: ModelsTableDataType[] = [
  createModelTableData(
    1,
    '@Countries of Concern',
    'Source: OFAC - Office of Foreign Assets Control',
    'John Thomas',
    '05/01/22 12:23 PM',
    '',
    [
      { id: 1, operator: 2, resource: 2, field: 2, filter: 1, key: 'Balkans' },
      { id: 2, operator: 2, resource: 2, field: 2, filter: 2, key: 'Serbia' },
      { id: 3, operator: 2, resource: 2, field: 2, filter: 3, key: 'Albania' },
      { id: 4, operator: 2, resource: 2, field: 2, filter: 4, key: 'Bosnia' },
      { id: 5, operator: 2, resource: 2, field: 2, filter: 5, key: 'Croatia' },
      {
        id: 6,
        operator: 2,
        resource: 2,
        field: 2,
        filter: 6,
        key: 'Macedonia',
      },
      { id: 7, operator: 2, resource: 2, field: 2, filter: 7, key: 'Kosovo' },
      { id: 8, operator: 2, resource: 2, field: 2, filter: 8, key: 'Belarus' },
      { id: 9, operator: 2, resource: 2, field: 2, filter: 9, key: 'Burundi' },
      {
        id: 10,
        operator: 2,
        resource: 2,
        field: 2,
        filter: 10,
        key: 'Central African Republic',
      },
      { id: 11, operator: 2, resource: 2, field: 2, filter: 11, key: 'Crimea' },
      { id: 12, operator: 2, resource: 2, field: 2, filter: 12, key: 'Cuba' },
      {
        id: 13,
        operator: 2,
        resource: 2,
        field: 2,
        filter: 13,
        key: '*Congo*',
      },
      { id: 14, operator: 2, resource: 2, field: 2, filter: 14, key: 'Iran' },
      { id: 15, operator: 2, resource: 2, field: 2, filter: 15, key: 'Iraq' },
      {
        id: 16,
        operator: 2,
        resource: 2,
        field: 2,
        filter: 16,
        key: 'Lebanon',
      },
      { id: 17, operator: 2, resource: 2, field: 2, filter: 17, key: 'Libya' },
      {
        id: 18,
        operator: 2,
        resource: 2,
        field: 2,
        filter: 18,
        key: 'North Korea',
      },
      {
        id: 19,
        operator: 2,
        resource: 2,
        field: 2,
        filter: 19,
        key: 'Somalia',
      },
      { id: 20, operator: 2, resource: 2, field: 2, filter: 20, key: 'Sudan' },
      { id: 21, operator: 2, resource: 2, field: 2, filter: 21, key: 'Syria' },
      {
        id: 22,
        operator: 2,
        resource: 2,
        field: 2,
        filter: 22,
        key: 'Venezuela',
      },
      { id: 23, operator: 2, resource: 2, field: 2, filter: 23, key: 'Yemen' },
      {
        id: 24,
        operator: 2,
        resource: 2,
        field: 2,
        filter: 24,
        key: 'Zimbabwe',
      },
    ]
  ),
  createModelTableData(
    2,
    '@Universities with Military ties',
    'Source: unitracker.aspi.org.au',
    'John Thomas',
    '04/01/22 12:23 PM'
  ),
  createModelTableData(
    3,
    '@Weekend Dates',
    'List of weekend dates',
    'Admin',
    '04/01/22 12:23 PM'
  ),
  createModelTableData(
    4,
    '@Concerning Keywords',
    'Dictionary of negative words - Source: AFINN-165',
    'Mary Williams',
    '03/01/22 12:23 PM'
  ),
  createModelTableData(
    5,
    '@Competitor e-mail domains',
    'Competitor e-mail domains',
    'Mary Williams',
    '03/01/22  3:23 PM'
  ),
];

export const filtersTableData: ModelsTableDataType[] = [
  createModelTableData(
    1,
    'Active Employees Only',
    'Filters out non-Active Employees',
    'John Thomas',
    '05/01/22 12:23 PM'
  ),
  createModelTableData(
    2,
    'US-only Employees',
    'Filters out non-US employees',
    'John Thomas',
    '04/01/22 12:23 PM'
  ),
  createModelTableData(
    3,
    'Contractors Only',
    'Filters out non-Contractors',
    'Melanie Rogers',
    '04/01/22 12:23 PM'
  ),
  createModelTableData(
    4,
    'Engineers in Omaha',
    'Includes only individuals with “Engineer” in title and Location in Omaha',
    'Mary Williams',
    '03/01/22 12:23 PM',
    '',
    [
      {
        id: 1,
        operator: 1,
        resource: 1,
        field: 1,
        filter: 1,
        key: 'Engineer',
      },
      { id: 2, operator: 1, resource: 1, field: 2, filter: 1, key: 'Omaha' },
    ]
  ),
];

export const filterList = [{ id: 1, name: 'Active Employees Only' }];

export const peerList = [{ id: 1, name: 'Business Unit' }];

export const frequencyList = [{ id: 1, name: 'Daily' }];

export const resultRefreshList = [
  { id: 1, name: 'As soon as available' },
  { id: 2, name: 'Daily at X AMPM' },
  { id: 3, name: 'Hourly' },
];

export const modelResultList = [
  { id: 1, name: 'Yes' },
  { id: 2, name: 'No' },
];

export const modelAnalystList = [
  { id: 1, name: 'Yes' },
  { id: 2, name: 'No' },
];

export const individualList = [{ id: 1, name: '100' }];

const createModelCategoryData = (
  id: number,
  name: string,
  weight: number,
  items: ModelsRiskIndicatorDataType[]
): ModelsCategoryDataType => {
  return {
    id,
    name,
    weight,
    items,
  };
};

export const modelsCategoryList = [
  createModelCategoryData(1, 'Access to Critical Assets', 10, [
    { id: 1, value: 1, weight: 40 },
    { id: 2, value: 2, weight: 20 },
    { id: 3, value: 3, weight: 40 },
  ]),
  createModelCategoryData(2, 'Data Exfiltration', 15, [
    { id: 1, value: 2, weight: 40 },
    { id: 2, value: 4, weight: 20 },
    { id: 3, value: 5, weight: 40 },
  ]),
  createModelCategoryData(3, 'Flight Risk', 15, [
    { id: 1, value: 1, weight: 40 },
    { id: 2, value: 2, weight: 20 },
    { id: 3, value: 3, weight: 40 },
  ]),
  createModelCategoryData(4, 'Foreign Nexus', 15, [
    { id: 1, value: 1, weight: 40 },
    { id: 2, value: 2, weight: 20 },
    { id: 3, value: 3, weight: 40 },
  ]),
  createModelCategoryData(5, 'Disciplinary Actions', 10, [
    { id: 1, value: 1, weight: 40 },
    { id: 2, value: 2, weight: 20 },
    { id: 3, value: 3, weight: 40 },
  ]),
  createModelCategoryData(6, 'Poor Performance', 10, [
    { id: 1, value: 4, weight: 40 },
    { id: 2, value: 5, weight: 20 },
    { id: 3, value: 1, weight: 40 },
  ]),
  createModelCategoryData(7, 'Financial and other Life Stressors', 10, [
    { id: 1, value: 4, weight: 40 },
    { id: 2, value: 5, weight: 20 },
    { id: 3, value: 1, weight: 40 },
  ]),
  createModelCategoryData(8, 'Unusual Badge Access', 15, [
    { id: 1, value: 4, weight: 40 },
    { id: 2, value: 5, weight: 20 },
    { id: 3, value: 1, weight: 40 },
  ]),
];

export const externalAppData = [
  { id: 'iam', name: 'Identity and Access Management' },
  { id: 'so', name: 'Security Orchestration' },
  { id: 'cm', name: 'Case Management' },
  { id: 'em', name: 'Enhanced Monitoring' },
  { id: 'pr', name: 'Public Records' },
  { id: 'sm', name: 'Social Media' },
];

export const externalAppDescriptionData: { [id: string]: string } = {
  iam: 'Identity and Access Management (IAM) Application (e.g MS Active Directory)',
  so: 'Security, Orchestration and Automation Response (SOAR) applications',
  cm: 'Case Management (e.g Archer, SNow)',
  em: 'Enhanced Monitoring (e.g UAM application)',
  pr: 'Open Source / Public Records',
  sm: 'Social Media Data Collection',
};

export const resourceData = [
  { id: 'access', name: 'Access' },
  { id: 'hr', name: 'Human Resources' },
  { id: 'device', name: 'Device alerts' },
  { id: 'logon', name: 'Logon' },
  { id: 'http', name: 'HTTP' },
  { id: 'ldap', name: 'LDAP' },
  { id: 'email', name: 'Email' },
  { id: 'file', name: 'File' },
  { id: 'relationships', name: 'Relationships' },
];
export const fieldData: { [dataSourceId: string]: UISelectInterface[] } = {
  access: [
    { id: 'id', name: 'ID' },
    { id: 'system', name: 'System' },
    { id: 'timestamp', name: 'Timestamp' },
  ],
  hr: [
    { id: 'id', name: 'ID' },
    { id: 'name', name: 'Name' },
    { id: 'timestamp', name: 'Timestamp' },
  ],
  device: [
    { id: 'id', name: 'ID' },
    { id: 'date', name: 'Date' },
    { id: 'user', name: 'User' },
    { id: 'pc', name: 'PC' },
    { id: 'file_tree', name: 'File Tree' },
    { id: 'activity', name: 'Activity' },
  ],
  logon: [
    { id: 'id', name: 'ID' },
    { id: 'date', name: 'Date' },
    { id: 'user', name: 'User' },
    { id: 'pc', name: 'PC' },
    { id: 'activity', name: 'Activity' },
  ],
  http: [
    { id: 'id', name: 'ID' },
    { id: 'date', name: 'Date' },
    { id: 'user', name: 'User' },
    { id: 'pc', name: 'PC' },
    { id: 'url', name: 'URL' },
    { id: 'activity', name: 'Activity' },
    { id: 'content', name: 'Content' },
  ],
  ldap: [
    { id: 'name', name: 'Name' },
    { id: 'id', name: 'ID' },
    { id: 'email', name: 'EMail' },
    { id: 'role', name: 'Role' },
    { id: 'projects', name: 'Projects' },
    { id: 'business_unit', name: 'Business Unit' },
    { id: 'professional_unit', name: 'Professional Unit' },
    { id: 'functional_unit', name: 'Functional Unit' },
    { id: 'department', name: 'Department' },
    { id: 'team', name: 'Team' },
    { id: 'supervisor', name: 'Supervisor' },
  ],
  email: [
    { id: 'id', name: 'ID' },
    { id: 'date', name: 'Date' },
    { id: 'user', name: 'User' },
    { id: 'pc', name: 'PC' },
    { id: 'to', name: 'To' },
    { id: 'cc', name: 'CC' },
    { id: 'bcc', name: 'BCC' },
    { id: 'from', name: 'From' },
    { id: 'activity', name: 'Activity' },
    { id: 'size', name: 'Size' },
    { id: 'attachments', name: 'Attachments' },
    { id: 'content', name: 'Content' },
  ],
  file: [
    { id: 'id', name: 'ID' },
    { id: 'date', name: 'Date' },
    { id: 'user', name: 'User' },
    { id: 'pc', name: 'PC' },
    { id: 'filename', name: 'Filename' },
    { id: 'activity', name: 'Activity' },
    { id: 'to_removable_media', name: 'To Removable Media' },
    { id: 'from_removable_media', name: 'From Removable Media' },
    { id: 'content', name: 'Content' },
  ],
};
export const filterOptionData = [
  { id: 'DOES_NOT_CONTAIN', name: 'Does Not Contain (Text)' },
  { id: 'CONTAINS', name: 'Contains (Text)' },
  { id: 'NULL', name: 'Null (Blank)' },
  { id: 'LESS_THAN', name: 'Less Than' },
  { id: 'LESS_THAN_OR_EQUAL', name: 'Less Than or Equal' },
  { id: 'GREATER_THAN', name: 'Greater Than' },
  { id: 'GREATER_THAN_OR_EQUAL', name: 'Great Than or Equal' },
  { id: 'EQUAL', name: 'Equal' },
];

export const riskTypeData = [
  { id: 1, name: 'Across Records' },
  { id: 2, name: 'Single Record' },
];

export const behaviorData = [
  { id: 1, name: 'Matches Values', riskIndicatorType: 'value' },
  { id: 2, name: 'Value Within a Range', riskIndicatorType: 'within' },
  { id: 3, name: 'How Often Something Occurs', riskIndicatorType: 'count' },
  { id: 4, name: 'How Many Unique Values', riskIndicatorType: 'unique' },
  { id: 5, name: 'Adds Up Values', riskIndicatorType: 'summation' },
  { id: 6, name: 'Trending Up or Down', riskIndicatorType: 'trend' },
  { id: 7, name: 'Outside of Normal Values', riskIndicatorType: 'outlier_val' },
  { id: 8, name: 'Outside of Normal Time', riskIndicatorType: 'outlier_time' },
  { id: 9, name: 'Passthrough Same Score', riskIndicatorType: 'normalize' },
  {
    id: 10,
    name: 'Similarity between Two Values',
    riskIndicatorType: 'similarity',
  },
  {
    id: 11,
    name: 'Time Discrepancy between Events',
    riskIndicatorType: 'discrepancy',
  },
  { id: 12, name: 'Negative Text Sentiment', riskIndicatorType: 'sentiment' },
];

export const riskValues = [
  { id: 1, name: 'United States of America' },
  { id: 2, name: 'Afghanistan' },
  { id: 3, name: "People's Republic of China" },
  { id: 4, name: 'Iraq' },
  { id: 5, name: 'Japan' },
];

export const riskIndicatorTypeToTypeData: {
  [name: string]: { riskTypeId: number; behaviorTypeId: number };
} = {
  value: { riskTypeId: 1, behaviorTypeId: 1 },
  within: { riskTypeId: 1, behaviorTypeId: 2 },
  count: { riskTypeId: 1, behaviorTypeId: 3 },
  unique: { riskTypeId: 1, behaviorTypeId: 4 },
  summation: { riskTypeId: 1, behaviorTypeId: 5 },
  trend: { riskTypeId: 1, behaviorTypeId: 6 },
  outlier_val: { riskTypeId: 1, behaviorTypeId: 7 },
  outlier_time: { riskTypeId: 1, behaviorTypeId: 8 },
  normalize: { riskTypeId: 1, behaviorTypeId: 9 },
  similarity: { riskTypeId: 1, behaviorTypeId: 10 },
  discrepancy: { riskTypeId: 1, behaviorTypeId: 11 },
  sentiment: { riskTypeId: 1, behaviorTypeId: 12 },
};

export const behaviorTypeToRiskIndicatortype: {
  [behaviorTypeId: number]: string;
} = {
  1: 'value',
  2: 'within',
  3: 'count',
  4: 'unique',
  5: 'summation',
  6: 'trend',
  7: 'outlier_val',
  8: 'outlier_time',
  9: 'normalize',
  10: 'similarity',
  11: 'discrepancy',
  12: 'sentiment',
};

export const useData = [
  { id: 'All Data', name: 'All Data' },
  { id: 'Most recent value', name: 'Most recent value' },
];

export const overTimeData = [
  { id: 'WITHIN_THE_LAST', name: 'within the last' },
  { id: 'ALL_TIMES', name: 'for all times' },
  { id: 'BETWEEN_DATES', name: 'between dates' },
];

export const reduceData = [
  { id: 'Reduce', name: 'Reduce' },
  { id: 'Do not reduce', name: 'Do not reduce' },
];

export const dateData = [
  { id: 'YEAR', name: 'years' },
  { id: 'MONTH', name: 'months' },
  { id: 'DAY', name: 'days' },
];

export const outlierScoringTypes = [
  { id: 'MAX_OUTLIER', name: 'Max' },
  { id: 'AVERAGE_OUTLIER', name: 'Average' },
];

export const outlierTimePeriods = [
  { id: WEEK_AS_MILLISECONDS_FROM_EPOCH, name: '1 Week' },
  { id: 2 * WEEK_AS_MILLISECONDS_FROM_EPOCH, name: '2 Weeks' },
];

export const outlierGeneralTimePeriods = [
  { id: DAY_AS_MILLISECONDS_FROM_EPOCH, name: 'Days' },
  { id: WEEK_AS_MILLISECONDS_FROM_EPOCH, name: 'Weeks' },
  { id: MONTH_AS_MILLISECONDS_FROM_EPOCH, name: 'Months' },
  { id: YEAR_AS_MILLISECONDS_FROM_EPOCH, name: 'Years' },
];

export const outlierTimeUnits = [
  { id: HOUR_AS_MILLISECONDS_FROM_EPOCH, name: '1 hour' },
  { id: 2 * HOUR_AS_MILLISECONDS_FROM_EPOCH, name: '2 hours' },
  { id: 4 * HOUR_AS_MILLISECONDS_FROM_EPOCH, name: '4 hours' },
  { id: 6 * HOUR_AS_MILLISECONDS_FROM_EPOCH, name: '6 hours' },
  { id: 8 * HOUR_AS_MILLISECONDS_FROM_EPOCH, name: '8 hours' },
];

export const outlierHours = [
  { id: 0, name: '12 AM' },
  { id: 1, name: '1 AM' },
  { id: 2, name: '2 AM' },
  { id: 3, name: '3 AM' },
  { id: 4, name: '4 AM' },
  { id: 5, name: '5 AM' },
  { id: 6, name: '6 AM' },
  { id: 7, name: '7 AM' },
  { id: 8, name: '8 AM' },
  { id: 9, name: '9 AM' },
  { id: 10, name: '10 AM' },
  { id: 11, name: '11 AM' },
  { id: 12, name: '12 PM' },
  { id: 13, name: '1 PM' },
  { id: 14, name: '2 PM' },
  { id: 15, name: '3 PM' },
  { id: 16, name: '4 PM' },
  { id: 17, name: '5 PM' },
  { id: 18, name: '6 PM' },
  { id: 19, name: '7 PM' },
  { id: 20, name: '8 PM' },
  { id: 21, name: '9 PM' },
  { id: 22, name: '10 PM' },
  { id: 23, name: '11 PM' },
];

export const emailData = [
  { id: 1, name: 'Sender E-mail Name' },
  { id: 2, name: 'Recipient E-mail Name' },
];

export const riskSingleRecordTableData: RiskSingleRecordDataType = {
  id: 1,
  name: 'Outgoing E-mail Risk',
  description: 'Assigns a score for each individual e-mail',
  type: 2,
  resource: 2,
  items: [
    {
      id: 1,
      name: 'Subject Line Blank',
      weight: 25,
      behavior: 9,
      first: 1,
      second: 2,
      score: 100,
    },
    {
      id: 2,
      name: 'Subject Line Blank',
      weight: 75,
      behavior: 9,
      first: 1,
      second: 2,
      score: 100,
    },
  ],
};

export const riskHistoricalTableData: RiskHistoricalTableDataType[] = [
  { id: 1, value: 1, occurrence: 351 },
  { id: 2, value: 2, occurrence: 725 },
  { id: 3, value: 3, occurrence: 5651 },
  { id: 4, value: 4, occurrence: 25651 },
  { id: 5, value: 5, occurrence: 1531 },
];
