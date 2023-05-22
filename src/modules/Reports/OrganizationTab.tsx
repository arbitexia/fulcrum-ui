/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { UIFlexCenterBox, UISelect } from '@/components/UI';
import { UIFlexEndBox } from '@/components/UI/Box';
import {
  chartDataRiskIndicator,
  chartDataTotalRiskScore,
  modelList,
  organizationMetricsColumns,
  organizationTableData,
  populationList,
} from '@/_mock';
import ReportsTable from './ReportsTable';
import { ReportsBarChart } from './Detail/BarChart';

const OrganizationTab = (): JSX.Element => {
  const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [100, 200, 300, 400, 500],
        backgroundColor: 'rgb(39 123 210)',
      },
    ],
  };

  return (
    <Box>
      <UIFlexEndBox sx={{ gap: 4, mt: 2 }}>
        <UISelect
          value={1}
          itemList={modelList.items}
          label={modelList.label}
          handleChange={(event) => {
            // handleChange(event, 'changePopulation');
          }}
        />
        <UISelect
          value={1}
          itemList={populationList.items}
          handleChange={(event) => {}}
          label={populationList.label}
        />
      </UIFlexEndBox>
      <Typography sx={{ fontSize: '20px', fontWeight: 700 }}>
        Total Risk Score Summary Statistics
      </Typography>
      <UIFlexCenterBox sx={{ my: 4 }}>
        <Box sx={{ border: 1, padding: 2 }}>
          <ReportsBarChart chartData={chartDataTotalRiskScore} isTitle={true} />
        </Box>
      </UIFlexCenterBox>
      <Typography sx={{ fontSize: '20px', fontWeight: 700 }}>
        Number of individuals per Risk Indicator
      </Typography>
      <ReportsTable
        columns={organizationMetricsColumns}
        rows={organizationTableData}
        order="name"
      />
      <UIFlexCenterBox sx={{ my: 4 }}>
        <Box sx={{ border: 1, padding: 2 }}>
          <ReportsBarChart chartData={chartDataRiskIndicator} />
        </Box>
      </UIFlexCenterBox>
    </Box>
  );
};

export default OrganizationTab;
