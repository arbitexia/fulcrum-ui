/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { Box, Drawer, Tooltip } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { appImageLoader } from '@/libs/image-loader';
import { UIFlexCenterBox, UIFlexColumnBox } from '@/components/UI';
import { sidebarMenus } from '@/constants';
import { useAppDispatch } from '@/hooks';
import { clearStateAccessToken } from '@/redux/slices';
import config from '@/config';

const baseAuthenticationUrl: string = config.URLS.AUTHENTICATION || '';

const AppSidebar = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': {
          width: 96,
          border: 'none',
          boxSizing: 'border-box',
          boxShadow: '0px 4px 18px #1111111a',
          zIndex: 99,
        },
      }}
    >
      <UIFlexCenterBox sx={{ height: 89 }}>
        <Image
          src="images/icons/logo.svg"
          loader={appImageLoader}
          width={42}
          height={42}
          onClick={() => router.push('/home')}
          alt="logo"
        />
      </UIFlexCenterBox>
      <UIFlexColumnBox sx={{ gap: '35px', paddingTop: '45px' }}>
        {sidebarMenus.map((el, index) => (
          <Tooltip
            title={el.title}
            key={index}
            placement="right"
            style={{ cursor: 'pointer' }}
          >
            <Box>
              <Image
                src={el.imgPath}
                width={22}
                height={22}
                loader={appImageLoader}
                alt={el.title}
                onClick={() => {
                  if (el.route === '/logout') {
                    dispatch(clearStateAccessToken());
                    router.push(
                      `${baseAuthenticationUrl}/login/${config.AUTHENTICATION_SERVICE}`
                    );
                  } else router.push(el.route);
                }}
              />
            </Box>
          </Tooltip>
        ))}
      </UIFlexColumnBox>
    </Drawer>
  );
};

export default AppSidebar;
