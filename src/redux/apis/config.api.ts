/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import {
  DataSourceDescriptorConfig,
  GetDataSourceConfigParams,
  EntitiesDescriptorConfig,
  GetEntitiesConfigParams,
} from '@/types';
import axios from 'axios';
import config from '@/config';
import {
  GetRiskIndicatorConfigParams,
  RiskIndicatorConfig,
} from '@/types/config.type';

const baseConfigUrl: string = config.URLS.CONFIG || '';

const headers = {
  'Access-Control-Allow-Origin': baseConfigUrl,
  'Access-Control-Allow-Methods':
    config.ACCESS_CONTROL_ALLOWED_METHODS.CONFIG.join(','),
};

export const loadDataSourceConfig = async (
  params: GetDataSourceConfigParams
): Promise<DataSourceDescriptorConfig> => {
  const response = await axios.post<DataSourceDescriptorConfig>(
    `${baseConfigUrl}/api/config/dataspec`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const loadEntitiesDisplayConfig = async (
  params: GetEntitiesConfigParams
): Promise<EntitiesDescriptorConfig> => {
  const response = await axios.post<EntitiesDescriptorConfig>(
    `${baseConfigUrl}/api/config/entities-config`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const loadRiskIndicatorsConfig = async (
  params: GetRiskIndicatorConfigParams
): Promise<RiskIndicatorConfig> => {
  const response = await axios.post<RiskIndicatorConfig>(
    `${baseConfigUrl}/api/config/risk-indicators-config`,
    params,
    {
      headers,
    }
  );
  return response.data;
};
