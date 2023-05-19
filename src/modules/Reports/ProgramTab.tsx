/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { Box, Typography, Chip, IconButton } from '@mui/material';
import {
  UIFlexWrapBox,
  UIFlexCenterBox,
  UIFlexColumnBox,
  UISelectBox,
  UISelectItem,
  UISelect,
} from '@/components/UI';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PieChart from './Detail/PieChart';
import StackedBarChart from './Detail/StackedBarChart';
import { StatusDict, getStatusColor } from '@/libs/color-generator';
import ReportsTable from './ReportsTable';
import { UIFlexEndBox } from '@/components/UI/Box';
import { appImageLoader } from '@/libs/image-loader';
import {
  PersonsPerChartData,
  programMetricsColumns,
  programTableData,
  riskStatusChartData,
  statusOverTimeChartData,
} from '@/_mock';
import { personsPerList, totalStatus } from '@/constants';

const ProgramTab = (): JSX.Element => {
  const [startValue, setStartValue] = React.useState<Dayjs | null>(
    dayjs('2022-04-17')
  );
  const [endValue, setEndValue] = React.useState<Dayjs | null>(
    dayjs('2022-04-17')
  );

  return (
    <Box sx={{ padding: '1rem 0' }}>
      <UIFlexWrapBox sx={{ gap: 2, alignItems: 'center' }}>
        <Typography sx={{ fontSize: '14px', color: '#7C909B' }}>
          Time Filter
        </Typography>
      </UIFlexWrapBox>
      <UIFlexWrapBox sx={{ mt: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start"
            value={startValue}
            onChange={(newValue) => setStartValue(newValue)}
          />
          <DatePicker
            label="End"
            value={endValue}
            onChange={(newValue) => setEndValue(newValue)}
            sx={{ ml: 4 }}
          />
        </LocalizationProvider>
      </UIFlexWrapBox>

      <UIFlexWrapBox sx={{ mt: 4, flexWrap: 'nowrap' }}>
        <UIFlexColumnBox sx={{ width: '100%' }}>
          <Typography sx={{ fontSize: '20px', fontWeight: 700 }}>
            Risk Status Summary
          </Typography>
          <Box>
            <PieChart chartData={riskStatusChartData} />
          </Box>
        </UIFlexColumnBox>
        <UIFlexColumnBox sx={{ width: '100%' }}>
          <Typography
            sx={{ fontSize: '20px', fontWeight: 700, textAlign: 'center' }}
          >
            Status over Time
          </Typography>
          <Box>
            <StackedBarChart chartData={statusOverTimeChartData} />
          </Box>
        </UIFlexColumnBox>
      </UIFlexWrapBox>

      <UIFlexCenterBox sx={{ mt: 12 }}>
        <UIFlexCenterBox sx={{ gap: 4 }}>
          <UIFlexCenterBox>
            <Typography sx={{ fontWeight: 700, fontSize: '20px' }}>
              Total
            </Typography>
            <UISelectBox
              id="demo-simple-select-helper"
              defaultValue={totalStatus.default}
              // value={totalStatus ?? totalStatus[0].label}
              label="status"
              onChange={() => {}}
              width="210px"
              height="36px"
            >
              {totalStatus.values.map((item, index) => {
                const colorPair = getStatusColor(
                  item as keyof StatusDict,
                  'new'
                );
                return (
                  <UISelectItem
                    key={index}
                    value={item as string}
                    sx={{ minWidth: '210px' }}
                  >
                    <Chip
                      label={item as string}
                      sx={{
                        color: colorPair.textColor,
                        background: colorPair.bgColor,
                        borderRadius: '4px',
                        width: '157px',
                        height: '24px',
                        justifyContent: 'flex-start',
                      }}
                    />
                  </UISelectItem>
                );
              })}
            </UISelectBox>
          </UIFlexCenterBox>
          <UIFlexCenterBox>
            <Typography sx={{ fontWeight: 700, fontSize: '20px' }}>
              Persons per
            </Typography>
            <UISelect
              value={1}
              itemList={personsPerList.items}
              handleChange={(event) => {
                // handleChange(event, 'changePopulation');
              }}
            />
          </UIFlexCenterBox>
        </UIFlexCenterBox>
      </UIFlexCenterBox>
      <UIFlexCenterBox sx={{ mt: 4 }}>
        <PieChart chartData={PersonsPerChartData} />
      </UIFlexCenterBox>
      <Box sx={{ my: 8 }}>
        <UIFlexEndBox sx={{ mb: 2 }}>
          <IconButton
            onClick={() => {
              const uuid = new Date().getTime();
              // dispatchDownloadExcel({ userId: '1', uuid: uuid.toString() });
            }}
          >
            <Image
              src={'images/icons/xls.svg'}
              loader={appImageLoader}
              width={24}
              height={30}
              alt="pdf"
            />
          </IconButton>
        </UIFlexEndBox>
        <ReportsTable
          columns={programMetricsColumns}
          rows={programTableData}
          order="name"
        />
      </Box>
    </Box>
  );
};

export default ProgramTab;
