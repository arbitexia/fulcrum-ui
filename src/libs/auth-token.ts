/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */
import { authApi } from '@/redux/apis';
import { readCookie, writeCookie } from './cookie-utils';
import jwt_decode, { JwtPayload } from 'jwt-decode';

export const isAccessTokenValid = async (): Promise<void> => {
  try {
    const accessToken = readCookie('accessToken');
    const refreshToken = readCookie('refreshToken');
    const decoded: JwtPayload = jwt_decode(accessToken as string);
    const expirationTime = decoded.exp as number;
    const currentTime = Date.now() / 1000;
    const isExpired = expirationTime < currentTime;
    if (isExpired) {
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
