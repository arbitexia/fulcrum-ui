/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from '@/redux/store';
import {
  ReduxJson,
  RetrieveProgramParams,
  RiskStatusSummaryType,
  ResponseStatus,
  StatusOvertimeType,
  PersonPerType,
  RetrievePersonParams,
  ProgramTableType,
  RetrieveOrgParams,
} from '@/types';
import { reportApi } from '@/redux/apis';
import { AxiosError } from 'axios';
import {
  IndividualsRiskIndicatorType,
  OrganizationTableType,
  RiskScoreSummaryType,
} from '@/types/report.type';

const initialState: ReduxJson.ReportState = {
  loading: true,
  initialized: false,
  status: null,
  riskStatusSummary: null,
  statusOverTime: null,
  personPer: null,
  programList: null,
  riskScoreSummary: null,
  individualsRiskIndicator: null,
  organizationList: null,
};

export const retrieveRiskStatusSummary = createAsyncThunk<
  RiskStatusSummaryType[],
  RetrieveProgramParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'report/retrieveRiskStatusSummary',
  async (params: RetrieveProgramParams, thunkAPI) => {
    try {
      return await reportApi.loadRiskStatusSummary(params);
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const retrieveStatusOverTime = createAsyncThunk<
  StatusOvertimeType[],
  RetrieveProgramParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'report/retrieveStatusOverTime',
  async (params: RetrieveProgramParams, thunkAPI) => {
    try {
      return await reportApi.loadStatusOverTime(params);
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const retrievePersonsPer = createAsyncThunk<
  PersonPerType[],
  RetrievePersonParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'report/retrievePersonsPer',
  async (params: RetrieveProgramParams, thunkAPI) => {
    try {
      return await reportApi.loadPersonPer(params);
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const retrieveProgramsData = createAsyncThunk<
  ProgramTableType[],
  RetrieveProgramParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'report/retrieveProgramsData',
  async (params: RetrieveProgramParams, thunkAPI) => {
    try {
      return await reportApi.loadProgramData(params);
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const retrieveRiskScoreSummary = createAsyncThunk<
  RiskScoreSummaryType[],
  RetrieveOrgParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'report/retrieveRiskScoreSummary',
  async (params: RetrieveOrgParams, thunkAPI) => {
    try {
      return await reportApi.loadRiskScoreSummary(params);
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const retrieveIndividualsRiskIndicator = createAsyncThunk<
  IndividualsRiskIndicatorType[],
  RetrieveOrgParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'report/retrieveIndividualsRiskIndicator',
  async (params: RetrieveOrgParams, thunkAPI) => {
    try {
      return await reportApi.loadOrgRiskIndicator(params);
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);
export const retrieveOrganizationData = createAsyncThunk<
  OrganizationTableType[],
  RetrieveOrgParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'report/retrieveOrganizationData',
  async (params: RetrieveOrgParams, thunkAPI) => {
    try {
      return await reportApi.loadOrganizationData(params);
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

const reportSlice = createSlice({
  name: `reports`,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(retrieveRiskStatusSummary.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveRiskStatusSummary.fulfilled,
        (state, { payload }: PayloadAction<RiskStatusSummaryType[]>) => {
          state.loading = false;
          state.initialized = true;
          state.riskStatusSummary = payload;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveRiskStatusSummary.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveStatusOverTime.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveStatusOverTime.fulfilled,
        (state, { payload }: PayloadAction<StatusOvertimeType[]>) => {
          state.loading = false;
          state.initialized = true;
          state.statusOverTime = payload;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveStatusOverTime.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(retrievePersonsPer.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrievePersonsPer.fulfilled,
        (state, { payload }: PayloadAction<PersonPerType[]>) => {
          state.loading = false;
          state.initialized = true;
          state.personPer = payload;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrievePersonsPer.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveProgramsData.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveProgramsData.fulfilled,
        (state, { payload }: PayloadAction<ProgramTableType[]>) => {
          state.loading = false;
          state.initialized = true;
          state.programList = payload;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveProgramsData.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveRiskScoreSummary.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveRiskScoreSummary.fulfilled,
        (state, { payload }: PayloadAction<RiskScoreSummaryType[]>) => {
          state.loading = false;
          state.initialized = true;
          state.riskScoreSummary = payload;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveRiskScoreSummary.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveIndividualsRiskIndicator.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveIndividualsRiskIndicator.fulfilled,
        (state, { payload }: PayloadAction<IndividualsRiskIndicatorType[]>) => {
          state.loading = false;
          state.initialized = true;
          state.individualsRiskIndicator = payload;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveIndividualsRiskIndicator.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveOrganizationData.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveOrganizationData.fulfilled,
        (state, { payload }: PayloadAction<OrganizationTableType[]>) => {
          state.loading = false;
          state.initialized = true;
          state.organizationList = payload;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveOrganizationData.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
      });
  },
});

export const riskStatusSummarySelector: (
  state: RootState
) => RiskStatusSummaryType[] | null = (state: RootState) => {
  return state.reports.riskStatusSummary;
};

export const statusOverTimeSelector: (
  state: RootState
) => StatusOvertimeType[] | null = (state: RootState) => {
  return state.reports.statusOverTime;
};

export const personPerSelector: (state: RootState) => PersonPerType[] | null = (
  state: RootState
) => {
  return state.reports.personPer;
};

export const programListSelector: (
  state: RootState
) => ProgramTableType[] | null = (state: RootState) => {
  return state.reports.programList;
};

export const riskScoreSummarySelector: (
  state: RootState
) => RiskScoreSummaryType[] | null = (state: RootState) => {
  return state.reports.riskScoreSummary;
};

export const individualsRiskIndicatorSelector: (
  state: RootState
) => IndividualsRiskIndicatorType[] | null = (state: RootState) => {
  return state.reports.individualsRiskIndicator;
};

export const organizationListSelector: (
  state: RootState
) => OrganizationTableType[] | null = (state: RootState) => {
  return state.reports.organizationList;
};

export default reportSlice.reducer;
