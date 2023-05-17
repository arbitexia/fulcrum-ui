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
import { checkAuthToken } from '@/libs/auth-token';

const initialState: ReduxJson.AttributesState = {
  loading: true,
  status: null,
  isAttributesInitialized: false,
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
};

type riskIndicatorBuilderFunctionType = (
  arg0: riskIndicatorBuilderFunctionInputType
) => RiskIndicatorType;

const valueListOperation: {
  [riskType: string]: (
    inputRiskIndicatorType: RiskIndicatorType
  ) => RiskIndicatorType;
} = {
  value: (inputRiskIndicatorType: RiskIndicatorType): RiskIndicatorType => {
    return {
      ...inputRiskIndicatorType,
      attributeType: 'value',
      dataSource: 'access',
      riskField: 'id',
      dataSource2: undefined,
      riskField2: undefined,
      valueList: [{ values: [], weight: 0.0 }],
      rangeList: undefined,
      orderList: undefined,
      min: undefined,
      max: undefined,
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
      featureFilter: undefined,
      timeFilter: undefined,
      agingDays: undefined,
    };
  },
  outlier_val: (
    inputRiskIndicatorType: RiskIndicatorType
  ): RiskIndicatorType => {
    return {
      ...inputRiskIndicatorType,
      attributeType: 'outlier_val',
      dataSource: 'access',
      riskField: 'id',
      dataSource2: undefined,
      riskField2: undefined,
      valueList: undefined,
      rangeList: [{ rangeStart: 0, rangeEnd: 0, weight: 0.0 }],
      orderList: undefined,
      min: undefined,
      max: undefined,
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
      featureFilter: undefined,
      timeFilter: undefined,
      agingDays: undefined,
    };
  },
  outlier_time: (
    inputRiskIndicatorType: RiskIndicatorType
  ): RiskIndicatorType => {
    return {
      ...inputRiskIndicatorType,
      attributeType: 'outlier_time',
      dataSource: 'access',
      riskField: 'id',
      dataSource2: undefined,
      riskField2: undefined,
      valueList: undefined,
      rangeList: [{ rangeStart: 0, rangeEnd: 0, weight: 0.0 }],
      orderList: undefined,
      min: undefined,
      max: undefined,
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
      featureFilter: undefined,
      timeFilter: undefined,
      agingDays: undefined,
    };
  },
  within: (inputRiskIndicatorType: RiskIndicatorType): RiskIndicatorType => {
    return {
      ...inputRiskIndicatorType,
      attributeType: 'within',
      dataSource: 'access',
      riskField: 'id',
      dataSource2: undefined,
      riskField2: undefined,
      valueList: undefined,
      rangeList: [{ rangeStart: 0, rangeEnd: 0, weight: 0.0 }],
      orderList: undefined,
      min: undefined,
      max: undefined,
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
      featureFilter: undefined,
      timeFilter: undefined,
      agingDays: undefined,
    };
  },
  trend: (inputRiskIndicatorType: RiskIndicatorType): RiskIndicatorType => {
    return {
      ...inputRiskIndicatorType,
      attributeType: 'trend',
      dataSource: 'access',
      riskField: 'id',
      dataSource2: undefined,
      riskField2: undefined,
      valueList: undefined,
      rangeList: [{ rangeStart: 0, rangeEnd: 0, weight: 0.0 }],
      orderList: undefined,
      min: undefined,
      max: undefined,
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
      featureFilter: undefined,
      timeFilter: undefined,
      agingDays: undefined,
    };
  },
  unique: (inputRiskIndicatorType: RiskIndicatorType): RiskIndicatorType => {
    return {
      ...inputRiskIndicatorType,
      attributeType: 'unique',
      dataSource: 'access',
      riskField: 'id',
      dataSource2: undefined,
      riskField2: undefined,
      valueList: undefined,
      rangeList: [{ rangeStart: 0, rangeEnd: 0, weight: 0.0 }],
      orderList: undefined,
      min: undefined,
      max: undefined,
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
      featureFilter: undefined,
      timeFilter: undefined,
      agingDays: undefined,
    };
  },
  count: (inputRiskIndicatorType: RiskIndicatorType): RiskIndicatorType => {
    return {
      ...inputRiskIndicatorType,
      attributeType: 'count',
      dataSource: 'access',
      riskField: 'id',
      dataSource2: undefined,
      riskField2: undefined,
      valueList: undefined,
      rangeList: [{ rangeStart: 0, rangeEnd: 0, weight: 0.0 }],
      orderList: undefined,
      min: undefined,
      max: undefined,
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
      featureFilter: undefined,
      timeFilter: undefined,
      agingDays: undefined,
    };
  },
  summation: (inputRiskIndicatorType: RiskIndicatorType): RiskIndicatorType => {
    return {
      ...inputRiskIndicatorType,
      attributeType: 'summation',
      dataSource: 'access',
      riskField: 'id',
      dataSource2: undefined,
      riskField2: undefined,
      valueList: undefined,
      rangeList: [{ rangeStart: 0, rangeEnd: 0, weight: 0.0 }],
      orderList: undefined,
      min: undefined,
      max: undefined,
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
      featureFilter: undefined,
      timeFilter: undefined,
      agingDays: undefined,
    };
  },
  sentiment: (inputRiskIndicatorType: RiskIndicatorType): RiskIndicatorType => {
    return {
      ...inputRiskIndicatorType,
      attributeType: 'sentiment',
      dataSource: 'access',
      riskField: 'id',
      dataSource2: undefined,
      riskField2: undefined,
      valueList: undefined,
      rangeList: [{ rangeStart: 0, rangeEnd: 0, weight: 0.0 }],
      orderList: undefined,
      min: undefined,
      max: undefined,
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
      featureFilter: undefined,
      timeFilter: undefined,
      agingDays: undefined,
    };
  },
  discrepancy: (
    inputRiskIndicatorType: RiskIndicatorType
  ): RiskIndicatorType => {
    return {
      ...inputRiskIndicatorType,
      attributeType: 'discrepancy',
      dataSource: 'access',
      riskField: 'id',
      dataSource2: undefined,
      riskField2: undefined,
      valueList: undefined,
      rangeList: [{ rangeStart: 0, rangeEnd: 0, weight: 0.0 }],
      orderList: undefined,
      min: undefined,
      max: undefined,
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
      featureFilter: undefined,
      timeFilter: undefined,
      agingDays: undefined,
    };
  },
  similarity: (
    inputRiskIndicatorType: RiskIndicatorType
  ): RiskIndicatorType => {
    return {
      ...inputRiskIndicatorType,
      attributeType: 'similarity',
      dataSource: 'access',
      riskField: 'id',
      dataSource2: undefined,
      riskField2: undefined,
      valueList: undefined,
      rangeList: [{ rangeStart: 0, rangeEnd: 0, weight: 0.0 }],
      orderList: undefined,
      min: undefined,
      max: undefined,
      occurrenceBased: undefined,
      scoringType: undefined,
      unitInMillis: undefined,
      periodInUnits: undefined,
      subFrameInUnits: undefined,
      unitWeightingStart: undefined,
      unitWeightingStop: undefined,
      unitWeightingOffset: undefined,
      unitWeightingLength: undefined,
      unitWeightingMultiplier: undefined,
      periodWeightingMultiplier: undefined,
      fillInUnits: undefined,
      featureFilter: undefined,
      timeFilter: undefined,
      agingDays: undefined,
    };
  },
  normalize: (inputRiskIndicatorType: RiskIndicatorType): RiskIndicatorType => {
    return {
      ...inputRiskIndicatorType,
      attributeType: 'normalize',
      dataSource: 'access',
      riskField: 'id',
      dataSource2: undefined,
      riskField2: undefined,
      valueList: undefined,
      rangeList: [{ rangeStart: 0, rangeEnd: 0, weight: 0.0 }],
      orderList: undefined,
      min: undefined,
      max: undefined,
      occurrenceBased: undefined,
      scoringType: undefined,
      unitInMillis: undefined,
      periodInUnits: undefined,
      subFrameInUnits: undefined,
      unitWeightingStart: undefined,
      unitWeightingStop: undefined,
      unitWeightingOffset: undefined,
      unitWeightingLength: undefined,
      unitWeightingMultiplier: undefined,
      periodWeightingMultiplier: undefined,
      fillInUnits: undefined,
      featureFilter: undefined,
      timeFilter: undefined,
      agingDays: undefined,
    };
  },
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
  const useData = inputRiskIndicator.useData as string;
  const useOverTime = inputRiskIndicator.useOverTime as string;
  const useDataTimeValue = inputRiskIndicator.useDateValue as number;
  const useDataTimeScale = inputRiskIndicator.useDateType as string;
  const newTimeFilter: RiskIndicatorIncludeTimes = {
    type: '',
    value: -1,
    units: '',
    startDate: '',
    endDate: '',
  };
  // currently, the UI only supports 'All Data' and 'WITHIN_THE_LAST' combinations for filtering
  if (
    useData == 'All Data' &&
    useOverTime == 'WITHIN_THE_LAST' &&
    useDataTimeScale &&
    useDataTimeValue > 0
  ) {
    newTimeFilter.type = useOverTime;
    newTimeFilter.value = useDataTimeValue;
    newTimeFilter.units = useDataTimeScale;
  }
  return {
    ...inputRiskIndicator,
    timeFilter: newTimeFilter.value > 0 ? newTimeFilter : undefined, // if value wasn't overwritten, we set timeFilter to undefined
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
  changeRiskType: ({ inputRiskIndicator, value }) => {
    return valueListOperation[value as string](inputRiskIndicator);
  },
  changeDataSource: ({ inputRiskIndicator, value }) => {
    const newRiskIndicator = {
      ...inputRiskIndicator,
      dataSource: value as string,
      riskField: '',
    };
    return updateFeatures(newRiskIndicator);
  },
  changeSecondDataSource: ({ inputRiskIndicator, value }) => {
    const newRiskIndicator = {
      ...inputRiskIndicator,
      dataSource2: value as string,
      riskField2: '',
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
    const valueString = value as string;
    return {
      ...inputRiskIndicator,
      values:
        !valueString || valueString.length === 0 ? [] : valueString.split(', '),
    };
  },
  changeRiskFieldSummationValues: ({ inputRiskIndicator, value }) => {
    const valueString = value as string;
    return {
      ...inputRiskIndicator,
      values:
        !valueString || valueString.length === 0 ? [] : valueString.split(', '),
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
        actualRiskIndex < riskValueList.length
      ) {
        riskValueList.splice(actualRiskIndex, 1);
      }
      return {
        ...inputRiskIndicator,
        valueList: riskValueList as RiskIndicatorValues[],
      };
    } else {
      return inputRiskIndicator;
    }
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
    const stringListValue = value as string;
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
      values:
        !stringListValue || stringListValue.length === 0
          ? []
          : stringListValue.split(', '),
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
        : { rangeStart: 0, rangeEnd: 0, weight: 0 };
    const newMatchItem: RiskIndicatorRangeValues = {
      ...matchItem,
      rangeStart: parseFloat(value as string) as number,
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
        : { rangeStart: 0, rangeEnd: 0, weight: 0 };
    const newMatchItem: RiskIndicatorRangeValues = {
      ...matchItem,
      rangeEnd: parseFloat(value as string) as number,
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
        : { rangeStart: 0, rangeEnd: 0, weight: 0 };
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
      rangeStart: 0,
      rangeEnd: 0,
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

const createNewRiskIndicatorObject: () => RiskIndicatorType =
  (): RiskIndicatorType => {
    const newDefaultRiskIndicatorType: RiskIndicatorType = {
      id: 'NEW',
      attributeType: 'value',
      dataSource: 'access',
      riskField: 'id',
      name: '',
      valueList: [{ values: [], weight: 0.0 }],
      rangeList: undefined,
      orderList: undefined,
      featureFilter: undefined,
    };
    return newDefaultRiskIndicatorType;
  };

const buildNewRiskIndicator: (inputArgument: {
  inputRiskIndicator: RiskIndicatorType;
  operation: string;
  value?: string[] | string | number | undefined;
  listIndex: number | undefined;
}) => RiskIndicatorType = ({
  inputRiskIndicator,
  operation,
  value,
  listIndex,
}): RiskIndicatorType => {
  const newRiskIndicator: RiskIndicatorType = riskIndicatorFunctionsByOperator[
    operation
  ]({ inputRiskIndicator, value, listIndex });
  return newRiskIndicator;
};

const attributesSlice = createSlice({
  name: `attributes`,
  initialState,
  reducers: {
    riskValueChangeHandler: (state, param) => {
      const { payload } = param;
      const { id, operation, listIndex, value } = payload as {
        id: string;
        value: string;
        operation: string;
        listIndex?: number | undefined;
      };
      if (id && id === 'NEW' && state.newAttribute) {
        const inputRiskIndicator: RiskIndicatorType = state.newAttribute;
        const newRiskIndicator: RiskIndicatorType = buildNewRiskIndicator({
          inputRiskIndicator,
          operation,
          value,
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
          value,
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
    addNewRiskIndicator: (state) => {
      const newRiskIndicator: RiskIndicatorType =
        createNewRiskIndicatorObject();
      return {
        ...state,
        newAttribute: newRiskIndicator,
        currentAttributeId: 'NEW',
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
          state.isAttributesInitialized = true;
          state.newAttribute = null;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(deleteAttribute.rejected, (state) => {
        state.loading = false;
        state.isAttributesInitialized = true;
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

export const attributesByIdSelector = (
  state: RootState
): { [id: string]: RiskIndicatorType } => state.attributes?.attributes ?? null;

export const attributeByIdSelector =
  (
    attributeId: string
  ): ((state: RootState) => RiskIndicatorType | undefined) =>
  (state: RootState) =>
    state.attributes?.attributes && state.attributes?.attributes[attributeId];

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

export const {
  riskValueChangeHandler,
  riskValueClickHandler,
  addNewRiskIndicator,
} = attributesSlice.actions;
export default attributesSlice.reducer;
