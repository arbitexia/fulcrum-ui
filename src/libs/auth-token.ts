/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */
import { authApi } from '@/redux/apis';
import { AxiosError } from 'axios';
import { readCookie, writeCookie } from './cookie-utils';

export const genRefreshToken = async (err: AxiosError): Promise<void> => {
  try {
    if (err.response?.status === 401) {
      const refreshToken = readCookie('refreshToken');
      const result = await authApi.refreshToken({
        refreshToken: refreshToken as string,
      });
      writeCookie('accessToken', result?.accessToken ?? '');
      writeCookie('refreshToken', result?.refreshToken ?? '');
    }
  } catch (error) {
    throw new Error('Authentication failed');
  }
};
