/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import React, { FC, useState, useEffect } from 'react';
import Image from 'next/image';
import { Box, Typography, Chip, IconButton, Button } from '@mui/material';
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
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import PieChart from './PieChart';
import StackedBarChart from './StackedBarChart';
import { StatusDict, getStatusColor } from '@/libs/color-generator';
import ReportsTable from '../ReportsTable';
import { UIFlexEndBox, UIFlexSpaceBox } from '@/components/UI/Box';
import { appImageLoader } from '@/libs/image-loader';
import { personsPerList, totalStatus } from '@/constants';

import {
  BaseSingleInputFieldProps,
  DateValidationError,
  FieldSection,
} from '@mui/x-date-pickers/models';
import { UseDateFieldProps } from '@mui/x-date-pickers/DateField';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  personPerSelector,
  programListSelector,
  retrievePersonsPer,
  retrieveProgramsData,
  retrieveRiskStatusSummary,
  retrieveStatusOverTime,
  riskStatusSummarySelector,
  statusOverTimeSelector,
} from '@/redux/slices';
import { ReportsColumnType } from '@/types';
import { ChartData } from 'chart.js';

interface ButtonFieldProps
  extends UseDateFieldProps<Dayjs>,
    BaseSingleInputFieldProps<Dayjs | null, FieldSection, DateValidationError> {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}
type ProgramTabProps = {
  accessToken: string;
};
const ProgramTab: FC<ProgramTabProps> = ({ accessToken }): JSX.Element => {
  const dispatch = useAppDispatch();
  const riskStatusSummary = useAppSelector(riskStatusSummarySelector);
  const statusOverTime = useAppSelector(statusOverTimeSelector);
  const personsPer = useAppSelector(personPerSelector);
  const programList = useAppSelector(programListSelector);

  const [startValue, setStartValue] = useState<Dayjs | null>(dayjs(new Date()));
  const [endValue, setEndValue] = useState<Dayjs | null>(dayjs(new Date()));
  const [totalStatusValue, setTotalStatusValue] = useState<string>();
  const [personValue, setPersonValue] = useState<number>();
  const [riskStatusChartData, setRiskStatusChartData] =
    useState<ChartData<'pie'>>();
  const [statusOverTimeChartData, setStatusOverTimeChartData] =
    useState<ChartData<'bar'>>();
  const [personsPerChartData, setPersonsPerChartData] =
    useState<ChartData<'pie'>>();

  useEffect(() => {
    if (!riskStatusSummary) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveRiskStatusSummary({ accessToken }));
    } else {
      const labels: string[] = [];
      const dataValue: number[] = [];
      const backgroundColor = [
        '#FFC000',
        '#F57C2B',
        '#92D050',
        '#C00000',
        '#959595',
      ];
      riskStatusSummary.map((obj) => {
        labels.push(obj.status);
        dataValue.push(obj?.value ?? 0);
      });
      setRiskStatusChartData({
        labels,
        datasets: [{ data: dataValue, backgroundColor }],
      });
    }
  }, [dispatch, riskStatusSummary]);

  useEffect(() => {
    if (!statusOverTime) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveStatusOverTime({ accessToken }));
    } else {
      const labels: string[] = statusOverTime.map((obj) => obj.label);
      const datasets: {
        maxBarThickness: number;
        data: number[];
        backgroundColor: string;
      }[] = statusOverTime[0].values.map((_, index) => {
        return {
          maxBarThickness: 50,
          data: statusOverTime.map((item) => item.values[index]),
          backgroundColor: getBackgroundColor(index),
        };
      });
      setStatusOverTimeChartData({ labels, datasets });
    }
  }, [dispatch, statusOverTime]);

  const getBackgroundColor = (index: number) => {
    const colors = [
      'rgb(254, 192, 0)',
      'rgb(236, 125, 49)',
      'rgb(146, 209, 80)',
      'rgb(193, 3, 0)',
      'rgb(166, 166, 166)',
    ];
    return colors[index] || '';
  };

  useEffect(() => {
    if (!personsPer) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrievePersonsPer({ accessToken }));
    } else {
      const labels: string[] = [];
      const dataValue: number[] = [];
      const backgroundColor = [
        'rgb(97, 160, 219)',
        'rgb(247,127, 41)',
        'rgb(165, 165, 165)',
        'rgb(252, 196, 0)',
        'rgb(55, 106, 195)',
        'rgb(107, 172,62)',
        'rgb(32, 93, 151)',
        'rgb(165, 71, 7)',
        'rgb(105,105, 105)',
      ];
      personsPer.map((obj) => {
        labels.push(obj.status);
        dataValue.push(obj?.value ?? 0);
      });
      setPersonsPerChartData({
        labels,
        datasets: [{ data: dataValue, backgroundColor }],
      });
    }
  }, [dispatch, personsPer]);

  useEffect(() => {
    if (!programList) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveProgramsData({ accessToken }));
    }
  }, [dispatch, programList]);

  const ButtonField = (props: ButtonFieldProps) => {
    const {
      setOpen,
      label,
      id,
      disabled,
      InputProps: { ref } = {},
      inputProps: { 'aria-label': ariaLabel } = {},
    } = props;

    return (
      <Button
        variant="outlined"
        id={id}
        disabled={disabled}
        ref={ref}
        aria-label={ariaLabel}
        onClick={() => setOpen?.((prev) => !prev)}
        sx={{
          border: 'solid 1px #D0D8DC !important',
        }}
      >
        {label ?? 'Pick a date'}
      </Button>
    );
  };
  const ButtonDatePicker = (
    props: Omit<DatePickerProps<Dayjs>, 'open' | 'onOpen' | 'onClose'>
  ) => {
    const [open, setOpen] = useState(false);
    return (
      <DatePicker
        slots={{ field: ButtonField }}
        slotProps={{
          field: { setOpen } as any,
        }}
        {...props}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      />
    );
  };

  const programMetricsColumns: ReportsColumnType[] = [
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
  return (
    <Box sx={{ padding: '24px 38px' }}>
      <UIFlexWrapBox sx={{ gap: 2, alignItems: 'center' }}>
        <Typography sx={{ fontSize: '14px', color: '#7C909B' }}>
          Time Filter
        </Typography>
      </UIFlexWrapBox>
      <UIFlexWrapBox sx={{ mt: 2, gap: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ButtonDatePicker
            label={`${
              startValue == null ? 'null' : startValue.format('MM/DD/YYYY')
            }`}
            value={startValue}
            onChange={(newValue) => setStartValue(newValue)}
          />
          <ButtonDatePicker
            label={`${
              endValue == null ? 'null' : endValue.format('MM/DD/YYYY')
            }`}
            value={startValue}
            onChange={(newValue) => setEndValue(newValue)}
          />
        </LocalizationProvider>
      </UIFlexWrapBox>

      <UIFlexSpaceBox sx={{ mt: 4 }}>
        {riskStatusChartData && (
          <UIFlexColumnBox>
            <Typography sx={{ fontSize: '20px', fontWeight: 700 }}>
              Risk Status Summary
            </Typography>
            <Box sx={{ border: 1, padding: 2 }}>
              <PieChart chartData={riskStatusChartData} />
            </Box>
          </UIFlexColumnBox>
        )}

        {statusOverTimeChartData && (
          <UIFlexColumnBox>
            <Typography
              sx={{ fontSize: '20px', fontWeight: 700, textAlign: 'center' }}
            >
              Status over Time
            </Typography>
            <Box sx={{ border: 1, padding: 2 }}>
              <StackedBarChart chartData={statusOverTimeChartData} />
            </Box>
          </UIFlexColumnBox>
        )}
      </UIFlexSpaceBox>

      <UIFlexCenterBox sx={{ mt: 12 }}>
        <UIFlexCenterBox sx={{ gap: 4 }}>
          <UIFlexCenterBox>
            <Typography sx={{ fontWeight: 700, fontSize: '20px' }}>
              Total
            </Typography>
            <UISelectBox
              id="demo-simple-select-helper"
              defaultValue={totalStatus.default}
              value={totalStatusValue ?? totalStatus.default}
              label="status"
              onChange={(event) => {
                setTotalStatusValue(event.target.value as string);
              }}
              width="210px"
              MenuProps={{
                PaperProps: {
                  sx: {
                    '& .MuiMenu-list': { paddingTop: 0 },
                  },
                },
              }}
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
                    sx={{ minWidth: '210px', padding: '0 12px' }}
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
              defaultValue={personsPerList.items[0].id}
              value={personValue ?? personsPerList.items[0].id}
              itemList={personsPerList.items}
              handleChange={(event) => {
                setPersonValue(event.target.value as number);
              }}
            />
          </UIFlexCenterBox>
        </UIFlexCenterBox>
      </UIFlexCenterBox>
      <UIFlexCenterBox sx={{ mt: 4 }}>
        {personsPerChartData && (
          <Box sx={{ border: 1, padding: 2 }}>
            <PieChart chartData={personsPerChartData} />
          </Box>
        )}
      </UIFlexCenterBox>
      <Box sx={{ my: 8 }}>
        <UIFlexEndBox sx={{ mb: 2 }}>
          <IconButton>
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
          rows={programList ?? []}
          order="name"
        />
      </Box>
    </Box>
  );
};

export default ProgramTab;
