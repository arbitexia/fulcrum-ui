/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import config from '@/config';
import { useCookies } from 'react-cookie';
import { noop } from 'lodash';
import { LinearProgress } from '@mui/material';

const baseAuthenticationUrl: string = config.URLS.AUTHENTICATION || '';

const Home = (): JSX.Element => {
  const router = useRouter();
  const [cookies] = useCookies(['accessToken']);
  const { accessToken: cookieAccessToken = null } = cookies as {
    accessToken?: string | null;
  };
  const { isReady } = router as {
    query: { accessToken?: string | null };
    isReady: boolean;
  };
  useEffect(() => {
    if (isReady) {
      if (!cookieAccessToken) {
        router
          .push(
            `${baseAuthenticationUrl}/login/${config.AUTHENTICATION_SERVICE}`
          )
          .then(noop);
      } else {
        router.push(`/home`);
      }
    }
  }, [isReady, cookieAccessToken, router]);

  return <LinearProgress />;
};

export default Home;
