/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { RiskIndicatorType } from '@/types';
import { EditValueItemProps, UISelectInterface } from '@/types/common.type';
import BuildRiskValueRisk from './BuildRiskValueList';
import BuildRiskRangeList from './BuildRiskRangeList';
import BuildRiskOutlierValueList from './BuildRiskOutlierValueList';
import BuildRiskOutlierTimeList from './BuildRiskOutlierTimeList';
import BuildRiskTrendList from './BuildRiskTrendList';
import BuildRiskCountList from './BuildRiskCountList';
import BuildRiskSummationList from './BuildRiskSummationList';
import BuildRiskUniquenessList from './BuildRiskUniquenessList';
import BuildRiskDiscrepancyList from './BuildRiskDiscrepancyList';
import BuildRiskSimilarityList from './BuildRiskSimilarityList';
import BuildRiskSentimentList from './BuildRiskSentimentList';
import BuildRiskNormalizeList from './BuildRiskNormalizeList';

export type riskIndicatorFunctionType = (
  riskIndicator: RiskIndicatorType,
  datasources: UISelectInterface[],
  riskFields: { [dataSource: string]: UISelectInterface[] },
  possibleRiskValues: UISelectInterface[],
  lists: { id: string; label: string }[],
  openHistory: () => void,
  openHistory2: () => void,
  openEditModalValueProps: (args: EditValueItemProps) => void,
  datasourceChange: (dataSourceId: string) => void,
  readOnly: boolean
) => JSX.Element;

export type attributeTypeToComponentFunctionType = (
  attributeType: string
) => riskIndicatorFunctionType;

const attributeTypeToComponent: {
  [attributeType: string]: riskIndicatorFunctionType;
} = {
  value: (
    riskIndicator,
    dataSources,
    riskFields,
    possibleRiskValues,
    lists,
    openHistory,
    _openHistory2,
    openEditModalValueProps,
    datasourceChange,
    readOnly
  ) => (
    <BuildRiskValueRisk
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      possibleRiskValues={possibleRiskValues}
      lists={lists}
      onOpenHistory={openHistory}
      openEditModalValueProps={openEditModalValueProps}
      datasourceChange={datasourceChange}
      readOnly={readOnly || false}
    />
  ),
  outlier_val: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    lists,
    openHistory,
    _openHistory2,
    _openEditModalValueProps,
    datasourceChange,
    readOnly
  ) => (
    <BuildRiskOutlierValueList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      lists={lists}
      onOpenHistory={openHistory}
      datasourceChange={datasourceChange}
      readOnly={readOnly || false}
    />
  ),
  outlier_time: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    lists,
    openHistory,
    _openHistory2,
    _openEditModalValueProps,
    datasourceChange,
    readOnly
  ) => (
    <BuildRiskOutlierTimeList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      lists={lists}
      onOpenHistory={openHistory}
      datasourceChange={datasourceChange}
      readOnly={readOnly || false}
    />
  ),
  within: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    lists,
    openHistory,
    _openHistory2,
    _openEditModalValueProps,
    datasourceChange,
    readOnly
  ) => (
    <BuildRiskRangeList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      lists={lists}
      onOpenHistory={openHistory}
      datasourceChange={datasourceChange}
      readOnly={readOnly || false}
    />
  ),
  count: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    lists,
    openHistory,
    _openHistory2,
    openEditModalValueProps,
    datasourceChange,
    readOnly
  ) => (
    <BuildRiskCountList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      lists={lists}
      onOpenHistory={openHistory}
      openEditModalValueProps={openEditModalValueProps}
      datasourceChange={datasourceChange}
      readOnly={readOnly || false}
    />
  ),
  summation: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    lists,
    openHistory,
    _openHistory2,
    openEditModalValueProps,
    datasourceChange,
    readOnly
  ) => (
    <BuildRiskSummationList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      lists={lists}
      onOpenHistory={openHistory}
      openEditModalValueProps={openEditModalValueProps}
      datasourceChange={datasourceChange}
      readOnly={readOnly || false}
    />
  ),
  unique: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    lists,
    openHistory,
    _openHistory2,
    _openEditModalValueProps,
    datasourceChange,
    readOnly
  ) => (
    <BuildRiskUniquenessList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      lists={lists}
      onOpenHistory={openHistory}
      datasourceChange={datasourceChange}
      readOnly={readOnly || false}
    />
  ),
  discrepancy: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    lists,
    openHistory,
    openHistory2,
    _openEditModalValueProps,
    datasourceChange,
    readOnly
  ) => (
    <BuildRiskDiscrepancyList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      lists={lists}
      onOpenHistory={openHistory}
      onOpenHistory2={openHistory2}
      datasourceChange={datasourceChange}
      readOnly={readOnly || false}
    />
  ),
  similarity: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    lists,
    openHistory,
    openHistory2,
    _openEditModalValueProps,
    datasourceChange,
    readOnly
  ) => (
    <BuildRiskSimilarityList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      lists={lists}
      onOpenHistory={openHistory}
      onOpenHistory2={openHistory2}
      datasourceChange={datasourceChange}
      readOnly={readOnly || false}
    />
  ),
  sentiment: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    lists,
    openHistory,
    _openHistory2,
    _openEditModalValueProps,
    datasourceChange,
    readOnly
  ) => (
    <BuildRiskSentimentList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      lists={lists}
      onOpenHistory={openHistory}
      datasourceChange={datasourceChange}
      readOnly={readOnly || false}
    />
  ),
  trend: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    lists,
    openHistory,
    _openHistory2,
    _openEditModalValueProps,
    datasourceChange,
    readOnly
  ) => (
    <BuildRiskTrendList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      lists={lists}
      onOpenHistory={openHistory}
      datasourceChange={datasourceChange}
      readOnly={readOnly || false}
    />
  ),
  normalize: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    lists,
    openHistory,
    _openHistory2,
    _openEditModalValueProps,
    datasourceChange,
    readOnly
  ) => (
    <BuildRiskNormalizeList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      lists={lists}
      onOpenHistory={openHistory}
      datasourceChange={datasourceChange}
      readOnly={readOnly || false}
    />
  ),
};

const attributeTypeToComponentFunction: attributeTypeToComponentFunctionType = (
  attributeType: string
) => attributeTypeToComponent[attributeType];
export default attributeTypeToComponentFunction;
