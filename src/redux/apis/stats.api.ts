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
} from '@/types/stats.type';

const baseStatsUrl: string = config.URLS.STATS || '';

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
): Promise<Stats> => {
  const response = await axios.post<Stats>(
    `${baseStatsUrl}/api/stat/latest`,
    params,
    {
      headers,
    }
  );
  return { ...response.data, modelId: params.modelId };
};

export const deleteStatData = async (
  params: DeleteStatParams
): Promise<string> => {
  await axios.post<Stats>(`${baseStatsUrl}/api/stat/delete`, params, {
    headers,
  });
  return params.modelId;
};
