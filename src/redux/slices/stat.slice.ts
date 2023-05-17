/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from '@/redux/store';
import { ReduxJson, ResponseStatus, StateCardItemType } from '@/types';
import { statsApi } from '@/redux/apis';
import { AxiosError } from 'axios';
import {
  DeleteStatParams,
  GetLatestStatParams,
  GetStatsParams,
  Stats,
} from '@/types/stats.type';
import { shortenFormat } from '@/libs/string-utils';
import { checkAuthToken } from '@/libs/auth-token';

const keysToObjects: { [id: string]: StateCardItemType } = {
  numEntities: {
    title: 'Total Persons',
    amount: '0',
    info: '1',
    icon: '/images/icons/up.svg',
  },
  numSources: {
    title: 'Data Sources',
    amount: '0',
    info: '1',
    icon: '/images/icons/up.svg',
  },
  numAttributes: {
    title: '# Risk Indicators',
    amount: '0',
    info: '1',
    icon: '/images/icons/up.svg',
  },
  numRecords: {
    title: 'Records Analyzed',
    amount: '0',
    info: '1',
    icon: '/images/icons/up.svg',
  },
};

const initialState: ReduxJson.StatsState = {
  loading: true,
  initialized: false,
  status: null,
  latestStatsByModelId: {},
  selectedStats: null,
};

export const getStats = createAsyncThunk<
  Stats[],
  GetStatsParams,
  { dispatch: AppDispatch; state: RootState }
>('stats/getStats', async (params: GetStatsParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await checkAuthToken();
    return await statsApi.loadStatsData(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const getLatestStat = createAsyncThunk<
  Stats,
  GetLatestStatParams,
  { dispatch: AppDispatch; state: RootState }
>('stats/getLatestStat', async (params: GetLatestStatParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await checkAuthToken();
    return await statsApi.loadLatestStatData(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const deleteStats = createAsyncThunk<
  string,
  DeleteStatParams,
  { dispatch: AppDispatch; state: RootState }
>('stats/deleteStats', async (params: DeleteStatParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await checkAuthToken();
    return await statsApi.deleteStatData(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

const statsSlice = createSlice({
  name: `stats`,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStats.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        getStats.fulfilled,
        (state, { payload }: PayloadAction<Stats[]>) => {
          state.loading = false;
          state.initialized = true;
          state.status = ResponseStatus.SUCCESS;
          const statsByModelId: { [modelId: string]: Stats } = {};
          payload.forEach((entity) => {
            const { modelId } = entity;
            // only include latest instance for each model
            if (
              !statsByModelId[modelId] ||
              entity.instance > statsByModelId[modelId].instance
            ) {
              statsByModelId[modelId] = entity;
            }
          });
          state.latestStatsByModelId = statsByModelId;
          state.selectedStats = null;
        }
      )
      .addCase(getStats.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
        state.latestStatsByModelId = {};
        state.selectedStats = null;
      })
      .addCase(getLatestStat.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        getLatestStat.fulfilled,
        (state, { payload }: PayloadAction<Stats>) => {
          state.loading = false;
          state.initialized = true;
          const { modelId } = payload;
          state.latestStatsByModelId = {
            [modelId]: payload,
          };
          state.selectedStats = payload;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(getLatestStat.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
        state.latestStatsByModelId = {};
        state.selectedStats = null;
      })
      .addCase(deleteStats.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        deleteStats.fulfilled,
        (state, { payload }: PayloadAction<string>) => {
          state.loading = false;
          state.initialized = true;
          const modelId = payload as string;
          const { [modelId]: _deletedStat, ...newStatsByModelId } =
            state.latestStatsByModelId;
          state.latestStatsByModelId = newStatsByModelId;
          state.status = ResponseStatus.SUCCESS;
          state.selectedStats = null;
        }
      )
      .addCase(deleteStats.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
        state.latestStatsByModelId = {};
        state.selectedStats = null;
      });
  },
});

export const getStatsSelector: (state: RootState) => Stats[] = (
  state: RootState
) => {
  const stats = state?.stats?.latestStatsByModelId ?? {};
  return Object.values(stats);
};

export const getStatsByModelIdSelector = (
  state: RootState
): { [modelId: string]: Stats } => state.stats?.latestStatsByModelId ?? null;

export const statByModelIdSelector =
  (modelId: string): ((state: RootState) => Stats | undefined) =>
  (state: RootState) =>
    state.stats?.latestStatsByModelId &&
    state.stats?.latestStatsByModelId[modelId];

export const statsToStatusCards =
  (modelId: string): ((state: RootState) => StateCardItemType[]) =>
  (state: RootState) => {
    if (modelId) {
      const stats: Stats =
        (state?.stats?.latestStatsByModelId &&
          state?.stats?.latestStatsByModelId[modelId]) ??
        null;
      if (stats) {
        const unfilteredValue: (StateCardItemType | null)[] = Object.entries(
          stats
        ).map(([key, value]) => {
          if (key in keysToObjects) {
            const initialValue = keysToObjects[key];
            const valueString: string = shortenFormat(value as number);
            const recordsObject = {
              ...initialValue,
              amount: valueString,
            };
            return recordsObject;
          } else {
            return null;
          }
        });
        const returnValue: StateCardItemType[] = [];
        unfilteredValue.forEach((value: StateCardItemType | null) => {
          if (value != null) {
            returnValue.push(value);
          }
        });
        return returnValue;
      }
    }
    return [];
  };

export const getSelectedStats = (state: RootState): Stats => {
  return state.stats.selectedStats;
};

export const getStatsInitialized = (state: RootState): boolean =>
  state.stats.initialized ?? false;

export const isStatsStatusPending = (state: RootState): boolean =>
  state?.stats.status === ResponseStatus.PENDING;
export const isStatsStatusSuccess = (state: RootState): boolean =>
  state?.stats.status === ResponseStatus.SUCCESS;
export const isStatsStatusFailed = (state: RootState): boolean =>
  state?.stats.status === ResponseStatus.FAILED;

export default statsSlice.reducer;
