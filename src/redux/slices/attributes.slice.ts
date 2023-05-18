/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from '@/redux/store';
import {
  ReduxJson,
  ResponseStatus,
  RiskIndicatorRangeValues,
  RiskIndicatorType,
  RiskIndicatorValues,
} from '@/types';
import { modelApi } from '@/redux/apis';
import { AxiosError } from 'axios';
import {
  DeleteAttributeParams,
  NewAttributeParams,
  OutlierBase,
  OutlierKeys,
  RetrieveAttributeParams,
  RetrieveAttributesParams,
  RiskIndicatorExcludeItems,
  RiskIndicatorIncludeTimes,
} from '@/types/models.type';
import {
  HOUR_AS_MILLISECONDS_FROM_EPOCH,
  DAY_AS_MILLISECONDS_FROM_EPOCH,
  WEEK_AS_MILLISECONDS_FROM_EPOCH,
} from '@/libs/time-utils';
import { convertScore } from '@/libs/math-utils';
import {
  dateData,
  filterOptionData,
  overTimeData,
  reduceData,
  useData,
} from '@/_mock';
import { checkAuthToken } from '@/libs/auth-token';

const initialState: ReduxJson.AttributesState = {
  loading: true,
  status: null,
  isAttributesInitialized: false,
  hasDeleteAttributeMessage: false,
  attributes: {},
  newAttribute: null,
  currentAttributeId: null,
};

export const retrieveAttributes = createAsyncThunk<
  RiskIndicatorType[],
  RetrieveAttributesParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'attributes/retrieveAttributes',
  async (params: RetrieveAttributesParams, thunkAPI) => {
    try {
      // TODO - define the api auth token
      await checkAuthToken();
      return await modelApi.loadAttributesData(params);
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const retrieveAttribute = createAsyncThunk<
  RiskIndicatorType,
  RetrieveAttributeParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'attributes/retrieveAttribute',
  async (params: RetrieveAttributeParams, thunkAPI) => {
    try {
      // TODO - define the api auth token
      await checkAuthToken();
      return await modelApi.loadAttributeData(params);
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const saveAttribute = createAsyncThunk<
  string,
  NewAttributeParams,
  { dispatch: AppDispatch; state: RootState }
>('attributes/newAttribute', async (params: NewAttributeParams, thunkAPI) => {
  try {
    return await modelApi.createAttribute(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const deleteAttribute = createAsyncThunk<
  string,
  DeleteAttributeParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'attributes/deleteAttribute',
  async (params: DeleteAttributeParams, thunkAPI) => {
    try {
      return await modelApi.deleteAttribute(params);
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

type riskIndicatorBuilderFunctionInputType = {
  inputRiskIndicator: RiskIndicatorType;
  value: number[] | string[] | string | number | undefined;
  listIndex?: number | undefined;
  dataSourceId?: string | undefined;
  riskFieldId?: string | undefined;
  secondRiskFieldId?: string | undefined;
};

const customOutlierValues: { [attributeType in OutlierKeys]: OutlierBase } = {
  outlier_val: {
    occurrenceBased: false,
    scoringType: 'MAX_OUTLIER',
    unitInMillis: HOUR_AS_MILLISECONDS_FROM_EPOCH,
    periodInMillis: WEEK_AS_MILLISECONDS_FROM_EPOCH,
    periodInUnits:
      WEEK_AS_MILLISECONDS_FROM_EPOCH / HOUR_AS_MILLISECONDS_FROM_EPOCH,
    subFrameInUnits:
      DAY_AS_MILLISECONDS_FROM_EPOCH / HOUR_AS_MILLISECONDS_FROM_EPOCH,
    unitWeightingStart: 22,
    unitWeightingStop: 6,
    unitWeightingOffset: 22,
    unitWeightingLength: 8,
    unitWeightingMultiplier: 3,
    periodWeightingMultiplier: 2,
    fillInUnits: 0,
  },
  outlier_time: {
    occurrenceBased: true,
    scoringType: 'MAX_OUTLIER',
    unitInMillis: HOUR_AS_MILLISECONDS_FROM_EPOCH,
    periodInMillis: WEEK_AS_MILLISECONDS_FROM_EPOCH,
    periodInUnits:
      WEEK_AS_MILLISECONDS_FROM_EPOCH / HOUR_AS_MILLISECONDS_FROM_EPOCH,
    subFrameInUnits:
      DAY_AS_MILLISECONDS_FROM_EPOCH / HOUR_AS_MILLISECONDS_FROM_EPOCH,
    unitWeightingStart: 22,
    unitWeightingStop: 6,
    unitWeightingOffset: 22,
    unitWeightingLength: 8,
    unitWeightingMultiplier: 3,
    periodWeightingMultiplier: 2,
    fillInUnits: 6,
  },
};

const defaultOutlierValues: OutlierBase = {
  occurrenceBased: undefined,
  scoringType: undefined,
  unitInMillis: undefined,
  periodInMillis: undefined,
  periodInUnits: undefined,
  subFrameInUnits: undefined,
  unitWeightingStart: undefined,
  unitWeightingStop: undefined,
  unitWeightingOffset: undefined,
  unitWeightingLength: undefined,
  unitWeightingMultiplier: undefined,
  periodWeightingMultiplier: undefined,
  fillInUnits: undefined,
};

export const updateFeatures = (
  inputRiskIndicator: RiskIndicatorType
): RiskIndicatorType => {
  const newFeatureList = [];
  const sourceField1 = `${inputRiskIndicator.dataSource}::${inputRiskIndicator.riskField}`;
  newFeatureList.push(sourceField1);
  if (inputRiskIndicator.riskField2) {
    if (inputRiskIndicator.dataSource2) {
      newFeatureList.push(
        `${inputRiskIndicator.dataSource2}::${inputRiskIndicator.riskField2}`
      );
    } else {
      newFeatureList.push(
        `${inputRiskIndicator.dataSource}::${inputRiskIndicator.riskField2}`
      );
    }
  }
  return {
    ...inputRiskIndicator,
    features: newFeatureList,
  };
};

const getNewRiskIndicator: (
  inputRiskIndicatortype: RiskIndicatorType,
  attributeType: string,
  dataSourceId: string,
  riskFieldId: string,
  secondRiskFieldId?: string
) => RiskIndicatorType = (
  inputRiskIndicatortype: RiskIndicatorType,
  attributeType: string,
  dataSourceId: string,
  riskFieldId: string,
  secondRiskFieldId?: string
): RiskIndicatorType => {
  const outlierKey = attributeType as OutlierKeys;
  const outlierValues: OutlierBase =
    attributeType in customOutlierValues
      ? customOutlierValues[outlierKey]
      : defaultOutlierValues;
  const newRiskIndicator: RiskIndicatorType = {
    ...inputRiskIndicatortype,
    attributeType,
    dataSource: dataSourceId,
    riskField: riskFieldId,
    dataSource2: dataSourceId,
    riskField2: secondRiskFieldId,
    valueList: [{ values: [], weight: 0.0 }],
    rangeList: undefined,
    orderList: undefined,
    min: undefined,
    max: undefined,
    featureFilter: [
      {
        field: riskFieldId || '',
        feature:
          dataSourceId && riskFieldId ? `${dataSourceId}::${riskFieldId}` : '',
        type: filterOptionData[1].id || '',
        values: [],
      },
      {
        field: secondRiskFieldId || '',
        feature:
          dataSourceId && riskFieldId
            ? `${dataSourceId}::${secondRiskFieldId}`
            : '',
        type: filterOptionData[1].id || '',
        values: [],
      },
    ],
    timeFilter: undefined,
    agingDays: undefined,
    windowInDays: undefined,
    useData: useData[0].id,
    useOverTime: overTimeData[1].id,
    useDateValue: 0,
    useDateType: dateData[0].id,
    reduceType: reduceData[1].id,
    reduceDateValue: 0,
    reduceDateType: dateData[0].id,
    ...outlierValues,
  };
  return updateFeatures(newRiskIndicator);
};

type riskIndicatorBuilderFunctionType = (
  arg0: riskIndicatorBuilderFunctionInputType
) => RiskIndicatorType;

const valueListOperation: {
  [riskType: string]: (
    inputRiskIndicatorType: RiskIndicatorType,
    dataSourceId?: string | undefined,
    riskFieldId?: string | undefined,
    secondRiskFieldId?: string | undefined
  ) => RiskIndicatorType;
} = {
  value: (
    inputRiskIndicatorType: RiskIndicatorType,
    dataSourceId,
    riskFieldId,
    _secondRiskFieldId
  ): RiskIndicatorType =>
    getNewRiskIndicator(
      inputRiskIndicatorType,
      'value',
      dataSourceId || '',
      riskFieldId || ''
    ),
  outlier_val: (
    inputRiskIndicatorType: RiskIndicatorType,
    dataSourceId,
    riskFieldId,
    _secondRiskFieldId
  ): RiskIndicatorType =>
    getNewRiskIndicator(
      inputRiskIndicatorType,
      'outlier_val',
      dataSourceId || '',
      riskFieldId || ''
    ),
  outlier_time: (
    inputRiskIndicatorType: RiskIndicatorType,
    dataSourceId,
    riskFieldId,
    _secondRiskFieldId
  ): RiskIndicatorType =>
    getNewRiskIndicator(
      inputRiskIndicatorType,
      'outlier_time',
      dataSourceId || '',
      riskFieldId || ''
    ),
  within: (
    inputRiskIndicatorType: RiskIndicatorType,
    dataSourceId,
    riskFieldId,
    _secondRiskFieldId
  ): RiskIndicatorType =>
    getNewRiskIndicator(
      inputRiskIndicatorType,
      'within',
      dataSourceId || '',
      riskFieldId || ''
    ),
  trend: (
    inputRiskIndicatorType: RiskIndicatorType,
    dataSourceId,
    riskFieldId,
    _secondRiskFieldId
  ): RiskIndicatorType =>
    getNewRiskIndicator(
      inputRiskIndicatorType,
      'trend',
      dataSourceId || '',
      riskFieldId || ''
    ),
  unique: (
    inputRiskIndicatorType: RiskIndicatorType,
    dataSourceId,
    riskFieldId,
    _secondRiskFieldId
  ): RiskIndicatorType =>
    getNewRiskIndicator(
      inputRiskIndicatorType,
      'unique',
      dataSourceId || '',
      riskFieldId || ''
    ),
  count: (
    inputRiskIndicatorType: RiskIndicatorType,
    dataSourceId,
    riskFieldId,
    _secondRiskFieldId
  ): RiskIndicatorType =>
    getNewRiskIndicator(
      inputRiskIndicatorType,
      'count',
      dataSourceId || '',
      riskFieldId || ''
    ),
  summation: (
    inputRiskIndicatorType: RiskIndicatorType,
    dataSourceId,
    riskFieldId,
    secondRiskFieldId
  ): RiskIndicatorType =>
    getNewRiskIndicator(
      inputRiskIndicatorType,
      'summation',
      dataSourceId || '',
      riskFieldId || '',
      secondRiskFieldId || ''
    ),
  sentiment: (
    inputRiskIndicatorType: RiskIndicatorType,
    dataSourceId,
    riskFieldId
  ): RiskIndicatorType =>
    getNewRiskIndicator(
      inputRiskIndicatorType,
      'sentiment',
      dataSourceId || '',
      riskFieldId || ''
    ),
  discrepancy: (
    inputRiskIndicatorType: RiskIndicatorType,
    dataSourceId,
    riskFieldId,
    secondRiskFieldId
  ): RiskIndicatorType =>
    getNewRiskIndicator(
      inputRiskIndicatorType,
      'discrepancy',
      dataSourceId || '',
      riskFieldId || '',
      secondRiskFieldId || ''
    ),
  similarity: (
    inputRiskIndicatorType: RiskIndicatorType,
    dataSourceId,
    riskFieldId,
    secondRiskFieldId
  ): RiskIndicatorType =>
    getNewRiskIndicator(
      inputRiskIndicatorType,
      'similarity',
      dataSourceId || '',
      riskFieldId || '',
      secondRiskFieldId || ''
    ),
  normalize: (
    inputRiskIndicatorType: RiskIndicatorType,
    dataSourceId,
    riskFieldId,
    _secondRiskFieldId
  ): RiskIndicatorType =>
    getNewRiskIndicator(
      inputRiskIndicatorType,
      'normalize',
      dataSourceId || '',
      riskFieldId || ''
    ),
};

export const updateOutlierConfig = (
  inputRiskIndicator: RiskIndicatorType
): RiskIndicatorType => {
  const unitMillis = inputRiskIndicator.unitInMillis as number;
  const unitHours = unitMillis / HOUR_AS_MILLISECONDS_FROM_EPOCH;
  const offHourStart = inputRiskIndicator.unitWeightingStart as number;
  const offHourStop = inputRiskIndicator.unitWeightingStop as number;
  const offHourLength =
    offHourStop >= offHourStart
      ? offHourStop - offHourStart
      : 24 + offHourStop - offHourStart;
  const offHourOffset = offHourStart / unitHours;
  const offHourLengthUnits = offHourLength / unitHours;
  const periodMillis = inputRiskIndicator.periodInMillis as number;
  const periodUnits = periodMillis / unitMillis;
  const subframeUnits = 24 / unitHours;
  return {
    ...inputRiskIndicator,
    unitWeightingOffset: offHourOffset,
    unitWeightingLength: offHourLengthUnits,
    periodInUnits: periodUnits,
    subFrameInUnits: subframeUnits,
  };
};

export const updateAging = (
  inputRiskIndicator: RiskIndicatorType
): RiskIndicatorType => {
  const applyAging = inputRiskIndicator.reduceType as string;
  const agingTimeScale = inputRiskIndicator.reduceDateType as string;
  const agingTimeValue = inputRiskIndicator.reduceDateValue as number;
  let updatedAgingDays = agingTimeValue;

  if (applyAging == 'Reduce' && agingTimeScale && agingTimeValue > 0) {
    const agingDaysByTimeScale: {
      [key: string]: (agingDays: number) => number;
    } = {
      YEAR: (agingDays: number) => agingDays * 365,
      MONTH: (agingDays: number) => agingDays * 30,
      DAY: (agingDays: number) => agingDays,
    };

    updatedAgingDays =
      agingTimeScale in agingDaysByTimeScale
        ? agingDaysByTimeScale[agingTimeScale](agingTimeValue)
        : -1;
  } else {
    updatedAgingDays = -1; // will be set to undefined
  }
  return {
    ...inputRiskIndicator,
    agingDays: updatedAgingDays > 0 ? updatedAgingDays : undefined,
  };
};

export const updateTimeFilter = (
  inputRiskIndicator: RiskIndicatorType
): RiskIndicatorType => {
  const riskIndicatorUseData = inputRiskIndicator.useData as string;
  const useOverTime = inputRiskIndicator.useOverTime as string;
  const useDataTimeValue = inputRiskIndicator.useDateValue as number;
  const useDataTimeScale = inputRiskIndicator.useDateType as string;
  const startDate = inputRiskIndicator.useStartDate as string;
  const endDate = inputRiskIndicator.useEndDate as string;
  const newTimeFilter: RiskIndicatorIncludeTimes = {
    type: '',
    value: -1,
    units: '',
    startDate: '',
    endDate: '',
  };
  if (
    riskIndicatorUseData == 'All Data' &&
    useOverTime == 'WITHIN_THE_LAST' &&
    useDataTimeScale &&
    useDataTimeValue > 0
  ) {
    newTimeFilter.type = useOverTime;
    newTimeFilter.value = useDataTimeValue;
    newTimeFilter.units = useDataTimeScale;
  } else if (
    riskIndicatorUseData === 'All Data' &&
    useOverTime === 'BETWEEN_DATES' &&
    startDate &&
    endDate
  ) {
    newTimeFilter.type = useOverTime;
    newTimeFilter.startDate = startDate;
    newTimeFilter.endDate = endDate;
  }
  const hasChanged =
    newTimeFilter.value > 0 ||
    (newTimeFilter.startDate !== '' && newTimeFilter.endDate !== '');
  return {
    ...inputRiskIndicator,
    timeFilter: hasChanged ? newTimeFilter : undefined, // if value wasn't overwritten, we set timeFilter to undefined
  };
};

const riskIndicatorFunctionsByOperator: {
  [operationType: string]: riskIndicatorBuilderFunctionType;
} = {
  changeRiskIndicatorName: ({ inputRiskIndicator, value }) => {
    return {
      ...inputRiskIndicator,
      name: value as string,
    };
  },
  changeRiskIndicatorDescription: ({ inputRiskIndicator, value }) => {
    return {
      ...inputRiskIndicator,
      description: value as string,
    };
  },
  changeRiskType: ({
    inputRiskIndicator,
    dataSourceId,
    riskFieldId,
    secondRiskFieldId,
    value,
  }) => {
    return valueListOperation[value as string](
      inputRiskIndicator,
      dataSourceId,
      riskFieldId,
      secondRiskFieldId
    );
  },
  changeDataSource: ({
    inputRiskIndicator,
    value,
    riskFieldId,
    secondRiskFieldId,
  }) => {
    const newRiskIndicator = secondRiskFieldId
      ? {
          ...inputRiskIndicator,
          dataSource: value as string,
          riskField: riskFieldId as string,
          riskField2: secondRiskFieldId as string,
        }
      : {
          ...inputRiskIndicator,
          dataSource: value as string,
          riskField: riskFieldId as string,
        };
    return updateFeatures(newRiskIndicator);
  },
  changeSecondDataSource: ({
    inputRiskIndicator,
    value,
    secondRiskFieldId,
  }) => {
    const newRiskIndicator = {
      ...inputRiskIndicator,
      dataSource2: value as string,
      riskField2: secondRiskFieldId as string,
    };
    return updateFeatures(newRiskIndicator);
  },
  changeRiskField: ({ inputRiskIndicator, value }) => {
    const newRiskIndicator = {
      ...inputRiskIndicator,
      riskField: value as string,
    };
    return updateFeatures(newRiskIndicator);
  },
  changeSecondRiskField: ({ inputRiskIndicator, value }) => {
    const newRiskIndicator = {
      ...inputRiskIndicator,
      riskField2: value as string,
    };
    return updateFeatures(newRiskIndicator);
  },
  changeRiskFieldCountingValues: ({ inputRiskIndicator, value }) => {
    const values = value as string[];
    return {
      ...inputRiskIndicator,
      values,
    };
  },
  changeRiskFieldSummationValues: ({ inputRiskIndicator, value }) => {
    const values = value as string[];
    return {
      ...inputRiskIndicator,
      values,
    };
  },
  changeRiskFieldDiscrepancyWindowInDays: ({ inputRiskIndicator, value }) => {
    const valueDouble = value as number;
    return {
      ...inputRiskIndicator,
      windowInDays: valueDouble,
    };
  },
  changeRiskFieldNormalizeMin: ({ inputRiskIndicator, value }) => {
    const valueDouble = value as number;
    return {
      ...inputRiskIndicator,
      min: valueDouble,
    };
  },
  changeRiskFieldNormalizeMax: ({ inputRiskIndicator, value }) => {
    const valueDouble = value as number;
    return {
      ...inputRiskIndicator,
      max: valueDouble,
    };
  },
  changeRiskIndicatorValuesAtIndex: ({
    inputRiskIndicator,
    value,
    listIndex,
  }) => {
    const actualRiskIndex = listIndex ?? -1;
    const stringListValue = value as string[];
    const newRiskValueList = inputRiskIndicator.valueList
      ? [...inputRiskIndicator.valueList]
      : [];
    const matchItem =
      actualRiskIndex >= 0 && newRiskValueList.length > 0
        ? newRiskValueList[actualRiskIndex]
        : { values: [], weight: 0.0 };
    if (actualRiskIndex < 0 || newRiskValueList.length <= 0) {
      newRiskValueList.push(matchItem as RiskIndicatorValues);
    } else {
      const newMatchItem = {
        ...matchItem,
        values:
          !stringListValue || stringListValue.length === 0
            ? []
            : stringListValue,
      };
      newRiskValueList[actualRiskIndex] = newMatchItem as RiskIndicatorValues;
    }

    return {
      ...inputRiskIndicator,
      valueList: [...newRiskValueList],
    };
  },
  changeRiskIndicatorValueListWeightAtIndex: ({
    inputRiskIndicator,
    value,
    listIndex,
  }) => {
    const actualRiskIndex = listIndex ?? -1;
    const riskValueList: RiskIndicatorValues[] = inputRiskIndicator.valueList
      ? [...inputRiskIndicator.valueList]
      : [];
    const matchItem: RiskIndicatorValues =
      actualRiskIndex >= 0 && riskValueList.length > 0
        ? riskValueList[actualRiskIndex]
        : { values: [], weight: 0.0 };
    const newMatchItem: RiskIndicatorValues = {
      ...matchItem,
      weight: convertScore(value as number),
    };
    if (actualRiskIndex < 0 || riskValueList.length <= 0) {
      riskValueList.push(newMatchItem as RiskIndicatorValues);
    } else {
      riskValueList[actualRiskIndex] = newMatchItem as RiskIndicatorValues;
    }

    return {
      ...inputRiskIndicator,
      valueList: riskValueList as RiskIndicatorValues[],
    };
  },
  appendNewRiskValueList: ({ inputRiskIndicator }) => {
    const riskValueList = inputRiskIndicator.valueList
      ? [...inputRiskIndicator.valueList]
      : [];
    const newMatchItem: RiskIndicatorValues = { weight: 0.0, values: [] };
    riskValueList.push(newMatchItem as RiskIndicatorValues);

    return {
      ...inputRiskIndicator,
      valueList: riskValueList as RiskIndicatorValues[],
    };
  },
  removeRiskValueFromListAtIndex: ({ inputRiskIndicator, listIndex }) => {
    const actualRiskIndex = listIndex ?? -1;
    if (
      actualRiskIndex >= 0 &&
      inputRiskIndicator.valueList &&
      inputRiskIndicator.valueList.length > 0 &&
      actualRiskIndex < inputRiskIndicator.valueList.length
    ) {
      const riskValueList: RiskIndicatorValues[] =
        inputRiskIndicator.valueList && inputRiskIndicator.valueList.length > 0
          ? [...inputRiskIndicator.valueList]
          : [];
      if (
        actualRiskIndex >= 0 &&
        riskValueList &&
        riskValueList.length > 0 &&
        actualRiskIndex < riskValueList.length &&
        riskValueList.length > 1
      ) {
        riskValueList.splice(actualRiskIndex, 1);
        return {
          ...inputRiskIndicator,
          valueList: riskValueList as RiskIndicatorValues[],
        };
      } else if (riskValueList.length === 1) {
        console.log('Value after');
        riskValueList.forEach((riskValue) => {
          console.log(riskValue.values.join(','));
        });
        return {
          ...inputRiskIndicator,
          valueList: [{ values: [], weight: 0 }] as RiskIndicatorValues[],
        };
      }
    }
    return inputRiskIndicator;
  },
  changeUseData: ({ inputRiskIndicator, value }) => {
    const newRiskIndicator = {
      ...inputRiskIndicator,
      useData: value as string,
    };
    return updateTimeFilter(newRiskIndicator);
  },
  changeUseOverTime: ({ inputRiskIndicator, value }) => {
    const newRiskIndicator = {
      ...inputRiskIndicator,
      useOverTime: value as string,
    };
    return updateTimeFilter(newRiskIndicator);
  },
  changeUseDateValue: ({ inputRiskIndicator, value }) => {
    const newRiskIndicator = {
      ...inputRiskIndicator,
      useDateValue: value as number,
    };
    return updateTimeFilter(newRiskIndicator);
  },
  changeUseDateType: ({ inputRiskIndicator, value }) => {
    const newRiskIndicator = {
      ...inputRiskIndicator,
      useDateType: value as string,
    };
    return updateTimeFilter(newRiskIndicator);
  },
  changeUseStartDate: ({ inputRiskIndicator, value }) => {
    const newRiskIndicator = {
      ...inputRiskIndicator,
      useStartDate: value as string,
    };
    return updateTimeFilter(newRiskIndicator);
  },
  changeUseEndDate: ({ inputRiskIndicator, value }) => {
    const newRiskIndicator = {
      ...inputRiskIndicator,
      useEndDate: value as string,
    };
    return updateTimeFilter(newRiskIndicator);
  },
  changeReduceType: ({ inputRiskIndicator, value }) => {
    const newRiskIndicator = {
      ...inputRiskIndicator,
      reduceType: value as string,
    };
    return updateAging(newRiskIndicator);
  },
  changeReduceDateValue: ({ inputRiskIndicator, value }) => {
    const newRiskIndicator = {
      ...inputRiskIndicator,
      reduceDateValue: value as number,
    };
    return updateAging(newRiskIndicator);
  },
  changeReduceDateType: ({ inputRiskIndicator, value }) => {
    const newRiskIndicator = {
      ...inputRiskIndicator,
      reduceDateType: value as string,
    };
    return updateAging(newRiskIndicator);
  },
  changeOutlierScoringType: ({ inputRiskIndicator, value }) => {
    return {
      ...inputRiskIndicator,
      scoringType: value as string,
    };
  },
  changeOutlierUnitInMillis: ({ inputRiskIndicator, value }) => {
    const newRiskIndicator = {
      ...inputRiskIndicator,
      unitInMillis: value as number,
    };
    return updateOutlierConfig(newRiskIndicator);
  },
  changeOutlierPeriodInMillis: ({ inputRiskIndicator, value }) => {
    const newRiskIndicator = {
      ...inputRiskIndicator,
      periodInMillis: value as number,
    };
    return updateOutlierConfig(newRiskIndicator);
  },
  changeOutlierUnitWeightingStart: ({ inputRiskIndicator, value }) => {
    const newRiskIndicator = {
      ...inputRiskIndicator,
      unitWeightingStart: value as number,
    };
    return updateOutlierConfig(newRiskIndicator);
  },
  changeOutlierUnitWeightingStop: ({ inputRiskIndicator, value }) => {
    const newRiskIndicator = {
      ...inputRiskIndicator,
      unitWeightingStop: value as number,
    };
    return updateOutlierConfig(newRiskIndicator);
  },
  changeOutlierUnitWeightingMultiplier: ({ inputRiskIndicator, value }) => {
    return {
      ...inputRiskIndicator,
      unitWeightingMultiplier: value as number,
    };
  },
  changeOutlierPeriodWeightingMultiplier: ({ inputRiskIndicator, value }) => {
    return {
      ...inputRiskIndicator,
      periodWeightingMultiplier: value as number,
    };
  },
  changeOutlierFillInUnits: ({ inputRiskIndicator, value }) => {
    return {
      ...inputRiskIndicator,
      fillInUnits: value as number,
    };
  },
  changeExcludeItemsFieldAtIndex: ({
    inputRiskIndicator,
    value,
    listIndex,
  }) => {
    const recordExcludeItemIndex = listIndex ?? -1;
    const recordExcludeItemsList: RiskIndicatorExcludeItems[] =
      inputRiskIndicator.featureFilter
        ? [...inputRiskIndicator.featureFilter]
        : [];
    const matchItem: RiskIndicatorExcludeItems =
      recordExcludeItemIndex >= 0 && recordExcludeItemsList.length > 0
        ? recordExcludeItemsList[recordExcludeItemIndex]
        : { field: '', feature: '', values: [], type: '' };
    const newMatchItem: RiskIndicatorExcludeItems = {
      ...matchItem,
      field: value as string,
      feature: `${inputRiskIndicator.dataSource}::${value as string}`,
    };
    recordExcludeItemsList[recordExcludeItemIndex] =
      newMatchItem as RiskIndicatorExcludeItems;

    return {
      ...inputRiskIndicator,
      featureFilter: recordExcludeItemsList as RiskIndicatorExcludeItems[],
    };
  },
  changeFilterOptionDataAtIndex: ({ inputRiskIndicator, value, listIndex }) => {
    const recordExcludeItemIndex = listIndex ?? -1;
    const recordExcludeItemsList: RiskIndicatorExcludeItems[] =
      inputRiskIndicator.featureFilter
        ? [...inputRiskIndicator.featureFilter]
        : [];
    const matchItem: RiskIndicatorExcludeItems =
      recordExcludeItemIndex >= 0 && recordExcludeItemsList.length > 0
        ? recordExcludeItemsList[recordExcludeItemIndex]
        : { field: '', feature: '', values: [], type: '' };
    const newMatchItem: RiskIndicatorExcludeItems = {
      ...matchItem,
      type: value as string,
    };
    recordExcludeItemsList[recordExcludeItemIndex] =
      newMatchItem as RiskIndicatorExcludeItems;

    return {
      ...inputRiskIndicator,
      featureFilter: recordExcludeItemsList as RiskIndicatorExcludeItems[],
    };
  },
  changeValueDataAtIndex: ({ inputRiskIndicator, value, listIndex }) => {
    const recordExcludeItemIndex = listIndex ?? -1;
    const values = value as string[];
    const recordExcludeItemsList: RiskIndicatorExcludeItems[] =
      inputRiskIndicator.featureFilter
        ? [...inputRiskIndicator.featureFilter]
        : [];
    const matchItem: RiskIndicatorExcludeItems =
      recordExcludeItemIndex >= 0 && recordExcludeItemsList.length > 0
        ? recordExcludeItemsList[recordExcludeItemIndex]
        : { field: '', feature: '', values: [], type: '' };
    const newMatchItem: RiskIndicatorExcludeItems = {
      ...matchItem,
      values,
    };
    recordExcludeItemsList[recordExcludeItemIndex] =
      newMatchItem as RiskIndicatorExcludeItems;

    return {
      ...inputRiskIndicator,
      featureFilter: recordExcludeItemsList as RiskIndicatorExcludeItems[],
    };
  },
  addRiskValueExclusion: ({ inputRiskIndicator }) => {
    const recordExcludeItemsList = inputRiskIndicator.featureFilter
      ? [...inputRiskIndicator.featureFilter]
      : [];
    const newMatchItem: RiskIndicatorExcludeItems = {
      field: '',
      feature: '',
      values: [],
      type: '',
    };
    recordExcludeItemsList.push(newMatchItem as RiskIndicatorExcludeItems);

    return {
      ...inputRiskIndicator,
      featureFilter: recordExcludeItemsList as RiskIndicatorExcludeItems[],
    };
  },
  removeRiskValueExclusionAtIndex: ({ inputRiskIndicator, listIndex }) => {
    const actualRiskIndex = listIndex ?? -1;
    if (
      actualRiskIndex >= 0 &&
      inputRiskIndicator.featureFilter &&
      inputRiskIndicator.featureFilter.length > 0 &&
      actualRiskIndex < inputRiskIndicator.featureFilter.length
    ) {
      const exclusionsList: RiskIndicatorExcludeItems[] =
        inputRiskIndicator.featureFilter &&
        inputRiskIndicator.featureFilter.length > 0
          ? [...inputRiskIndicator.featureFilter]
          : [];
      if (
        actualRiskIndex >= 0 &&
        exclusionsList &&
        exclusionsList.length > 0 &&
        actualRiskIndex < exclusionsList.length
      ) {
        exclusionsList.splice(actualRiskIndex, 1);
      }
      return {
        ...inputRiskIndicator,
        featureFilter: exclusionsList as RiskIndicatorExcludeItems[],
      };
    } else {
      return inputRiskIndicator;
    }
  },
  changeRiskIndicatorRangeStartAtIndex: ({
    inputRiskIndicator,
    value,
    listIndex,
  }) => {
    const recordExcludeItemIndex = listIndex ?? -1;
    const rangeList: RiskIndicatorRangeValues[] = inputRiskIndicator.rangeList
      ? [...inputRiskIndicator.rangeList]
      : [];
    const matchItem: RiskIndicatorRangeValues =
      recordExcludeItemIndex >= 0 &&
      rangeList.length > 0 &&
      recordExcludeItemIndex < rangeList.length
        ? rangeList[recordExcludeItemIndex]
        : { rangeStart: '0', rangeEnd: '0', weight: 0 };
    const newMatchItem: RiskIndicatorRangeValues = {
      ...matchItem,
      rangeStart: value as string,
    };
    rangeList[recordExcludeItemIndex] =
      newMatchItem as RiskIndicatorRangeValues;

    return {
      ...inputRiskIndicator,
      rangeList: rangeList as RiskIndicatorRangeValues[],
    };
  },
  changeRiskIndicatorRangeEndAtIndex: ({
    inputRiskIndicator,
    value,
    listIndex,
  }) => {
    const recordExcludeItemIndex = listIndex ?? -1;
    const rangeList: RiskIndicatorRangeValues[] = inputRiskIndicator.rangeList
      ? [...inputRiskIndicator.rangeList]
      : [];
    const matchItem: RiskIndicatorRangeValues =
      recordExcludeItemIndex >= 0 &&
      rangeList.length > 0 &&
      recordExcludeItemIndex < rangeList.length
        ? rangeList[recordExcludeItemIndex]
        : { rangeStart: '0', rangeEnd: '0', weight: 0 };
    const newMatchItem: RiskIndicatorRangeValues = {
      ...matchItem,
      rangeEnd: value as string,
    };
    rangeList[recordExcludeItemIndex] =
      newMatchItem as RiskIndicatorRangeValues;

    return {
      ...inputRiskIndicator,
      rangeList: rangeList as RiskIndicatorRangeValues[],
    };
  },
  changeRiskIndicatorRangeWeightAtIndex: ({
    inputRiskIndicator,
    value,
    listIndex,
  }) => {
    const recordExcludeItemIndex = listIndex ?? -1;
    const rangeList: RiskIndicatorRangeValues[] = inputRiskIndicator.rangeList
      ? [...inputRiskIndicator.rangeList]
      : [];
    const matchItem: RiskIndicatorRangeValues =
      recordExcludeItemIndex >= 0 &&
      rangeList.length > 0 &&
      recordExcludeItemIndex < rangeList.length
        ? rangeList[recordExcludeItemIndex]
        : { rangeStart: '0', rangeEnd: '0', weight: 0 };
    const newMatchItem: RiskIndicatorRangeValues = {
      ...matchItem,
      weight: convertScore(value as number),
    };
    rangeList[recordExcludeItemIndex] =
      newMatchItem as RiskIndicatorRangeValues;

    return {
      ...inputRiskIndicator,
      rangeList: rangeList as RiskIndicatorRangeValues[],
    };
  },
  appendNewRiskRangeList: ({ inputRiskIndicator }) => {
    const rangeList: RiskIndicatorRangeValues[] = inputRiskIndicator.rangeList
      ? [...inputRiskIndicator.rangeList]
      : [];
    const newMatchItem: RiskIndicatorRangeValues = {
      rangeStart: '0',
      rangeEnd: '0',
      weight: 0,
    };
    rangeList.push(newMatchItem as RiskIndicatorRangeValues);

    return {
      ...inputRiskIndicator,
      rangeList: rangeList as RiskIndicatorRangeValues[],
    };
  },
  removeRiskValueFromRangeListAtIndex: ({ inputRiskIndicator, listIndex }) => {
    const actualRiskIndex = listIndex ?? -1;
    if (
      actualRiskIndex >= 0 &&
      inputRiskIndicator.rangeList &&
      inputRiskIndicator.rangeList.length > 0 &&
      actualRiskIndex < inputRiskIndicator.rangeList.length
    ) {
      const newRangeList: RiskIndicatorRangeValues[] =
        inputRiskIndicator.rangeList && inputRiskIndicator.rangeList.length > 0
          ? [...inputRiskIndicator.rangeList]
          : [];
      if (
        actualRiskIndex >= 0 &&
        newRangeList &&
        newRangeList.length > 0 &&
        actualRiskIndex < newRangeList.length
      ) {
        newRangeList.splice(actualRiskIndex, 1);
      }
      return {
        ...inputRiskIndicator,
        rangeList: newRangeList as RiskIndicatorRangeValues[],
      };
    } else {
      return inputRiskIndicator;
    }
  },
  changeInstanceCount: ({ inputRiskIndicator, value }) => {
    return {
      ...inputRiskIndicator,
      instanceCount: value as number,
    };
  },
  changeOrderList: ({ inputRiskIndicator, value }) => {
    const orderListValueString = value as string;
    const orderList =
      !orderListValueString || orderListValueString.length === 0
        ? []
        : orderListValueString.split(',').map((orderListValue) => {
            return parseInt(orderListValue);
          });
    return {
      ...inputRiskIndicator,
      orderList: orderList as number[],
    };
  },
};

const createNewRiskIndicatorObject: (
  dataSource: string,
  riskField: string
) => RiskIndicatorType = (dataSource, riskField): RiskIndicatorType => {
  const inputRiskIndicatorType: RiskIndicatorType = {
    id: 'NEW',
    name: '',
    attributeType: 'value',
  };
  const newDefaultRiskIndicatorType: RiskIndicatorType = getNewRiskIndicator(
    inputRiskIndicatorType,
    'value',
    dataSource,
    riskField
  );
  return newDefaultRiskIndicatorType;
};

const buildNewRiskIndicator: (inputArgument: {
  inputRiskIndicator: RiskIndicatorType;
  operation: string;
  value?: string[] | string | number | undefined;
  listIndex: number | undefined;
  dataSourceId?: string | undefined;
  riskFieldId?: string | undefined;
  secondRiskFieldId?: string | undefined;
}) => RiskIndicatorType = ({
  inputRiskIndicator,
  operation,
  value,
  listIndex,
  dataSourceId,
  riskFieldId,
  secondRiskFieldId,
}): RiskIndicatorType => {
  const newRiskIndicator: RiskIndicatorType = riskIndicatorFunctionsByOperator[
    operation
  ]({
    inputRiskIndicator,
    value,
    listIndex,
    dataSourceId,
    riskFieldId,
    secondRiskFieldId,
  });
  return newRiskIndicator;
};

const attributesSlice = createSlice({
  name: `attributes`,
  initialState,
  reducers: {
    riskValueChangeHandler: (state, param) => {
      const { payload } = param;
      const {
        id,
        operation,
        listIndex,
        value,
        dataSourceId,
        riskFieldId,
        secondRiskFieldId,
      } = payload as {
        id: string;
        value: string;
        operation: string;
        listIndex?: number | undefined;
        dataSourceId: string | undefined;
        riskFieldId: string | undefined;
        secondRiskFieldId: string | undefined;
      };
      if (id && id === 'NEW' && state.newAttribute) {
        const inputRiskIndicator: RiskIndicatorType = state.newAttribute;
        const newRiskIndicator: RiskIndicatorType = buildNewRiskIndicator({
          inputRiskIndicator,
          operation,
          value,
          listIndex,
          dataSourceId,
          riskFieldId,
          secondRiskFieldId,
        });
        return {
          ...state,
          newAttribute: newRiskIndicator,
          currentAttributeId: 'NEW',
        };
      } else if (id && id !== 'NEW') {
        const inputRiskIndicator: RiskIndicatorType = state.attributes[id];
        const newRiskIndicator: RiskIndicatorType = buildNewRiskIndicator({
          inputRiskIndicator,
          operation,
          value,
          listIndex,
          dataSourceId,
          riskFieldId,
          secondRiskFieldId,
        });
        return {
          ...state,
          attributes: { ...state.attributes, [id]: newRiskIndicator },
          currentAttributeId: id,
        };
      }
      return state;
    },
    riskValueClickHandler: (state, param) => {
      const { payload } = param;
      const { id, operation, listIndex } = payload as {
        id: string;
        operation: string;
        listIndex?: number | undefined;
      };
      if (id && id === 'NEW' && state.newAttribute) {
        const inputRiskIndicator: RiskIndicatorType = state.newAttribute;
        const newRiskIndicator: RiskIndicatorType = buildNewRiskIndicator({
          inputRiskIndicator,
          operation,
          listIndex,
        });
        return {
          ...state,
          newAttribute: newRiskIndicator,
          currentAttributeId: 'NEW',
        };
      } else if (id && id !== 'NEW') {
        const inputRiskIndicator: RiskIndicatorType = state.attributes[id];
        const newRiskIndicator: RiskIndicatorType = buildNewRiskIndicator({
          inputRiskIndicator,
          operation,
          listIndex,
        });
        return {
          ...state,
          attributes: { ...state.attributes, [id]: newRiskIndicator },
          currentAttributeId: id,
        };
      }
      return state;
    },
    addNewRiskIndicator: (state, param) => {
      const { payload } = param;
      const { dataSourceId, riskFieldId } = payload as {
        dataSourceId: string;
        riskFieldId: string;
      };
      const newRiskIndicator: RiskIndicatorType = createNewRiskIndicatorObject(
        dataSourceId,
        riskFieldId
      );
      return {
        ...state,
        newAttribute: newRiskIndicator,
        currentAttributeId: 'NEW',
      };
    },
    clearAttributeMessage: (state) => {
      return {
        ...state,
        hasDeleteAttributeMessage: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveAttributes.pending, (state) => {
        state.loading = true;
        state.isAttributesInitialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveAttributes.fulfilled,
        (state, { payload }: PayloadAction<RiskIndicatorType[]>) => {
          state.loading = false;
          const attributesByAttributeId: { [id: string]: RiskIndicatorType } =
            {};
          payload.map((attribute) => {
            const { id } = attribute;
            if (id) {
              if (!(id in attributesByAttributeId)) {
                attributesByAttributeId[id] = attribute;
              } else {
                const oldAttribute = attributesByAttributeId[id];
                if (attribute.lastUpdate && oldAttribute.lastUpdate) {
                  if (attribute.lastUpdate > oldAttribute.lastUpdate) {
                    attributesByAttributeId[id] = attribute;
                  }
                } else if (attribute.lastUpdate && !oldAttribute.lastUpdate) {
                  attributesByAttributeId[id] = attribute;
                }
              }
            }
          });
          state.isAttributesInitialized = true;
          state.attributes = attributesByAttributeId;
          state.newAttribute = null;
          state.currentAttributeId = null;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveAttributes.rejected, (state) => {
        state.loading = false;
        state.attributes = {};
        state.isAttributesInitialized = true;
        state.newAttribute = null;
        state.currentAttributeId = null;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveAttribute.pending, (state) => {
        state.loading = true;
        state.isAttributesInitialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveAttribute.fulfilled,
        (state, { payload }: PayloadAction<RiskIndicatorType>) => {
          state.loading = false;
          const { id } = payload;
          if (id) {
            state.attributes = { [id]: payload };
          }
          state.isAttributesInitialized = true;
          state.newAttribute = null;
          state.currentAttributeId = id;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveAttribute.rejected, (state) => {
        state.loading = false;
        state.attributes = {};
        state.isAttributesInitialized = true;
        state.newAttribute = null;
        state.currentAttributeId = null;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(saveAttribute.pending, (state) => {
        state.loading = true;
        state.isAttributesInitialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        saveAttribute.fulfilled,
        (state, { payload }: PayloadAction<string>) => {
          state.loading = false;
          const id = payload as string;
          if (id && state.newAttribute) {
            state.attributes = {
              ...state.attributes,
              [id]: { ...state.newAttribute, id: id },
            };
            state.newAttribute = null;
          }
          state.isAttributesInitialized = true;
          state.currentAttributeId = id;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(saveAttribute.rejected, (state) => {
        state.loading = false;
        state.isAttributesInitialized = true;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(deleteAttribute.pending, (state) => {
        state.loading = true;
        state.isAttributesInitialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        deleteAttribute.fulfilled,
        (state, { payload }: PayloadAction<string>) => {
          state.loading = false;
          const attributeId = payload as string;
          const { [attributeId]: _deletedAttributeId, ...newAttributes } =
            state.attributes;
          state.attributes = newAttributes;
          state.currentAttributeId = null;
          state.newAttribute = null;
          state.isAttributesInitialized = true;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(deleteAttribute.rejected, (state) => {
        state.loading = false;
        state.isAttributesInitialized = true;
        state.hasDeleteAttributeMessage = true;
        state.status = ResponseStatus.FAILED;
      });
  },
});

export const attributesSelector = (state: RootState): RiskIndicatorType[] =>
  (state.attributes?.attributes &&
    Object.values(state.attributes?.attributes)) ??
  [];

export const newAttributeSelector = (
  state: RootState
): RiskIndicatorType | null => state.attributes.newAttribute;

export const newAttributeDatasourceIdSelector = (
  state: RootState
): string | null => state.attributes?.newAttribute?.dataSource ?? null;

export const newAttributeRiskFieldIdSelector = (
  state: RootState
): string | null => state.attributes?.newAttribute?.riskField ?? null;

export const newAttributeDatasource2IdSelector = (
  state: RootState
): string | null => state.attributes?.newAttribute?.dataSource2 ?? null;

export const newAttributeRiskField2IdSelector = (
  state: RootState
): string | null => state.attributes?.newAttribute?.riskField2 ?? null;

export const newAttributeAttributeTypeSelector = (
  state: RootState
): string | null => state.attributes?.newAttribute?.attributeType ?? null;

export const attributesByIdSelector = (
  state: RootState
): { [id: string]: RiskIndicatorType } => state.attributes?.attributes ?? null;

export const attributeByIdSelector =
  (
    attributeId: string
  ): ((state: RootState) => RiskIndicatorType | undefined) =>
  (state: RootState) =>
    state.attributes?.attributes && state.attributes?.attributes[attributeId];

export const dataSourceByAttributeIdSelector =
  (attributeId: string): ((state: RootState) => string) =>
  (state: RootState) =>
    state.attributes?.attributes &&
    (state.attributes?.attributes[attributeId]?.dataSource ?? '');

export const riskFieldByAttributeIdSelector =
  (attributeId: string): ((state: RootState) => string) =>
  (state: RootState) =>
    state.attributes?.attributes &&
    (state.attributes?.attributes[attributeId]?.riskField ?? '');

export const dataSource2ByAttributeIdSelector =
  (attributeId: string): ((state: RootState) => string) =>
  (state: RootState) =>
    state.attributes?.attributes &&
    (state.attributes?.attributes[attributeId]?.dataSource2 ?? '');

export const riskField2ByAttributeIdSelector =
  (attributeId: string): ((state: RootState) => string) =>
  (state: RootState) =>
    state.attributes?.attributes &&
    (state.attributes?.attributes[attributeId]?.riskField2 ?? '');

export const attributeTypeByAttributeIdSelector =
  (attributeId: string): ((state: RootState) => string) =>
  (state: RootState) =>
    state.attributes?.attributes &&
    (state.attributes?.attributes[attributeId]?.attributeType ?? '');

export const attributeNameByIdSelector =
  (attributeId: string): ((state: RootState) => string | undefined) =>
  (state: RootState) =>
    state.attributes?.attributes &&
    (state.attributes?.attributes[attributeId]?.name ?? '');

export const getCurrentAttributeIdSelector =
  (
    attributeId: string
  ): ((state: RootState) => RiskIndicatorType | undefined) =>
  (state: RootState) => {
    if (attributeId === 'NEW') {
      return state.attributes.newAttribute;
    }
    return (
      state.attributes?.attributes && state.attributes?.attributes[attributeId]
    );
  };

export const getCurrentAttributeDataSourceIdSelector: (
  state: RootState
) => string = (state: RootState) => {
  const currentAttribute = getCurrentAttributeIdSelector(
    state.attributes.currentAttributeId
  )(state);
  return currentAttribute?.dataSource ?? '';
};

export const getIsAttributesInitialized = (state: RootState): boolean =>
  state.attributes?.isAttributesInitialized ?? false;

export const getAttributeDataSourceIdSelector =
  (attributeId: string): ((state: RootState) => string) =>
  (state: RootState) => {
    const currentAttribute = state.attributes?.attributes[attributeId];
    return currentAttribute?.dataSource ?? '';
  };

export const getHasDeleteAttributeMessage = (state: RootState): boolean => {
  return state.attributes?.hasDeleteAttributeMessage ?? false;
};

export const {
  riskValueChangeHandler,
  riskValueClickHandler,
  addNewRiskIndicator,
  clearAttributeMessage,
} = attributesSlice.actions;
export default attributesSlice.reducer;
