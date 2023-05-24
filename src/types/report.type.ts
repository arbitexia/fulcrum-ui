/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */
export type ReportsColumnType = {
  id: string;
  headerName: string;
  props?: { [id: string]: string };
  variant?: string;
  sortable?: boolean;
  align?: string;
};

export type ProgramTableType = {
  id: number;
  status: string;
  date: string;
  analyst: string;
  name: string;
  eid: number;
  title: string;
  businessArea: string;
};

export type OrganizationTableType = {
  id: number;
  name: string;
  category: string;
  percentPopulation: number;
  numberOfIndividuals: number;
  trend: string;
};

export type RetrieveProgramParams = {
  accessToken: string;
  startDate?: string;
  endDate?: string;
};

export type RetrievePersonParams = {
  accessToken: string;
  status?: string;
  person?: string;
};

export type RetrieveOrgParams = {
  accessToken: string;
  modelId?: string;
  population?: string;
};

export type RiskStatusSummaryType = {
  id: number;
  status: string;
  value: number;
  date: string;
};

export type StatusOvertimeType = {
  id: number;
  label: string;
  values: number[];
};

export type PersonPerType = {
  id: number;
  status: string;
  value: number;
  date: string;
};

export type RiskScoreSummaryType = {
  id: number;
  score: number;
  personNumber: number;
};

export type IndividualsRiskIndicatorType = {
  id: number;
  month: string;
  value: number;
};
