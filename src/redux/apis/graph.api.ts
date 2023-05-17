/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Dan Finkel
 */
import { GraphDataType, PeerDataType, GetGraphParams } from '@/types';
import axios from 'axios';
import config from '@/config';

const baseUrl: string = config.URLS.ENTITY || '';

const headers = {
  'Access-Control-Allow-Origin': config.URLS.ENTITY || '',
  'Access-Control-Allow-Methods':
    config.ACCESS_CONTROL_ALLOWED_METHODS.ENTITY.join(','),
};

export const loadPeerData = async (
  params: GetGraphParams
): Promise<PeerDataType[]> => {
  const response = await axios.post<PeerDataType[]>(
    `${baseUrl}/api/peer`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const loadGraphData = async (
  params: GetGraphParams
): Promise<GraphDataType[]> => {
  const response = await axios.post<GraphDataType[]>(
    `${baseUrl}/api/graph`,
    params,
    {
      headers,
    }
  );
  return response.data;
};
