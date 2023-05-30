/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import config from '@/config';
import { deleteCookie } from '@/libs/cookie-utils';
import { useRouter } from 'next/router';

const baseAuthenticationUrl: string = config.URLS.AUTHENTICATION || '';

const LogoutPage = (): null => {
  const router = useRouter();
  deleteCookie('accessToken');
  deleteCookie('refreshToken');
  router.push(
    `${baseAuthenticationUrl}/logout/${config.AUTHENTICATION_SERVICE}`
  );
  return null;
};

export default LogoutPage;
