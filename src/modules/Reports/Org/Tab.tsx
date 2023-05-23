/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import React, { useState } from 'react';
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
import ReportsTable from '../ReportsTable';
import { ReportsBarChart } from './BarChart';

const OrganizationTab = (): JSX.Element => {
  const [modelName, setModelName] = useState<number>();
  const [population, setPopulation] = useState<number>();

  return (
    <Box>
      <UIFlexEndBox sx={{ gap: 4, mt: 2 }}>
        <UISelect
          value={modelName ?? modelList.items[0].id}
          defaultValue={modelList.items[0].id}
          itemList={modelList.items}
          label={modelList.label}
          handleChange={(event) => {
            setModelName(event.target.value as number);
          }}
        />
        <UISelect
          value={population ?? populationList.items[0].id}
          defaultValue={populationList.items[0].id}
          itemList={populationList.items}
          handleChange={(event) => {
            setPopulation(event.target.value as number);
          }}
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
