/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */
import { authApi } from '@/redux/apis';
<<<<<<< HEAD
import { readCookie, writeCookie } from './cookies';
=======
>>>>>>> main
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { AccessTokenType } from '@/types';

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

export const checkAuthToken = async (): Promise<AccessTokenType> => {
  const accessToken = readCookie('accessToken');
  const refreshToken = readCookie('refreshToken');

  try {
    const decoded: JwtPayload = jwt_decode(accessToken as string);
    const expirationTime = decoded.exp as number;
    const currentTime = Date.now() / 1000;
    const isExpired = expirationTime < currentTime;

    if (isExpired) {
      const result = await authApi.refreshToken({
        refreshToken: refreshToken as string,
      });

      if (result) {
        writeCookie('accessToken', result?.accessToken ?? '', new Date());
        writeCookie('refreshToken', result?.refreshToken ?? '', new Date());
        return result;
      } else {
        return {
          accessToken: null,
          refreshToken: null,
        };
      }
    } else {
      return {
        accessToken: accessToken as string,
        refreshToken: refreshToken as string,
      };
    }
  } catch (error) {
    return {
      accessToken: null,
      refreshToken: null,
    };
  }
};
