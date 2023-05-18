/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import config from '@/config';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';

const EPOCH_START: Date = new Date(0);

const baseAuthenticationUrl: string = config.URLS.AUTHENTICATION || '';

const LogoutPage = (): null => {
  const router = useRouter();
  const [_cookies, setCookie] = useCookies(['accessToken', 'refreshToken']);
  setCookie('accessToken', '', { expires: EPOCH_START });
  setCookie('refreshToken', '');
  router.push(
    `${baseAuthenticationUrl}/logout/${config.AUTHENTICATION_SERVICE}`
  );
  return null;
};

export default LogoutPage;
