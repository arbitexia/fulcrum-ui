/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from '@/redux/store';
import { ReduxJson, ResponseStatus } from '@/types';
import { externalApi } from '@/redux/apis';
import { AxiosError } from 'axios';
import {
  ExternalApplication,
  GetEntityParams,
  NewExternalParams,
} from '@/types';
import { genRefreshToken } from '@/libs/auth-token';

const initialState: ReduxJson.ExternalState = {
  loading: true,
  status: null,
  externalData: [],
};

export const retrieveExternalData = createAsyncThunk<
  ExternalApplication[],
  GetEntityParams,
  { dispatch: AppDispatch; state: RootState }
>('external/getData', async (params: GetEntityParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    return await externalApi.loadExternalData(params);
  } catch (error) {
    const err = error as AxiosError;
    await genRefreshToken(err);
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const saveExternalData = createAsyncThunk<
  string,
  NewExternalParams,
  { dispatch: AppDispatch; state: RootState }
>('external/newExternal', async (params: NewExternalParams, thunkAPI) => {
  console.log(params);
  try {
    return await externalApi.createExternalApplication(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

const externalSlice = createSlice({
  name: `external`,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(retrieveExternalData.pending, (state) => {
        state.loading = true;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveExternalData.fulfilled,
        (state, { payload }: PayloadAction<ExternalApplication[]>) => {
          state.loading = false;
          state.status = ResponseStatus.SUCCESS;
          state.externalData = payload;
        }
      )
      .addCase(retrieveExternalData.rejected, (state) => {
        state.loading = false;
        state.status = ResponseStatus.FAILED;
        state.externalData = [];
      })
      .addCase(saveExternalData.pending, (state) => {
        state.loading = true;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        saveExternalData.fulfilled,
        (state, { payload }: PayloadAction<string>) => {
          state.loading = false;
          state.status = ResponseStatus.SUCCESS;
          console.log(payload);
        }
      )
      .addCase(saveExternalData.rejected, (state) => {
        state.loading = false;
        state.status = ResponseStatus.FAILED;
        state.externalData = [];
      });
  },
});

export const getExternalDataSelector: (
  state: RootState
) => ExternalApplication[] = (state: RootState) => {
  const externalData = state?.external?.externalData ?? [];
  return externalData;
};

export default externalSlice.reducer;
