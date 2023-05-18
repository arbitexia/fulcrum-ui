/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { noop } from 'lodash';
import { LinearProgress, Tab } from '@mui/material';
import { useTheme } from '@mui/system';
import { UIContainer, UITabWrapper } from '@/components/UI';
import { DashboardLayout } from '@/layouts';
import GovernancesNavbar from '@/modules/Governances/GovernancesNavbar';
import GovernancesTab from '@/modules/Governances/GovernancesTab';
import { useCookies } from 'react-cookie';
import config from '@/config';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  getUnmaskedEntity,
  getMaskedEntityIdsSelector,
  isGovernanceAutoUnmaskPercentInitializedSelector,
  isGovernanceEntitiestoMaskInitializedSelector,
  isGovernanceRemaskAfterDaysInitializedSelector,
  isGovernanceSystemMaskingInitializedSelector,
  needsEntitiesSelector,
  getEntitiesConfigInitialized,
  retrieveEntitiesConfig,
  retrieveMaskingsByStatus,
  retrieveMaskingSystemAutoUnmaskPercentage,
  retrieveMaskingSystemRemaskDays,
  retrieveMaskingSystemStatus,
  getEntityStatusesEntityIdsSelector,
  isGovernanceEntitiesStatusesInitializedSelector,
  getEntityStatusEvents,
  getAuditEvents,
  isGovernanceAuditEventsInitializedSelector,
  retrieveMaskingSystemAutoUnmaskTopCount,
  isGovernanceAutoUnmaskTopCountInitializedSelector,
  isEntityStatusFailed,
} from '@/redux/slices';
import { GetEntityParams } from '@/types';

const baseAuthenticationUrl: string = config.URLS.AUTHENTICATION || '';

const tabData = [
  {
    label: 'Unmasking Requests',
    url: 'unmask',
  },
  {
    label: 'Usage Logs',
    url: 'usage',
  },
  {
    label: 'Status Change Report',
    url: 'status',
  },
];

const Models = (): JSX.Element => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['accessToken']);
  const { accessToken: cookieAccessToken = null } = cookies as {
    accessToken?: string | null;
  };
  const { query, isReady } = router as {
    query: { type?: string };
    isReady: boolean;
  };
  const { type: activeTab } = query as { type: string };
  const isEntityStatusFailedValue = useAppSelector(isEntityStatusFailed);
  const isGovernanceSystemMaskingInitialized = useAppSelector(
    isGovernanceSystemMaskingInitializedSelector
  );
  const isGovernanceAutoUnmaskPercentInitialized = useAppSelector(
    isGovernanceAutoUnmaskPercentInitializedSelector
  );
  const isGovernanceAutoUnmaskTopCountInitialized = useAppSelector(
    isGovernanceAutoUnmaskTopCountInitializedSelector
  );
  const isGovernanceRemaskAfterDaysInitialized = useAppSelector(
    isGovernanceRemaskAfterDaysInitializedSelector
  );
  const isGovernanceEntitiesToMaskInitialized = useAppSelector(
    isGovernanceEntitiestoMaskInitializedSelector
  );
  const isGovernanceAuditEventsInitialized = useAppSelector(
    isGovernanceAuditEventsInitializedSelector
  );
  const isGovernanceEntityStatusesInitialized = useAppSelector(
    isGovernanceEntitiesStatusesInitializedSelector
  );
  const maskedEntitiesIdsSelector = useAppSelector(getMaskedEntityIdsSelector);
  const needMaskedEntitiesValues = useAppSelector(
    needsEntitiesSelector(maskedEntitiesIdsSelector)
  );
  const entityStatusIdsSelector = useAppSelector(
    getEntityStatusesEntityIdsSelector
  );
  const needEntityStatusIdsSelector = useAppSelector(
    needsEntitiesSelector(entityStatusIdsSelector)
  );

  const isEntitiesConfigInitialized = useAppSelector(
    getEntitiesConfigInitialized
  );
  const [value, setValue] = useState<number>(0);

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
    const tabIndexElement = tabData.find((item) => item.url === activeTab);
    const tabIndex = tabIndexElement ? tabData.indexOf(tabIndexElement) : 0;
    setValue(tabIndex);
  }, [setValue, activeTab]);

  useEffect(() => {
    if (
      activeTab === 'unmask' &&
      cookieAccessToken &&
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
    isGovernanceSystemMaskingInitialized,
    dispatch,
    activeTab,
  ]);

  useEffect(() => {
    if (
      activeTab === 'unmask' &&
      cookieAccessToken &&
      !isGovernanceAutoUnmaskPercentInitialized
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveMaskingSystemAutoUnmaskPercentage({
          accessToken: cookieAccessToken,
        })
      );
    }
  }, [
    cookieAccessToken,
    isGovernanceAutoUnmaskPercentInitialized,
    dispatch,
    activeTab,
  ]);

  useEffect(() => {
    if (
      activeTab === 'unmask' &&
      cookieAccessToken &&
      !isGovernanceAutoUnmaskTopCountInitialized
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveMaskingSystemAutoUnmaskTopCount({
          accessToken: cookieAccessToken,
        })
      );
    }
  }, [
    cookieAccessToken,
    isGovernanceAutoUnmaskTopCountInitialized,
    dispatch,
    activeTab,
  ]);

  useEffect(() => {
    if (
      activeTab === 'unmask' &&
      cookieAccessToken &&
      !isGovernanceRemaskAfterDaysInitialized
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveMaskingSystemRemaskDays({ accessToken: cookieAccessToken })
      );
    }
  }, [
    cookieAccessToken,
    isGovernanceRemaskAfterDaysInitialized,
    dispatch,
    activeTab,
  ]);

  useEffect(() => {
    if (
      activeTab === 'unmask' &&
      cookieAccessToken &&
      !isGovernanceEntitiesToMaskInitialized
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveMaskingsByStatus({
          accessToken: cookieAccessToken,
          status: 'in-review',
        })
      );
    }
  }, [
    cookieAccessToken,
    isGovernanceEntitiesToMaskInitialized,
    dispatch,
    activeTab,
  ]);

  useEffect(() => {
    if (
      activeTab === 'unmask' &&
      isGovernanceEntitiesToMaskInitialized &&
      !isEntitiesConfigInitialized &&
      cookieAccessToken
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveEntitiesConfig({ accessToken: cookieAccessToken }));
    }
  }, [
    dispatch,
    isEntitiesConfigInitialized,
    cookieAccessToken,
    isGovernanceEntitiesToMaskInitialized,
    activeTab,
  ]);

  useEffect(() => {
    if (
      activeTab === 'usage' &&
      !isGovernanceAuditEventsInitialized &&
      cookieAccessToken
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getAuditEvents({
          accessToken: cookieAccessToken,
          limit: 10000,
        })
      );
    }
  }, [
    activeTab,
    isGovernanceAuditEventsInitialized,
    cookieAccessToken,
    dispatch,
  ]);

  useEffect(() => {
    if (
      activeTab === 'status' &&
      !isGovernanceEntityStatusesInitialized &&
      cookieAccessToken
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getEntityStatusEvents({
          accessToken: cookieAccessToken,
        })
      );
    }
  }, [
    activeTab,
    isGovernanceEntityStatusesInitialized,
    cookieAccessToken,
    dispatch,
  ]);

  useEffect(() => {
    const dispatchGetEntity = (args: GetEntityParams): Promise<void> => {
      return new Promise<void>((resolve) => {
        dispatch(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          getUnmaskedEntity(args)
        );
        resolve();
      });
    };

    if (
      activeTab === 'unmask' &&
      isGovernanceEntitiesToMaskInitialized &&
      cookieAccessToken &&
      !isEntityStatusFailedValue &&
      needMaskedEntitiesValues &&
      needMaskedEntitiesValues.length > 0
    ) {
      const getEntityPromises = needMaskedEntitiesValues.map((entityId) => {
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
    needMaskedEntitiesValues,
    isGovernanceEntitiesToMaskInitialized,
    isEntityStatusFailedValue,
    dispatch,
    activeTab,
  ]);

  useEffect(() => {
    const dispatchGetEntity = (args: GetEntityParams): Promise<void> => {
      return new Promise<void>((resolve) => {
        dispatch(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          getUnmaskedEntity(args)
        );
        resolve();
      });
    };

    if (
      activeTab === 'status' &&
      isGovernanceEntityStatusesInitialized &&
      cookieAccessToken &&
      !isEntityStatusFailedValue &&
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
    needEntityStatusIdsSelector,
    isGovernanceEntityStatusesInitialized,
    dispatch,
    activeTab,
  ]);

  const handleTabChange = (val: string): void => {
    router.push(`/governance/${val}`).then(noop);
  };

  if (!cookieAccessToken) {
    return <LinearProgress />;
  }

  return (
    <DashboardLayout
      title="Governance"
      navbarBorder={false}
      navEls={<GovernancesNavbar />}
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
          {tabData?.map(({ label, url }, index) => (
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
                  minWidth: '155px',
                },
                '&.MuiTab-root:nth-of-type(3)': {
                  minWidth: '200px',
                },
              }}
            />
          ))}
        </UITabWrapper>
      </UIContainer>
      <UIContainer
        sx={{ background: '#FFFFFF', position: 'relative', top: '-16px' }}
      >
        {cookieAccessToken && (
          <GovernancesTab url={activeTab} accessToken={cookieAccessToken} />
        )}
      </UIContainer>
    </DashboardLayout>
  );
};

export default Models;
