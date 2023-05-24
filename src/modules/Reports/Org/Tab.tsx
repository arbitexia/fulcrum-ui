/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import React, { FC, useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { UIFlexCenterBox, UISelect } from '@/components/UI';
import { UIFlexEndBox } from '@/components/UI/Box';
import { modelList, populationList } from '@/_mock';
import ReportsTable from '../ReportsTable';
import { ReportsBarChart } from './BarChart';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  individualsRiskIndicatorSelector,
  organizationListSelector,
  retrieveIndividualsRiskIndicator,
  retrieveOrganizationData,
  retrieveRiskScoreSummary,
  riskScoreSummarySelector,
} from '@/redux/slices';
import { ReportsColumnType } from '@/types';
import { ChartData } from 'chart.js';

type OrganizationTabProps = {
  accessToken: string;
};

const OrganizationTab: FC<OrganizationTabProps> = ({
  accessToken,
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const riskScoreSummary = useAppSelector(riskScoreSummarySelector);
  const individualRiskIndicator = useAppSelector(
    individualsRiskIndicatorSelector
  );
  const organizationList = useAppSelector(organizationListSelector);
  const [modelName, setModelName] = useState<number>();
  const [population, setPopulation] = useState<number>();
  const [riskScoreChartData, setRiskScoreChartData] =
    useState<ChartData<'bar'>>();
  const [riskIndicatorChartData, setRiskIndicatorChartData] =
    useState<ChartData<'bar'>>();

  useEffect(() => {
    if (!individualRiskIndicator) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveIndividualsRiskIndicator({ accessToken }));
    } else {
      const labels: string[] = [];
      const dataValue: number[] = [];
      individualRiskIndicator.map((obj) => {
        labels.push(obj.month);
        dataValue.push(obj?.value ?? 0);
      });
      setRiskIndicatorChartData({
        labels,
        datasets: [
          {
            data: dataValue,
            maxBarThickness: 10,
            backgroundColor: 'rgb(78,113,190)',
          },
        ],
      });
    }
  }, [dispatch, individualRiskIndicator]);

  useEffect(() => {
    if (!riskScoreSummary) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveRiskScoreSummary({ accessToken }));
    } else {
      const labels: string[] = [];
      const dataValue: number[] = [];
      riskScoreSummary.map((obj) => {
        labels.push(obj.score.toString());
        dataValue.push(obj?.personNumber ?? 0);
      });
      setRiskScoreChartData({
        labels,
        datasets: [
          {
            data: dataValue,
            maxBarThickness: 20,
            backgroundColor: 'rgb(78,113,190)',
          },
        ],
      });
    }
  }, [dispatch, riskScoreSummary]);

  useEffect(() => {
    if (!organizationList) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveOrganizationData({ accessToken }));
    }
  }, [dispatch, organizationList]);

  const organizationMetricsColumns: ReportsColumnType[] = [
    {
      id: 'name',
      headerName: 'Name',
    },
    {
      id: 'category',
      headerName: 'Category',
      sortable: true,
    },
    {
      id: 'percentPopulation',
      headerName: 'Percent of the Population',
      align: 'center',
    },
    {
      id: 'numberOfIndividuals',
      headerName: 'Number Of Individuals',
      align: 'center',
    },
    {
      id: 'trend',
      headerName: '1 yr Trend',
    },
  ];
  return (
    <Box sx={{ padding: '24px 38px' }}>
      <UIFlexEndBox sx={{ gap: 4 }}>
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
      <Typography sx={{ fontSize: '20px', fontWeight: 700, mt: 4 }}>
        Total Risk Score Summary Statistics
      </Typography>
      {riskScoreChartData && (
        <UIFlexCenterBox sx={{ my: 4 }}>
          <Box sx={{ border: 1, padding: 2 }}>
            <ReportsBarChart chartData={riskScoreChartData} isTitle={true} />
          </Box>
        </UIFlexCenterBox>
      )}
      <Typography sx={{ fontSize: '20px', fontWeight: 700, mt: 6, mb: 4 }}>
        Number of individuals per Risk Indicator
      </Typography>
      <ReportsTable
        columns={organizationMetricsColumns}
        rows={organizationList ?? []}
        order="name"
      />
      {riskIndicatorChartData && (
        <UIFlexCenterBox sx={{ my: 6 }}>
          <Box sx={{ border: 1, padding: 2 }}>
            <ReportsBarChart chartData={riskIndicatorChartData} />
          </Box>
        </UIFlexCenterBox>
      )}
    </Box>
  );
};

export default OrganizationTab;
