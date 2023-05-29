/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */
import { authApi } from '@/redux/apis';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { AccessTokenType } from '@/types';
import { AxiosError } from 'axios';

const writeCookie = (
  name: string,
  value: string,
  date: Date | string | null
): void => {
  if (typeof window === 'undefined') return;
  const expirey = date instanceof Date ? '; expires=' + date : null;
  const cookie = [
    name,
    '=',
    JSON.stringify(value),
    '; domain_.',
    window.location.host.toString(),
    '; path=/;',
    expirey,
  ].join('');
  document.cookie = cookie;
};

const readCookie = (name: string): string | string[] | null => {
  let result: RegExpMatchArray | string | string[] | null =
    document.cookie.match(new RegExp(name + '=([^;]+)'));
  result = result != undefined ? result[1] : [];
  return result;
};

export const genRefreshToken = async (err: AxiosError) => {
  try {
    if (err.response?.status === 401) {
      const refreshToken = readCookie('refreshToken');
      const result = await authApi.refreshToken({
        refreshToken: refreshToken as string,
      });
      writeCookie('accessToken', result?.accessToken ?? '', new Date());
      writeCookie('refreshToken', result?.refreshToken ?? '', new Date());
    }
  } catch (error) {
    throw new Error('Authentication failed');
  }
};
