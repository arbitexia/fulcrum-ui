/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Dan Finkel
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from '@/redux/store';
import { ReduxJson, ResponseStatus } from '@/types';
import { ControlParams } from '@/types/control.type';
import { controlApi } from '@/redux/apis';
import { AxiosError } from 'axios';

const initialState: ReduxJson.ControlState = {
  loading: true,
  status: null,
  scoringPaused: true,
};

export const ingestData = createAsyncThunk<
  string,
  ControlParams,
  { dispatch: AppDispatch; state: RootState }
>('control/ingest', async (params: ControlParams, thunkAPI) => {
  try {
    return await controlApi.ingestData(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const replayData = createAsyncThunk<
  string,
  ControlParams,
  { dispatch: AppDispatch; state: RootState }
>('control/replay', async (params: ControlParams, thunkAPI) => {
  try {
    return await controlApi.replayData(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const resetModels = createAsyncThunk<
  string,
  ControlParams,
  { dispatch: AppDispatch; state: RootState }
>('control/reset', async (params: ControlParams, thunkAPI) => {
  try {
    return await controlApi.resetModels(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const refreshModels = createAsyncThunk<
  string,
  ControlParams,
  { dispatch: AppDispatch; state: RootState }
>('control/refresh', async (params: ControlParams, thunkAPI) => {
  try {
    return await controlApi.refreshModels(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const scoreModels = createAsyncThunk<
  string,
  ControlParams,
  { dispatch: AppDispatch; state: RootState }
>('control/score', async (params: ControlParams, thunkAPI) => {
  try {
    return await controlApi.scoreModels(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const fullRun = createAsyncThunk<
  string,
  ControlParams,
  { dispatch: AppDispatch; state: RootState }
>('control/full', async (params: ControlParams, thunkAPI) => {
  try {
    return await controlApi.fullRun(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

const controlSlice = createSlice({
  name: `control`,
  initialState,
  reducers: {
    toggleScoringMode: (state) => {
      const mode = state.scoringPaused;
      state.scoringPaused = !mode;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(ingestData.pending, (state) => {
        state.loading = true;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(ingestData.fulfilled, (state) => {
        state.loading = false;
        state.status = ResponseStatus.SUCCESS;
      })
      .addCase(ingestData.rejected, (state) => {
        state.loading = false;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(replayData.pending, (state) => {
        state.loading = true;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(replayData.fulfilled, (state) => {
        state.loading = false;
        state.status = ResponseStatus.SUCCESS;
      })
      .addCase(replayData.rejected, (state) => {
        state.loading = false;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(resetModels.pending, (state) => {
        state.loading = true;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(resetModels.fulfilled, (state) => {
        state.loading = false;
        state.status = ResponseStatus.SUCCESS;
      })
      .addCase(resetModels.rejected, (state) => {
        state.loading = false;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(refreshModels.pending, (state) => {
        state.loading = true;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(refreshModels.fulfilled, (state) => {
        state.loading = false;
        state.status = ResponseStatus.SUCCESS;
      })
      .addCase(refreshModels.rejected, (state) => {
        state.loading = false;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(scoreModels.pending, (state) => {
        state.loading = true;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(scoreModels.fulfilled, (state) => {
        state.loading = false;
        state.status = ResponseStatus.SUCCESS;
      })
      .addCase(scoreModels.rejected, (state) => {
        state.loading = false;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(fullRun.pending, (state) => {
        state.loading = true;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(fullRun.fulfilled, (state) => {
        state.loading = false;
        state.status = ResponseStatus.SUCCESS;
      })
      .addCase(fullRun.rejected, (state) => {
        state.loading = false;
        state.status = ResponseStatus.FAILED;
      });
  },
});

export const { toggleScoringMode } = controlSlice.actions;

export const getIsScoringPaused = (state: RootState): boolean =>
  state.control.scoringPaused;

export const controlSelector = (state: RootState): ReduxJson.ControlState =>
  state.control;
export default controlSlice.reducer;
