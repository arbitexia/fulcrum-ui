/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { noop } from 'lodash';
import { useTheme } from '@mui/system';
import { LinearProgress, Tab } from '@mui/material';
import config from '@/config';
import { notifcationTabData, NOTIFICATION_TAB } from '@/constants/notification';
import { UIContainer, UITabWrapper } from '@/components/UI';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { DashboardLayout } from '@/layouts';
import NotificationNavbar from '@/modules/Notifications/NotificationNavbar';
import NotificationsTab from '@/modules/Notifications/NotificationsTab';
import { AccessTokenType } from '@/types';
import {
  createNotification,
  getEntitiesConfigInitialized,
  getEntity,
  getIsAttributesInitialized,
  getNotificationEventsEntityIds,
  isEntityStatusFailed,
  isGovernanceSystemMaskingInitializedSelector,
  isModelsInitialized,
  isNotificationEventsInitializedSelector,
  isNotificationsInitializedSelector,
  needsEntitiesSelector,
  retrieveAttributes,
  retrieveEntitiesConfig,
  retrieveMaskingSystemStatus,
  retrieveModels,
  retrieveNotificationEvents,
  retrieveNotifications,
} from '@/redux/slices';
import { NewNotificationParams } from '@/types/notification.type';
import { GetEntityParams } from '@/types';
import { readCookie, writeCookie } from '@/libs/cookie-utils';

const baseAuthenticationUrl: string = config.URLS.AUTHENTICATION || '';

const Models = (): JSX.Element => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isEntityStatusFailedValue = useAppSelector(isEntityStatusFailed);
  const modelsListInitialized: boolean = useAppSelector(isModelsInitialized);
  const attributesListInitialized: boolean = useAppSelector(
    getIsAttributesInitialized
  );
  const isEntitiesConfigInitialized = useAppSelector(
    getEntitiesConfigInitialized
  );
  const isNotificationsInitialized: boolean = useAppSelector(
    isNotificationsInitializedSelector
  );
  const isNotificationEventsInitialized: boolean = useAppSelector(
    isNotificationEventsInitializedSelector
  );
  const isGovernanceSystemMaskingInitialized = useAppSelector(
    isGovernanceSystemMaskingInitializedSelector
  );
  const notificationEntityIds: string[] = useAppSelector(
    getNotificationEventsEntityIds
  );
  const needEntityStatusIdsSelector = useAppSelector(
    needsEntitiesSelector(notificationEntityIds)
  );
  const { query, isReady } = router as {
    query: AccessTokenType;
    isReady: boolean;
  };
  const {
    accessToken: queryAccessToken = null,
    refreshToken: queryRefreshToken = null,
  } = query as AccessTokenType;

  const cookieAccessToken = readCookie('accessToken');

  const { type: activeTab } = router.query as { type: string };

  const [value, setValue] = useState<number>(0);
  const [isOpenNewDialog, setOpenDlg] = useState<boolean>(false);

  const handleTabChange = (val: string): void => {
    router.push(`/notifications/${val}`).then(noop);
  };

  useEffect(() => {
    if (isReady) {
      if (!cookieAccessToken && !queryAccessToken) {
        router
          .push(
            `${baseAuthenticationUrl}/login/${config.AUTHENTICATION_SERVICE}`
          )
          .then(noop);
      } else if (!cookieAccessToken && queryAccessToken) {
        writeCookie('accessToken', queryAccessToken);
        writeCookie('refreshToken', queryRefreshToken ?? '');
      }
    }
  }, [
    isReady,
    cookieAccessToken,
    queryAccessToken,
    queryRefreshToken,
    router,
    dispatch,
  ]);

  useEffect(() => {
    if (!modelsListInitialized && cookieAccessToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveModels({ accessToken: cookieAccessToken, limit: 3000 }));
    }
  }, [dispatch, modelsListInitialized, cookieAccessToken]);

  useEffect(() => {
    if (!attributesListInitialized && cookieAccessToken) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveAttributes({ accessToken: cookieAccessToken, limit: 3000 })
      );
    }
  }, [dispatch, attributesListInitialized, cookieAccessToken]);

  useEffect(() => {
    if (!isEntitiesConfigInitialized && cookieAccessToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveEntitiesConfig({ accessToken: cookieAccessToken }));
    }
  }, [isEntitiesConfigInitialized, dispatch, cookieAccessToken]);

  useEffect(() => {
    if (
      isReady &&
      modelsListInitialized &&
      cookieAccessToken &&
      activeTab === NOTIFICATION_TAB.VIEW &&
      isEntitiesConfigInitialized &&
      !isNotificationEventsInitialized
    ) {
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
    activeTab,
    cookieAccessToken,
    isEntitiesConfigInitialized,
    isNotificationsInitialized,
    isNotificationEventsInitialized,
    modelsListInitialized,
  ]);

  useEffect(() => {
    if (
      isReady &&
      modelsListInitialized &&
      cookieAccessToken &&
      activeTab === NOTIFICATION_TAB.MANAGE &&
      !isNotificationsInitialized
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveNotifications({
          accessToken: cookieAccessToken,
        })
      );
    }
  }, [
    dispatch,
    isReady,
    activeTab,
    cookieAccessToken,
    isNotificationsInitialized,
    modelsListInitialized,
  ]);

  useEffect(() => {
    if (
      activeTab === NOTIFICATION_TAB.VIEW &&
      cookieAccessToken &&
      isEntitiesConfigInitialized &&
      !isGovernanceSystemMaskingInitialized
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveMaskingSystemStatus({ accessToken: cookieAccessToken })
      );
    }
  }, [
    cookieAccessToken,
    isEntitiesConfigInitialized,
    isGovernanceSystemMaskingInitialized,
    dispatch,
    activeTab,
  ]);

  useEffect(() => {
    const dispatchGetEntity = (args: GetEntityParams): Promise<void> => {
      return new Promise<void>((resolve) => {
        dispatch(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          getEntity(args)
        );
        resolve();
      });
    };

    if (
      activeTab === NOTIFICATION_TAB.VIEW &&
      !isEntityStatusFailedValue &&
      isEntitiesConfigInitialized &&
      isGovernanceSystemMaskingInitialized &&
      isNotificationsInitialized &&
      isNotificationEventsInitialized &&
      cookieAccessToken &&
      needEntityStatusIdsSelector &&
      needEntityStatusIdsSelector.length > 0
    ) {
      const getEntityPromises = needEntityStatusIdsSelector.map((entityId) => {
        return dispatchGetEntity({
          accessToken: cookieAccessToken,
          entityId,
          unmaskToken: '',
        });
      });
      Promise.all(getEntityPromises).then(noop);
    }
  }, [
    cookieAccessToken,
    isEntityStatusFailedValue,
    isEntitiesConfigInitialized,
    needEntityStatusIdsSelector,
    isGovernanceSystemMaskingInitialized,
    isNotificationsInitialized,
    isNotificationEventsInitialized,
    dispatch,
    activeTab,
  ]);

  useEffect(() => {
    if (activeTab === NOTIFICATION_TAB.MANAGE) setValue(1);
    if (activeTab === NOTIFICATION_TAB.VIEW) setValue(0);
  }, [activeTab]);

  const onSubmit = ({
    notificationId,
    notificationType,
    modelId,
    categoryName,
    threshold,
    active = true,
  }: {
    notificationId: string | null;
    notificationType: string;
    modelId: string;
    categoryName: string;
    threshold: number;
    active?: boolean;
  }): void => {
    if (cookieAccessToken && notificationId !== null) {
      const args: NewNotificationParams = {
        accessToken: cookieAccessToken,
        notificationId: notificationId,
        name: notificationId,
        active,
        notificationType,
        modelId,
        category: categoryName,
        threshold: threshold,
      };
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        createNotification(args)
      );
    }
  };

  if (!cookieAccessToken) {
    return <LinearProgress />;
  }

  return (
    <DashboardLayout
      title="Notifications"
      navbarBorder={false}
      navEls={<NotificationNavbar openNewDlg={() => setOpenDlg(true)} />}
    >
      <UIContainer
        sx={{
          position: 'relative',
          zIndex: 10,
          padding: theme.spacing(2, 0),
          [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(2, 0),
          },
        }}
      >
        <UITabWrapper
          onChange={(_, newValue?: number) => setValue(newValue ? newValue : 0)}
          value={value}
        >
          {notifcationTabData?.map(({ label, url }, index) => (
            <Tab
              key={`notification-${activeTab}-${label}-${index}`}
              disableRipple
              label={label}
              onClick={() => handleTabChange(url)}
              sx={{
                '&.MuiTab-root': {
                  minWidth: '200px',
                  textDecoration: activeTab === url ? 'underline' : 'none',
                  textUnderlineOffset:
                    activeTab === url ? theme.spacing(0.5) : 0,
                },
                '&.MuiTab-root:nth-of-type(1)': {
                  minWidth: '140px',
                },
              }}
            />
          ))}
        </UITabWrapper>
      </UIContainer>
      {cookieAccessToken && (
        <UIContainer
          sx={{ background: '#FFFFFF', position: 'relative', top: '-20px' }}
        >
          <NotificationsTab
            isOpenNewDialog={isOpenNewDialog}
            closeNewDlg={() => setOpenDlg(false)}
            openNewDlg={() => setOpenDlg(true)}
            accessToken={cookieAccessToken}
            onSubmit={onSubmit}
          />
        </UIContainer>
      )}
    </DashboardLayout>
  );
};

export default Models;
