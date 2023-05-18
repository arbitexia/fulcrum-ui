/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import { noop } from 'lodash';
import { useTheme } from '@mui/system';
import { Tab } from '@mui/material';
import config from '@/config';
import { notifcationTabData, NOTIFICATION_TAB } from '@/constants/notification';
import { UIContainer, UITabWrapper } from '@/components/UI';
import { useAppDispatch } from '@/hooks';
import { DashboardLayout } from '@/layouts';
import { addHours } from '@/libs/time-utils';
import NotificationNavbar from '@/modules/Notifications/NotificationNavbar';
import NotificationsTab from '@/modules/Notifications/NotificationsTab';
import { AccessTokenType } from '@/types';

const baseAuthenticationUrl: string = config.URLS.AUTHENTICATION || '';

const Models = (): JSX.Element => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(['accessToken', 'refreshToken']);
  const { query, isReady } = router as {
    query: AccessTokenType;
    isReady: boolean;
  };
  const {
    accessToken: queryAccessToken = null,
    refreshToken: queryRefreshToken = null,
  } = query as AccessTokenType;

  const { accessToken: cookieAccessToken = null } = cookies as AccessTokenType;

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
        setCookie('accessToken', queryAccessToken, {
          expires: addHours(new Date(), 1),
        });
        setCookie('refreshToken', queryRefreshToken);
      }
    }
  }, [
    isReady,
    cookieAccessToken,
    queryAccessToken,
    queryRefreshToken,
    router,
    dispatch,
    setCookie,
  ]);

  useEffect(() => {
    if (activeTab === NOTIFICATION_TAB.MANAGE) setValue(1);
    if (activeTab === NOTIFICATION_TAB.VIEW) setValue(0);
  }, [activeTab]);

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
                  minWidth: 200,
                  textDecoration: activeTab === url ? 'underline' : 'none',
                  textUnderlineOffset:
                    activeTab === url ? theme.spacing(0.5) : 0,
                },
              }}
            />
          ))}
        </UITabWrapper>
      </UIContainer>
      <UIContainer
        sx={{ background: '#FFFFFF', position: 'relative', top: '-20px' }}
      >
        <NotificationsTab
          isOpenNewDialog={isOpenNewDialog}
          closeNewDlg={() => setOpenDlg(false)}
        />
      </UIContainer>
    </DashboardLayout>
  );
};

export default Models;
