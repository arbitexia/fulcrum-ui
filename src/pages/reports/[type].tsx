/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/layouts';
import { UIContainer, UITabWrapper } from '@/components/UI';
import { OrganizationTab, ProgramTab, ReportsNavBar } from '@/modules/Reports';
import { useTheme } from '@mui/system';
import { Tab, LinearProgress, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { noop } from 'lodash';
import { reportsTabData } from '@/constants';
import { useCookies } from 'react-cookie';
import { AccessTokenType } from '@/types';
import config from '@/config';

const baseAuthenticationUrl: string = config.URLS.AUTHENTICATION || '';
const ReportsPage = (): JSX.Element => {
  const theme = useTheme();
  const router = useRouter();
  const { type: activeTab } = router.query as { type: string };
  const [value, setValue] = useState<number>(0);

  const [cookies] = useCookies(['accessToken']);
  const { accessToken: cookieAccessToken = null } = cookies as AccessTokenType;
  const { isReady } = router as {
    query: { type?: string };
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
      }
    }
  }, [isReady, cookieAccessToken, router]);

  useEffect(() => {
    const tabIndexElement = reportsTabData.find(
      (item) => item.url === activeTab
    );
    const tabIndex = tabIndexElement
      ? reportsTabData.indexOf(tabIndexElement)
      : 0;
    setValue(tabIndex);
  }, [setValue, activeTab]);

  const handleTabChange = (val: string): void => {
    router.push(`/reports/${val}`).then(noop);
  };

  if (!cookieAccessToken) {
    return <LinearProgress />;
  }

  return (
    <DashboardLayout
      title="Reports"
      navbarBorder={false}
      navEls={<ReportsNavBar />}
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
          noBorder={true}
          sx={{ padding: '0 38px' }}
        >
          {reportsTabData?.map(({ label, url }, index) => (
            <Tab
              key={index}
              disableRipple
              label={label}
              onClick={() => handleTabChange(url)}
              sx={{
                '&.MuiTab-root': {
                  minWidth: '110px',
                  textDecoration: activeTab === url ? 'underline' : 'none',
                  textUnderlineOffset:
                    activeTab === url ? theme.spacing(0.5) : 0,
                },
                '&.MuiTab-root:nth-of-type(1)': {
                  minWidth: '160px',
                },
                '&.MuiTab-root:nth-of-type(2)': {
                  minWidth: '220px',
                },
              }}
            />
          ))}
        </UITabWrapper>
        <Box sx={{ background: '#FFFFFF' }}>
          {activeTab === 'program-metrics' && (
            <ProgramTab accessToken={cookieAccessToken} />
          )}
          {activeTab === 'organization-metrics' && (
            <OrganizationTab accessToken={cookieAccessToken} />
          )}
        </Box>
      </UIContainer>
    </DashboardLayout>
  );
};

export default ReportsPage;
