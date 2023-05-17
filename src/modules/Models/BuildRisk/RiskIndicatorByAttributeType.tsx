/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { RiskIndicatorType } from '@/types';
import { UISelectInterface } from '@/types/common.type';
import BuildRiskValueRisk from './BuildRiskValueList';
import { noop } from 'lodash';
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
    readOnly
  ) => (
    <BuildRiskValueRisk
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      possibleRiskValues={possibleRiskValues}
      lists={lists}
      onOpenHistory={noop}
      readOnly={readOnly || false}
    />
  ),
  outlier_val: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    _lists,
    readOnly
  ) => (
    <BuildRiskOutlierValueList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      onOpenHistory={noop}
      readOnly={readOnly || false}
    />
  ),
  outlier_time: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    _lists,
    readOnly
  ) => (
    <BuildRiskOutlierTimeList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      onOpenHistory={noop}
      readOnly={readOnly || false}
    />
  ),
  within: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    _lists,
    readOnly
  ) => (
    <BuildRiskRangeList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      onOpenHistory={noop}
      readOnly={readOnly || false}
    />
  ),
  count: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    _lists,
    readOnly
  ) => (
    <BuildRiskCountList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      onOpenHistory={noop}
      readOnly={readOnly || false}
    />
  ),
  summation: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    _lists,
    readOnly
  ) => (
    <BuildRiskSummationList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      onOpenHistory={noop}
      readOnly={readOnly || false}
    />
  ),
  unique: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    _lists,
    readOnly
  ) => (
    <BuildRiskUniquenessList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      onOpenHistory={noop}
      readOnly={readOnly || false}
    />
  ),
  discrepancy: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    _lists,
    readOnly
  ) => (
    <BuildRiskDiscrepancyList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      onOpenHistory={noop}
      readOnly={readOnly || false}
    />
  ),
  similarity: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    _lists,
    readOnly
  ) => (
    <BuildRiskSimilarityList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      onOpenHistory={noop}
      readOnly={readOnly || false}
    />
  ),
  sentiment: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    _lists,
    readOnly
  ) => (
    <BuildRiskSentimentList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      onOpenHistory={noop}
      readOnly={readOnly || false}
    />
  ),
  trend: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    _lists,
    readOnly
  ) => (
    <BuildRiskTrendList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      onOpenHistory={noop}
      readOnly={readOnly || false}
    />
  ),
  normalize: (
    riskIndicator,
    dataSources,
    riskFields,
    _possibleRiskValues,
    _lists,
    readOnly
  ) => (
    <BuildRiskNormalizeList
      indicator={riskIndicator || null}
      dataSources={dataSources}
      riskFields={riskFields}
      onOpenHistory={noop}
      readOnly={readOnly || false}
    />
  ),
};

const attributeTypeToComponentFunction: attributeTypeToComponentFunctionType = (
  attributeType: string
) => attributeTypeToComponent[attributeType];
export default attributeTypeToComponentFunction;
