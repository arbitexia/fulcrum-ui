/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from '@/redux/store';
import { ReduxJson } from '@/types';
import { AxiosError } from 'axios';
import {
  ExcelRequestParam,
  ExcelResponse,
  ExcelParseStatus,
} from '@/types/risk.type';
import { riskApi } from '../apis';

const initialState: ReduxJson.RiskState = {
  risks: [],
  downloadStatus: null,
};

const callDownloadFunction = async (
  params: ExcelRequestParam
): Promise<ExcelResponse> => {
  const data = await riskApi.downloadExcelFile(params);
  if (
    data.status === ExcelParseStatus.DONE ||
    data.status === ExcelParseStatus.FAILED
  ) {
    return data;
  } else {
    return callDownloadFunction(params);
  }
};

export const downloadExcelFile = createAsyncThunk<
  ExcelResponse,
  ExcelRequestParam,
  { dispatch: AppDispatch; state: RootState }
>('risk/downloadExcel', async (params: ExcelRequestParam, thunkAPI) => {
  try {
    const data = await callDownloadFunction(params);
    return data;
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

const riskSlice = createSlice({
  name: 'risks',
  initialState,
  reducers: {
    downloadExcelFile: (state, action: PayloadAction<ExcelResponse>) => {
      const { payload } = action;
      state.downloadStatus = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(downloadExcelFile.pending, (state) => {
        state.downloadStatus = null;
      })
      .addCase(
        downloadExcelFile.fulfilled,
        (state, { payload }: PayloadAction<ExcelResponse>) => {
          state.downloadStatus = payload;
        }
      );
  },
});

export const riskSelector = (state: RootState): ReduxJson.RiskState =>
  state.risks;

export default riskSlice.reducer;
