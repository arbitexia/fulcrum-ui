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
import { ProgramTableType, ReportsColumnType } from '@/types';
import { UIFlexEndBox } from '@/components/UI/Box';
import { appImageLoader } from '@/libs/image-loader';

const ProgramTab = (): JSX.Element => {
  const [startValue, setStartValue] = React.useState<Dayjs | null>(
    dayjs('2022-04-17')
  );
  const [endValue, setEndValue] = React.useState<Dayjs | null>(
    dayjs('2022-04-17')
  );

  const testChartData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];
  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [-1000, 1000],
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'Dataset 2',
        data: [-1000, 1000],
        backgroundColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'Dataset 3',
        data: [-1000, 1000],
        backgroundColor: 'rgb(53, 162, 235)',
      },
    ],
  };
  const totalStatus = {
    default: 'New',
    values: [
      'New',
      'In-Progress',
      'Reviewed',
      'Case Opened',
      'Corrective Action',
      'Case Closed',
    ],
  };
  const personsPerList = {
    items: [
      {
        id: 1,
        name: 'Job Title',
      },
      {
        id: 1,
        name: 'Location',
      },
      {
        id: 1,
        name: 'Business Unit',
      },
      {
        id: 1,
        name: 'Clearance',
      },
      {
        id: 1,
        name: 'Employee Status',
      },
    ],
    label: '',
  };

  const columns: ReportsColumnType[] = [
    {
      id: 'status',
      headerName: 'Individual Status Change',
    },
    {
      id: 'date',
      headerName: 'Date/Time',
      sortable: true,
    },
    {
      id: 'analyst',
      headerName: 'Analyst',
    },
    {
      id: 'name',
      headerName: 'Name',
    },
    {
      id: 'eid',
      headerName: 'EID',
    },
    {
      id: 'title',
      headerName: 'Title',
    },
    {
      id: 'businessArea',
      headerName: 'Business Area',
    },
  ];

  const programTableData: ProgramTableType[] = [
    {
      id: 1,
      status: 'In-Progress',
      date: '2022-04--22T08:15:30-05:00',
      analyst: 'John Thomas',
      name: 'Matt Dickson',
      eid: 125601,
      title: 'Nuclear Engineer',
      businessArea: 'Engineering',
    },
  ];
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
            <PieChart chartData={testChartData} />
          </Box>
        </UIFlexColumnBox>
        <UIFlexColumnBox sx={{ width: '100%' }}>
          <Typography
            sx={{ fontSize: '20px', fontWeight: 700, textAlign: 'center' }}
          >
            Status over Time
          </Typography>
          <Box>
            <StackedBarChart chartData={data} />
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
        <PieChart chartData={testChartData} />
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
          columns={columns}
          rows={programTableData}
          order="name"
          type="unmask"
          tableRole="checkbox"
        />
      </Box>
    </Box>
  );
};

export default ProgramTab;
