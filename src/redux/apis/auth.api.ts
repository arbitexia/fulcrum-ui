/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */
import { AccessTokenType } from '@/types';
import axios from 'axios';
import config from '@/config';

const baseConfigUrl: string = config.URLS.CONFIG || '';

const headers = {
  'Access-Control-Allow-Origin': baseConfigUrl,
  'Access-Control-Allow-Methods':
    config.ACCESS_CONTROL_ALLOWED_METHODS.CONFIG.join(','),
};

export const refreshToken = async (
  params: AccessTokenType
): Promise<AccessTokenType> => {
  const response = await axios.post(`${baseConfigUrl}/api/refresh`, params, {
    headers,
  });
  return response.data;
};
