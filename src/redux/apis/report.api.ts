/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import config from '@/config';
import {
  RetrieveProgramParams,
  RiskStatusSummaryType,
  StatusOvertimeType,
  RetrievePersonParams,
  PersonPerType,
  ProgramTableType,
  RetrieveOrgParams,
  RiskScoreSummaryType,
  IndividualsRiskIndicatorType,
  OrganizationTableType,
} from '@/types/report.type';
import axios from 'axios';

const baseReportUrl: string = config.URLS.REPORT_URL || '';

const headers = {
  'Access-Control-Allow-Origin': baseReportUrl,
  'Access-Control-Allow-Methods':
    config.ACCESS_CONTROL_ALLOWED_METHODS.REPORT.join(','),
};

export const loadRiskStatusSummary = async (
  params: RetrieveProgramParams
): Promise<RiskStatusSummaryType[]> => {
  const response = await axios.post<RiskStatusSummaryType[]>(
    `${baseReportUrl}/api/reports/program/risk-status`,
    params,
    { headers }
  );
  return response.data;
};

export const loadStatusOverTime = async (
  params: RetrieveProgramParams
): Promise<StatusOvertimeType[]> => {
  const response = await axios.post<StatusOvertimeType[]>(
    `${baseReportUrl}/api/reports/program/status-overtime`,
    params,
    { headers }
  );
  return response.data;
};

export const loadPersonPer = async (
  params: RetrievePersonParams
): Promise<PersonPerType[]> => {
  const response = await axios.post<PersonPerType[]>(
    `${baseReportUrl}/api/reports/program/persons`,
    params,
    { headers }
  );
  return response.data;
};

export const loadProgramData = async (
  params: RetrieveProgramParams
): Promise<ProgramTableType[]> => {
  const response = await axios.post<ProgramTableType[]>(
    `${baseReportUrl}/api/reports/program/list`,
    params,
    { headers }
  );
  return response.data;
};

export const loadRiskScoreSummary = async (
  params: RetrieveOrgParams
): Promise<RiskScoreSummaryType[]> => {
  const response = await axios.post<RiskScoreSummaryType[]>(
    `${baseReportUrl}/api/reports/organization/risk-score`,
    params,
    { headers }
  );
  return response.data;
};

export const loadOrgRiskIndicator = async (
  params: RetrieveOrgParams
): Promise<IndividualsRiskIndicatorType[]> => {
  const response = await axios.post<IndividualsRiskIndicatorType[]>(
    `${baseReportUrl}/api/reports/organization/risk-indicator`,
    params,
    { headers }
  );
  return response.data;
};

export const loadOrganizationData = async (
  params: RetrieveOrgParams
): Promise<OrganizationTableType[]> => {
  const response = await axios.post<OrganizationTableType[]>(
    `${baseReportUrl}/api/reports/organization/list`,
    params,
    { headers }
  );
  return response.data;
};
