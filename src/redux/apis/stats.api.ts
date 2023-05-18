/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import axios from 'axios';
import config from '@/config';
import {
  Stats,
  GetLatestStatParams,
  GetStatsParams,
  DeleteStatParams,
  DatasourceStatsParam,
  DataSourceStats,
  DataSourceStatsJson,
  StatsBackend,
  StatsBackendPayload,
  GetYearStatsByStatusParam,
  YearStatsByStatus,
  YearStatsByStatusResponse,
  TopRiskIndicatorPercentage,
  TopRiskIndicatorPercentageParam,
  TriageAndAverageScore,
  TriageAndAverageScoreParam,
  TopRiskIndicatorPercentageResponse,
  TriageAndAverageScoreResponse,
} from '@/types/stats.type';

const baseStatsUrl: string = config.URLS.STATS || '';

const baseEntityUrl: string = config.URLS.ENTITY || '';

const baseScoringUrl: string = config.URLS.SCORING || '';

const headers = {
  'Access-Control-Allow-Origin': baseStatsUrl,
  'Access-Control-Allow-Methods':
    config.ACCESS_CONTROL_ALLOWED_METHODS.STATS.join(','),
};

export const loadStatsData = async (
  params: GetStatsParams
): Promise<Stats[]> => {
  const response = await axios.post<Stats[]>(
    `${baseStatsUrl}/api/stats`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const loadLatestStatData = async (
  params: GetLatestStatParams
): Promise<StatsBackendPayload> => {
  const response = await axios.post<StatsBackend[]>(
    `${baseStatsUrl}/api/stat/latest`,
    params,
    {
      headers,
    }
  );
  const statsBackend = response.data.map((statBackend: StatsBackend) => {
    return {
      ...statBackend,
      modelId: params.modelId,
    };
  });
  return { statsBackend, modelId: params.modelId };
};

export const deleteStatData = async (
  params: DeleteStatParams
): Promise<string> => {
  await axios.post<Stats>(`${baseStatsUrl}/api/stat/delete`, params, {
    headers,
  });
  return params.modelId;
};

export const loadDataSourceStats = async (
  params: DatasourceStatsParam
): Promise<DataSourceStats> => {
  const response = await axios.post<DataSourceStatsJson>(
    `${baseStatsUrl}/api/stats/data`,
    params,
    {
      headers,
    }
  );
  const data = response.data;
  const dataJsonStr = data.dataStatsJson;
  const dataJson = JSON.parse(dataJsonStr);
  return dataJson;
};

export const loadYearStatsByStatus = async (
  params: GetYearStatsByStatusParam
): Promise<YearStatsByStatus> => {
  const response = await axios.post<YearStatsByStatusResponse>(
    `${baseEntityUrl}/api/entity/statuses/year`,
    params,
    {
      headers,
    }
  );
  return { entityStatus: params.entityStatus, count: response.data.count };
};

export const loadTopRiskIndicatorsPercentage = async (
  params: TopRiskIndicatorPercentageParam
): Promise<TopRiskIndicatorPercentageResponse> => {
  const response = await axios.post<TopRiskIndicatorPercentage[]>(
    `${baseStatsUrl}/api/stat/top/attributes`,
    params,
    {
      headers,
    }
  );
  return { modelId: params.modelId, riskIndicatorPercentages: response.data };
};

export const loadTriageAndAverageScores = async (
  params: TriageAndAverageScoreParam
): Promise<TriageAndAverageScoreResponse> => {
  const response = await axios.post<TriageAndAverageScore>(
    `${baseScoringUrl}/api/scoring/entity/top`,
    params,
    {
      headers,
    }
  );
  return { modelId: params.modelId, ...response.data };
};
