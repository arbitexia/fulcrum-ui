/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import {
  Filter,
  RetrieveFiltersParams,
  RetrieveFilterParams,
  NewFilterParams,
} from '@/types/models.type';
import axios from 'axios';
import config from '@/config';

const baseUrl: string = config.URLS.LISTS || '';

const headers = {
  'Access-Control-Allow-Origin': baseUrl || '',
  'Access-Control-Allow-Methods':
    config.ACCESS_CONTROL_ALLOWED_METHODS.LISTS.join(','),
};

export const loadFiltersData = async (
  params: RetrieveFiltersParams
): Promise<Filter[]> => {
  const response = await axios.post<Filter[]>(
    `${baseUrl}/api/filters`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const loadFilterData = async (
  params: RetrieveFilterParams
): Promise<Filter> => {
  const response = await axios.post<Filter>(`${baseUrl}/api/filter`, params, {
    headers,
  });
  return response.data;
};

export const createFilter = async (
  params: NewFilterParams
): Promise<string> => {
  const response = await axios.post<string>(
    `${baseUrl}/api/filters/new`,
    params,
    {
      headers,
    }
  );
  return response.data;
};
