/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import {
  Model,
  RetrieveModelParams,
  RetrieveModelsParams,
  NewModelParams,
  RetrieveModelsIdsParams,
  RetrieveAttributeParams,
  RetrieveAttributesIdsParams,
  NewAttributeParams,
  RetrieveAttributesParams,
  RiskIndicatorType,
  DeleteModelParams,
  DeleteAttributeParams,
} from '@/types/models.type';
import axios from 'axios';
import config from '@/config';

const baseModelUrl: string = config.URLS.MODEL || '';

const headers = {
  'Access-Control-Allow-Origin': baseModelUrl,
  'Access-Control-Allow-Methods':
    config.ACCESS_CONTROL_ALLOWED_METHODS.MODEL.join(','),
};

export const loadModelsData = async (
  params: RetrieveModelsParams
): Promise<Model[]> => {
  const response = await axios.post<Model[]>(
    `${baseModelUrl}/api/models`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const loadModelIdsData = async (
  params: RetrieveModelsIdsParams
): Promise<string[]> => {
  const response = await axios.post<string[]>(
    `${baseModelUrl}/api/models/ids`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const loadModelData = async (
  params: RetrieveModelParams
): Promise<Model> => {
  const response = await axios.post<Model>(
    `${baseModelUrl}/api/model`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const createModel = async (params: NewModelParams): Promise<string> => {
  const response = await axios.post<string>(
    `${baseModelUrl}/api/models/new`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const deleteModel = async (
  params: DeleteModelParams
): Promise<string> => {
  await axios.post<void>(`${baseModelUrl}/api/model/delete`, params, {
    headers,
  });
  return params.modelId;
};

export const loadAttributesData = async (
  params: RetrieveAttributesParams
): Promise<RiskIndicatorType[]> => {
  const response = await axios.post<RiskIndicatorType[]>(
    `${baseModelUrl}/api/attributes`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const loadAttributesIdsData = async (
  params: RetrieveAttributesIdsParams
): Promise<string[]> => {
  const response = await axios.post<string[]>(
    `${baseModelUrl}/api/attributes/ids`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const loadAttributeData = async (
  params: RetrieveAttributeParams
): Promise<RiskIndicatorType> => {
  const response = await axios.post<RiskIndicatorType>(
    `${baseModelUrl}/api/attribute`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const createAttribute = async (
  params: NewAttributeParams
): Promise<string> => {
  const response = await axios.post<string>(
    `${baseModelUrl}/api/attributes/new`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const deleteAttribute = async (
  params: DeleteAttributeParams
): Promise<string> => {
  await axios.post<void>(`${baseModelUrl}/api/attribute/delete`, params, {
    headers,
  });
  return params.attributeId;
};
