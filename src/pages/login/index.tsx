/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import config from '@/config';
import { useRouter } from 'next/router';

const baseAuthenticationUrl: string = config.URLS.AUTHENTICATION || '';

const LoginPage = (): null => {
  const router = useRouter();
  router.push(
    `${baseAuthenticationUrl}/login/${config.AUTHENTICATION_SERVICE}`
  );
  return null;
};

export default LoginPage;
