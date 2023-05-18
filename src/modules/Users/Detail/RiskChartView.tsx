/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import RiskChart from './RiskChart';
import { ApexOptions } from 'apexcharts';
import { useAppSelector } from '@/hooks';
import { getHistoricalDataForEntityId } from '@/redux/slices';
import { HistoricalDataForEntityId } from '@/_mock/profile.mock';
import { stableSort, valueComparator } from '@/libs/sort-utils';
import { roundScore } from '@/libs/math-utils';

interface RiskChartViewProps {
  entityId: string;
  selectedCategory: number;
}

export const RiskChartView = ({
  selectedCategory,
  entityId,
}: RiskChartViewProps): JSX.Element => {
  const historicalData: HistoricalDataForEntityId = useAppSelector(
    getHistoricalDataForEntityId(entityId)
  );
  const dates = Object.keys(historicalData);
  const sortedDatesStart = stableSort<string>(
    dates,
    valueComparator<string, Date>(dates, 'asc', (value: string) => {
      return new Date(value);
    })
  );
  const sortedDates: string[] = [];
  const oldIndexToNew: { [oldIndex: number]: number } = {};

  sortedDatesStart.forEach(([value, oldIndex], newIndex) => {
    sortedDates.push(value);
    oldIndexToNew[oldIndex] = newIndex;
  });

  const options: ApexOptions = {
    chart: {
      id: 'basic-bar',
      toolbar: {
        show: false,
      },
      stacked: true,
    },
    xaxis: {
      type: 'datetime',
      categories: sortedDates,
    },
    yaxis: {
      min: 0,
      tickAmount: 9,
      opposite: true,
      labels: {
        formatter: (val) => {
          return roundScore(val).toString();
        },
      },
    },
    stroke: {
      curve: 'straight',
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      show: true,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
  };

  const categoryScoresNameAndDate: {
    [categoryName: string]: { categoryDate: string; categoryScore: number }[];
  } = {};

  const categoryNamesByIndex: {
    [index: number]: string;
  } = {};

  Object.entries(historicalData).forEach((value) => {
    const [date, categories] = value;
    categories.forEach((category, index) => {
      const categoryName = category.name;
      if (!(categoryName in categoryScoresNameAndDate)) {
        categoryScoresNameAndDate[categoryName] = [];
        categoryNamesByIndex[index] = categoryName;
      }
      categoryScoresNameAndDate[categoryName].push({
        categoryDate: date,
        categoryScore: category.score,
      });
    });
  });

  const series = Object.entries(categoryScoresNameAndDate).map(
    ([name, dateList]) => {
      const sourceData: number[] = dateList.map(
        ({ categoryScore }) => categoryScore
      );
      const data = new Array(sourceData.length).fill(0);
      sourceData.forEach((dataValue, index) => {
        const newIndex = oldIndexToNew[index];
        data[newIndex] = dataValue;
      });
      return {
        name,
        data,
      };
    }
  );

  const categoryObjectByDate: {
    [name: string]: { name: string; data: number[] };
  } = {};

  Object.entries(categoryScoresNameAndDate).forEach(([name, dateList]) => {
    const data: number[] = dateList.map(({ categoryScore }) => categoryScore);
    categoryObjectByDate[name] = {
      name,
      data,
    };
  });

  const selectedCategoryName =
    selectedCategory > -1 ? categoryNamesByIndex[selectedCategory] : null;
  if (selectedCategoryName) {
    const categoryObjectList = categoryScoresNameAndDate[selectedCategoryName];
    if (categoryObjectList && categoryObjectList.length > 0) {
      const selectedCategorySourcedata: number[] = categoryObjectList.map(
        ({ categoryScore }) => categoryScore
      );
      const selectedCategoryData: number[] = new Array(
        selectedCategorySourcedata.length
      ).fill(0);
      selectedCategorySourcedata.forEach((dataValue, index) => {
        const newIndex = oldIndexToNew[index];
        selectedCategoryData[newIndex] = dataValue;
      });
      const seriesExpand: ApexOptions['series'] = [
        {
          name: selectedCategoryName,
          data: selectedCategoryData,
        },
      ];
      return <RiskChart options={options} series={seriesExpand} />;
    }
  }

  return <RiskChart options={options} series={series} />;
};
