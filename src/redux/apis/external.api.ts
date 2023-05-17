/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Dan Finkel
 */
import {
  GetEntityParams,
  ExternalApplication,
  NewExternalParams,
} from '@/types';
import axios from 'axios';
import config from '@/config';

const baseUrl: string = config.URLS.ENTITY || '';

const headers = {
  'Access-Control-Allow-Origin': config.URLS.ENTITY || '',
  'Access-Control-Allow-Methods':
    config.ACCESS_CONTROL_ALLOWED_METHODS.ENTITY.join(','),
};

export const loadExternalData = async (
  params: GetEntityParams
): Promise<ExternalApplication[]> => {
  const response = await axios.post<ExternalApplication[]>(
    `${baseUrl}/api/externals`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const createExternalApplication = async (
  params: NewExternalParams
): Promise<string> => {
  const response = await axios.post<string>(
    `${baseUrl}/api/externals/new`,
    params,
    {
      headers,
    }
  );
  return response.data;
};
