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
import { ReportsNavBar, ReportsTabs } from '@/modules/Reports';
import { useTheme } from '@mui/system';
import { Tab } from '@mui/material';
import { useRouter } from 'next/router';
import { noop } from 'lodash';
import { reportsTabData } from '@/constants';

const ReportsPage = (): JSX.Element => {
  const theme = useTheme();
  const router = useRouter();
  const { type: activeTab } = router.query as { type: string };
  const [value, setValue] = useState<number>(0);

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
      </UIContainer>
      <UIContainer
        sx={{ background: '#FFFFFF', position: 'relative', top: '-16px' }}
      >
        <ReportsTabs url={activeTab} />
      </UIContainer>
    </DashboardLayout>
  );
};

export default ReportsPage;
