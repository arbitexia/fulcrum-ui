/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useState, useEffect } from 'react';
import {
  styled,
  Box,
  Typography,
  InputLabel,
  Checkbox,
  SelectChangeEvent,
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ScatterDataPoint,
  BubbleDataPoint,
} from 'chart.js';
import {
  UIScoreChip,
  UIPagination,
  UIFlexWrapBox,
  UISelectBox,
  UISelectItem,
  UIFlexSpaceBox,
} from '@/components/UI';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  categoriesSelector,
  barChartDataSelector,
  scoringPageInfoSelector,
  changePageNumber,
} from '@/redux/slices';
import { barChartOptions } from '@/_mock';
import { PaginateParam } from '@/types';
import { getScoringCount } from '@/redux/slices/scoring.slice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const StyledLegendBox = styled(Box)({
  fontSize: '14px',
  lineHeight: '20px',
  color: '#485A63',
});

export const HomeBarChart = (): JSX.Element => {
  const categories = useAppSelector(categoriesSelector);
  const barChartData = useAppSelector(barChartDataSelector);
  const selectPageInfo: PaginateParam = useAppSelector(
    scoringPageInfoSelector('homePage')
  );
  const scoringCount = useAppSelector(getScoringCount);
  const dispatch = useAppDispatch();
  const [category, setCategory] = useState<string[]>([]);
  const [chartData, setChartData] = useState<
    ChartData<'bar', (number | ScatterDataPoint | BubbleDataPoint | null)[]>
  >({ labels: [], datasets: [] });
  const [limit, setLimit] = useState<number>(selectPageInfo.limit ?? 25);
  const [pageNumber, setPageNumber] = useState<number>(
    selectPageInfo?.pageNumber ?? 1
  );

  useEffect(() => {
    const isLimitChanged = selectPageInfo && selectPageInfo.limit !== limit;
    const isPageNumberChanged =
      selectPageInfo && selectPageInfo.pageNumber !== pageNumber;
    const hasChanges = isLimitChanged || isPageNumberChanged;
    if (selectPageInfo && hasChanges) {
      setLimit(selectPageInfo.limit ?? 25);
      setPageNumber(selectPageInfo.pageNumber ?? 1);
    }
  }, [selectPageInfo, limit, pageNumber]);

  const dispatchChangePageNumber = (newPageNumber: number): void => {
    dispatch(changePageNumber({ pageNumber: newPageNumber }));
  };

  useEffect(() => {
    setCategory(categories);
  }, [categories]);

  useEffect(() => {
    setChartData(barChartData);
  }, [barChartData]);

  const handleChange = (event: SelectChangeEvent<unknown>): void => {
    const value = event.target.value as string[];
    if (value) {
      setCategory(value);
      const valuesSet = new Set(value);
      setChartData((prev: typeof barChartData) => {
        return {
          ...prev,
          datasets: barChartData.datasets.filter((w) => {
            const label = w.label ? w.label : '';
            return valuesSet.has(label);
          }),
        };
      });
    }
  };

  const useLimit = selectPageInfo?.limit ?? 25;
  const usePageNumber = selectPageInfo?.pageNumber ?? 25;
  const maxPageNumber = Math.ceil(scoringCount / useLimit);

  return (
    <Box>
      <UIFlexSpaceBox>
        <Typography variant="h6" color="text.secondary">
          Individual Risk Scores by Category
        </Typography>
        <Box>
          <InputLabel variant="standard" htmlFor="demo-simple-select-helper">
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ marginLeft: '5px' }}
            >
              Edit Categories
            </Typography>
          </InputLabel>
          <UISelectBox
            id="demo-simple-select-helper"
            defaultValue={1}
            label="Edit Categories"
            value={category}
            multiple
            onChange={handleChange}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            renderValue={(selected) => selected.join(', ')}
            textColor="#0050BE"
            sx={{ maxWidth: '250px' }}
          >
            {categories.map((item, index) => {
              return (
                <UISelectItem key={index} value={item} textColor="#0050BE">
                  <Checkbox checked={category.indexOf(item) > -1} />
                  {item}
                </UISelectItem>
              );
            })}
          </UISelectBox>
        </Box>
      </UIFlexSpaceBox>
      <Box sx={{ margin: (theme) => theme.spacing(2, 'auto') }}>
        <Bar options={barChartOptions} data={chartData} />
      </Box>
      <UIFlexSpaceBox>
        <UIFlexWrapBox sx={{ gap: 3 }}>
          {categories.map((item, index) => {
            return category.indexOf(item) > -1 ? (
              <StyledLegendBox key={index}>
                <UIScoreChip
                  label=""
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  bgColor={barChartData.datasets[index].backgroundColor}
                  sx={{ marginRight: '8px', width: '24px', height: '24px' }}
                />
                {item}
              </StyledLegendBox>
            ) : (
              ''
            );
          })}
        </UIFlexWrapBox>
        <UIPagination
          pageNumber={usePageNumber}
          pageCount={useLimit > 0 ? maxPageNumber : 0}
          onNext={() => {
            if (usePageNumber < maxPageNumber) {
              dispatchChangePageNumber(usePageNumber + 1);
            }
          }}
          onPrev={() => {
            if (usePageNumber > 1) {
              dispatchChangePageNumber(usePageNumber - 1);
            }
          }}
          onStart={() => {
            dispatchChangePageNumber(1);
          }}
        />
      </UIFlexSpaceBox>
    </Box>
  );
};
