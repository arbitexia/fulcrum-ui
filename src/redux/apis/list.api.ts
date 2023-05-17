/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import {
  RetrieveListParams,
  RetrieveListsParams,
  NewListParams,
  List,
  DeleteListParams,
} from '@/types';
import axios from 'axios';
import config from '@/config';

const baseListsUrl: string = config.URLS.LISTS || '';

const headers = {
  'Access-Control-Allow-Origin': baseListsUrl,
  'Access-Control-Allow-Methods':
    config.ACCESS_CONTROL_ALLOWED_METHODS.LISTS.join(','),
};

export const loadLists = async (
  params: RetrieveListsParams
): Promise<List[]> => {
  const response = await axios.post<List[]>(
    `${baseListsUrl}/api/lists`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const loadList = async (params: RetrieveListParams): Promise<List> => {
  const response = await axios.post<List>(`${baseListsUrl}/api/list`, params, {
    headers,
  });
  return response.data;
};

export const newList = async (params: NewListParams): Promise<void> => {
  await axios.post<void>(`${baseListsUrl}/api/lists/new`, params, {
    headers,
  });
  return;
};

export const deleteList = async (params: DeleteListParams): Promise<string> => {
  await axios.post<void>(`${baseListsUrl}/api/lists/delete`, params, {
    headers,
  });
  return params.listId;
};
