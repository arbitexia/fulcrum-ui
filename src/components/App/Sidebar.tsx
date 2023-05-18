/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useEffect } from 'react';
import { Badge, Box, Drawer, Tooltip } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { appImageLoader } from '@/libs/image-loader';
import { UIFlexCenterBox, UIFlexColumnBox } from '@/components/UI';
import { sidebarMenus } from '@/constants';
import {
  getNotificationEventsCount,
  isNotificationEventsInitializedSelector,
  isNotificationsInitializedSelector,
  retrieveNotificationEvents,
  retrieveNotifications,
} from '@/redux/slices';
import { useCookies } from 'react-cookie';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { SideBarMenu } from '@/constants/home';

const AppSidebar = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isNotificationsInitialized: boolean = useAppSelector(
    isNotificationsInitializedSelector
  );
  const isNotificationEventsInitialized: boolean = useAppSelector(
    isNotificationEventsInitializedSelector
  );
  const notificationEventsCount: number = useAppSelector(
    getNotificationEventsCount
  );
  const [cookies] = useCookies(['accessToken']);
  const { isReady } = router as {
    isReady: boolean;
  };
  const { accessToken: cookieAccessToken = null } = cookies as {
    accessToken?: string | null;
  };
  useEffect(() => {
    if (isReady && cookieAccessToken && !isNotificationEventsInitialized) {
      if (!isNotificationsInitialized) {
        dispatch(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          retrieveNotifications({
            accessToken: cookieAccessToken,
          })
        );
      }
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveNotificationEvents({
          accessToken: cookieAccessToken,
        })
      );
    }
  }, [
    dispatch,
    isReady,
    cookieAccessToken,
    isNotificationsInitialized,
    isNotificationEventsInitialized,
  ]);

  const getNotificationsItem = (
    el: SideBarMenu,
    index: number,
    count: number
  ): JSX.Element => (
    <Tooltip
      title={el.title}
      key={index}
      placement="right"
      style={{ cursor: 'pointer' }}
    >
      <Box>
        {count !== null && count > 0 && (
          <Badge badgeContent={count} color="error">
            <Image
              src={el.imgPath}
              width={24}
              height={24}
              loader={appImageLoader}
              alt={el.title}
              onClick={() => router.push(el.route)}
            />
          </Badge>
        )}
        {(count === null || count <= 0) && (
          <Image
            src={el.imgPath}
            width={24}
            height={24}
            loader={appImageLoader}
            alt={el.title}
            onClick={() => router.push(el.route)}
          />
        )}
      </Box>
    </Tooltip>
  );

  const specialRenderItems: {
    [name: string]: (
      el: SideBarMenu,
      index: number,
      count: number
    ) => JSX.Element;
  } = {
    notifications: getNotificationsItem,
  };

  const getStandardItem = (
    el: SideBarMenu,
    index: number,
    _count: number
  ): JSX.Element => (
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
          onClick={() => router.push(el.route)}
        />
      </Box>
    </Tooltip>
  );

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
        {sidebarMenus.map((el, index) => {
          const showSpecialRenderItem =
            el.name in specialRenderItems
              ? isNotificationsInitialized && isNotificationEventsInitialized
              : true;
          const displayItem = el.display !== false && showSpecialRenderItem;
          const itemRenderer =
            el.name in specialRenderItems
              ? specialRenderItems[el.name]
              : getStandardItem;
          return (
            displayItem && itemRenderer(el, index, notificationEventsCount)
          );
        })}
      </UIFlexColumnBox>
    </Drawer>
  );
};

export default AppSidebar;
