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
  LinearProgress,
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
  barChartDataSelector,
  scoringPageInfoSelector,
  changePageNumber,
} from '@/redux/slices';
import { barChartOptions } from '@/_mock';
import { PaginateParam } from '@/types';
import {
  getScoringCount,
  setSelectedCategoriesState,
} from '@/redux/slices/scoring.slice';
import { getColorPair } from '@/libs/color-generator';

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
  color: '#485A63',
});

export const HomeBarChart = ({
  originalCategories,
  originalCategoriesInitialized,
  refreshCategories,
  setRefreshCategories,
}: {
  originalCategories: string[];
  originalCategoriesInitialized: boolean;
  refreshCategories: boolean;
  setRefreshCategories: (val: boolean) => void;
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const barChartData = useAppSelector(barChartDataSelector);
  const selectPageInfo: PaginateParam = useAppSelector(
    scoringPageInfoSelector('homePage')
  );
  const scoringCount = useAppSelector(getScoringCount);
  const [selectedCategories, setSelectedCategories] = useState<string[] | null>(
    null
  );
  const [chartData, setChartData] = useState<ChartData<'bar', number[]>>({
    labels: [],
    datasets: [],
  });
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
    if (
      (selectedCategories === null || refreshCategories) &&
      originalCategoriesInitialized &&
      originalCategories.length >= 0
    ) {
      setSelectedCategories(originalCategories);
      setRefreshCategories(false);
    }
  }, [
    selectedCategories,
    originalCategories,
    setSelectedCategories,
    originalCategoriesInitialized,
    refreshCategories,
    setRefreshCategories,
  ]);

  useEffect(() => {
    setChartData(barChartData);
  }, [barChartData]);

  const handleChange = (event: SelectChangeEvent<unknown>): void => {
    const value = event.target.value as string[];
    setSelectedCategories(value);
    if (value.length < originalCategories.length) {
      dispatch(setSelectedCategoriesState({ categories: value }));
    } else {
      dispatch(setSelectedCategoriesState({ categories: undefined }));
    }
  };

  const useLimit = selectPageInfo?.limit ?? 25;
  const usePageNumber = selectPageInfo?.pageNumber ?? 25;
  const maxPageNumber = Math.ceil(scoringCount / useLimit);

  if (selectedCategories === null) {
    return <LinearProgress />;
  }

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
            value={selectedCategories}
            multiple
            onChange={handleChange}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            renderValue={(selected) => selected.join(', ')}
            textColor="#0050BE"
            sx={{ maxWidth: '250px' }}
          >
            {originalCategories.map((item, index) => {
              return (
                <UISelectItem key={index} value={item} textColor="#0050BE">
                  <Checkbox checked={selectedCategories.indexOf(item) > -1} />
                  {item}
                </UISelectItem>
              );
            })}
          </UISelectBox>
        </Box>
      </UIFlexSpaceBox>
      <UIFlexWrapBox sx={{ gap: 3 }}>
        {originalCategories.map((item, index) => {
          if (selectedCategories.indexOf(item) === -1) {
            return null;
          }
          const backgroundColor = getColorPair(index).bgColor;
          return (
            <StyledLegendBox key={index}>
              <UIScoreChip
                label=""
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                bgColor={
                  barChartData?.datasets[index]?.backgroundColor ??
                  backgroundColor
                }
                sx={{ marginRight: '8px', width: '12px', height: '12px' }}
              />
              {item}
            </StyledLegendBox>
          );
        })}
      </UIFlexWrapBox>
      <Box sx={{ margin: (theme) => theme.spacing(2, 'auto') }}>
        <Bar options={barChartOptions} data={chartData} />
      </Box>
      <UIFlexSpaceBox sx={{ justifyContent: 'right' }}>
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
