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
  StatusTableType,
  UnmaskingTableType,
  UsageTableType,
} from '@/types';
import { governanceApi } from '@/redux/apis';
import { AxiosError } from 'axios';
import {
  AuditEvent,
  DeleteMaskingStatusParams,
  EntityStatusLog,
  GetAuditEventsParams,
  GetEntityStatusesParams,
  GetMaskingParams,
  GetMaskingsByStatus,
  GetMaskingsParams,
  GetMaskingSystemAutoUnmaskPercentageParams,
  GetMaskingSystemAutoUnmaskTopCountParams,
  GetMaskingSystemRemaskDaysParams,
  GetMaskingSystemStatusParams,
  MaskingType,
  NewMaskingStatusParams,
  SetMaskingSystemAutoUnmaskPercentageParams,
  SetMaskingSystemAutoUnmaskTopCountParams,
  SetMaskingSystemRemaskDaysParams,
  SetMaskingSystemStatusParams,
} from '@/types/governance.type';
import {
  entityPropertiesByIdSelector,
  MASKED_RESPONSE,
} from '@/redux/slices/entity.slice';
import { formatDate } from '@/libs/time-utils';
import { getEntityMaskingValuesDefaultStatus } from '@/redux/slices/config.slice';
import { isAccessTokenValid } from '@/libs/auth-token';

const initialState: ReduxJson.GovernanceState = {
  systemMasking: {
    initialized: false,
    loading: false,
    status: null,
    value: false,
  },
  autoUnmaskPercent: {
    initialized: false,
    loading: false,
    status: null,
    value: 0.0,
  },
  autoUnmaskTopCount: {
    initialized: false,
    loading: false,
    status: null,
    value: 0,
  },
  remaskAfterDays: {
    initialized: false,
    loading: false,
    status: null,
    value: 0,
  },
  entitiesToMask: {
    initialized: false,
    loading: false,
    status: null,
    value: {},
  },
  auditEvents: {
    initialized: false,
    loading: false,
    status: null,
    value: [],
  },
  entityStatuses: {
    initialized: false,
    loading: false,
    status: null,
    value: [],
  },
};

export const retrieveMaskingSystemStatus = createAsyncThunk<
  boolean,
  GetMaskingSystemStatusParams,
  { dispatch: AppDispatch; state: RootState }
>('governance/retrieveMaskingSystemStatus', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await governanceApi.loadMaskingSystemStatus(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const setSystemMaskingStatus = createAsyncThunk<
  boolean,
  SetMaskingSystemStatusParams,
  { dispatch: AppDispatch; state: RootState }
>('governance/setSystemMaskingStatus', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await governanceApi.setSystemMaskingStatus(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const retrieveMaskingSystemAutoUnmaskPercentage = createAsyncThunk<
  number,
  GetMaskingSystemAutoUnmaskPercentageParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'governance/retrieveMaskingSystemAutoUnmaskPercentage',
  async (params, thunkAPI) => {
    try {
      // TODO - define the api auth token
      await isAccessTokenValid();
      return await governanceApi.loadMaskingSystemAutoUnmaskPercentage(params);
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const setMaskingSystemAutoUnmaskPercentage = createAsyncThunk<
  number,
  SetMaskingSystemAutoUnmaskPercentageParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'governance/setMaskingSystemAutoUnmaskPercentage',
  async (params, thunkAPI) => {
    try {
      // TODO - define the api auth token
      await isAccessTokenValid();
      return await governanceApi.setMaskingSystemAutoUnmaskPercentage(params);
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);
export const retrieveMaskingSystemAutoUnmaskTopCount = createAsyncThunk<
  number,
  GetMaskingSystemAutoUnmaskTopCountParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'governance/retrieveMaskingSystemAutoUnmaskTopCount',
  async (params, thunkAPI) => {
    try {
      // TODO - define the api auth token
      await isAccessTokenValid();
      return await governanceApi.loadMaskingSystemAutoUnmaskTopCount(params);
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const setMaskingSystemAutoUnmaskTopCount = createAsyncThunk<
  number,
  SetMaskingSystemAutoUnmaskTopCountParams,
  { dispatch: AppDispatch; state: RootState }
>('governance/setMaskingSystemAutoUnmaskTopCount', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await governanceApi.setMaskingSystemAutoUnmaskTopCount(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const retrieveMaskingSystemRemaskDays = createAsyncThunk<
  number,
  GetMaskingSystemRemaskDaysParams,
  { dispatch: AppDispatch; state: RootState }
>('governance/retrieveMaskingSystemRemaskDays', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await governanceApi.loadMaskingSystemRemaskDays(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const setMaskingSystemRemaskDays = createAsyncThunk<
  number,
  SetMaskingSystemRemaskDaysParams,
  { dispatch: AppDispatch; state: RootState }
>('governance/setMaskingSystemRemaskDays', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await governanceApi.setMaskingSystemRemaskDays(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const retrieveMaskings = createAsyncThunk<
  MaskingType[],
  GetMaskingsParams,
  { dispatch: AppDispatch; state: RootState }
>('governance/retrieveMaskings', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await governanceApi.getMaskings(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const retrieveMaskingsByStatus = createAsyncThunk<
  MaskingType[],
  GetMaskingsByStatus,
  { dispatch: AppDispatch; state: RootState }
>('governance/retrieveMaskingsByStatus', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await governanceApi.getMaskingsByStatus(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const retrieveMasking = createAsyncThunk<
  MaskingType,
  GetMaskingParams,
  { dispatch: AppDispatch; state: RootState }
>('governance/retrieveMasking', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await governanceApi.getMasking(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const setNewMasking = createAsyncThunk<
  MaskingType,
  NewMaskingStatusParams,
  { dispatch: AppDispatch; state: RootState }
>('governance/setNewMasking', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await governanceApi.setNewMasking(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const removeMasking = createAsyncThunk<
  { userId: string; entityId: string },
  DeleteMaskingStatusParams,
  { dispatch: AppDispatch; state: RootState }
>('governance/removeMasking', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await governanceApi.deleteMasking(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const getAuditEvents = createAsyncThunk<
  AuditEvent[],
  GetAuditEventsParams,
  { dispatch: AppDispatch; state: RootState }
>('governance/getAuditEvents', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await governanceApi.loadAuditEvents(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const getEntityStatusEvents = createAsyncThunk<
  EntityStatusLog[],
  GetEntityStatusesParams,
  { dispatch: AppDispatch; state: RootState }
>('governance/getEntityStatusEvents', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await governanceApi.loadEntityStatusesEvents(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

const governanceSlice = createSlice({
  name: `governance`,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(retrieveMaskingSystemStatus.pending, (state) => {
        state.systemMasking.loading = true;
        state.systemMasking.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveMaskingSystemStatus.fulfilled,
        (state, { payload }: PayloadAction<boolean>) => {
          const systemMasking = payload as boolean;
          state.systemMasking.value = systemMasking;
          state.systemMasking.loading = false;
          state.systemMasking.initialized = true;
          state.systemMasking.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveMaskingSystemStatus.rejected, (state) => {
        state.systemMasking.loading = false;
        state.systemMasking.initialized = true;
        state.systemMasking.status = ResponseStatus.FAILED;
      })
      .addCase(setSystemMaskingStatus.pending, (state) => {
        state.systemMasking.loading = true;
        state.systemMasking.status = ResponseStatus.PENDING;
      })
      .addCase(
        setSystemMaskingStatus.fulfilled,
        (state, { payload }: PayloadAction<boolean>) => {
          const systemMasking = payload as boolean;
          state.systemMasking.value = systemMasking;
          state.systemMasking.loading = false;
          state.systemMasking.initialized = true;
          state.systemMasking.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(setSystemMaskingStatus.rejected, (state) => {
        state.systemMasking.loading = false;
        state.systemMasking.initialized = true;
        state.systemMasking.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveMaskingSystemAutoUnmaskPercentage.pending, (state) => {
        state.autoUnmaskPercent.loading = true;
        state.autoUnmaskPercent.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveMaskingSystemAutoUnmaskPercentage.fulfilled,
        (state, { payload }: PayloadAction<number>) => {
          const autoUnmaskPercent = payload as number;
          state.autoUnmaskPercent.value = autoUnmaskPercent;
          state.autoUnmaskPercent.loading = false;
          state.autoUnmaskPercent.initialized = true;
          state.autoUnmaskPercent.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveMaskingSystemAutoUnmaskPercentage.rejected, (state) => {
        state.autoUnmaskPercent.loading = false;
        state.autoUnmaskPercent.initialized = true;
        state.autoUnmaskPercent.status = ResponseStatus.FAILED;
      })
      .addCase(setMaskingSystemAutoUnmaskPercentage.pending, (state) => {
        state.autoUnmaskPercent.loading = true;
        state.autoUnmaskPercent.status = ResponseStatus.PENDING;
      })
      .addCase(
        setMaskingSystemAutoUnmaskPercentage.fulfilled,
        (state, { payload }: PayloadAction<number>) => {
          const autoUnmaskPercent = payload as number;
          state.autoUnmaskPercent.value = autoUnmaskPercent;
          state.autoUnmaskPercent.loading = false;
          state.autoUnmaskPercent.initialized = true;
          state.autoUnmaskPercent.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(setMaskingSystemAutoUnmaskPercentage.rejected, (state) => {
        state.autoUnmaskPercent.loading = false;
        state.autoUnmaskPercent.initialized = true;
        state.autoUnmaskPercent.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveMaskingSystemAutoUnmaskTopCount.pending, (state) => {
        state.autoUnmaskTopCount.loading = true;
        state.autoUnmaskTopCount.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveMaskingSystemAutoUnmaskTopCount.fulfilled,
        (state, { payload }: PayloadAction<number>) => {
          const autoUnmaskTopCount = payload as number;
          state.autoUnmaskTopCount.value = autoUnmaskTopCount;
          state.autoUnmaskTopCount.loading = false;
          state.autoUnmaskTopCount.initialized = true;
          state.autoUnmaskTopCount.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveMaskingSystemAutoUnmaskTopCount.rejected, (state) => {
        state.autoUnmaskTopCount.loading = false;
        state.autoUnmaskTopCount.initialized = true;
        state.autoUnmaskTopCount.status = ResponseStatus.FAILED;
      })
      .addCase(setMaskingSystemAutoUnmaskTopCount.pending, (state) => {
        state.autoUnmaskTopCount.loading = true;
        state.autoUnmaskTopCount.status = ResponseStatus.PENDING;
      })
      .addCase(
        setMaskingSystemAutoUnmaskTopCount.fulfilled,
        (state, { payload }: PayloadAction<number>) => {
          const autoUnmaskTopCount = payload as number;
          state.autoUnmaskTopCount.value = autoUnmaskTopCount;
          state.autoUnmaskTopCount.loading = false;
          state.autoUnmaskTopCount.initialized = true;
          state.autoUnmaskTopCount.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(setMaskingSystemAutoUnmaskTopCount.rejected, (state) => {
        state.autoUnmaskTopCount.loading = false;
        state.autoUnmaskTopCount.initialized = true;
        state.autoUnmaskTopCount.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveMaskingSystemRemaskDays.pending, (state) => {
        state.remaskAfterDays.loading = true;
        state.remaskAfterDays.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveMaskingSystemRemaskDays.fulfilled,
        (state, { payload }: PayloadAction<number>) => {
          const remaskAfterDays = payload as number;
          state.remaskAfterDays.value = remaskAfterDays;
          state.remaskAfterDays.loading = false;
          state.remaskAfterDays.initialized = true;
          state.remaskAfterDays.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveMaskingSystemRemaskDays.rejected, (state) => {
        state.remaskAfterDays.loading = false;
        state.remaskAfterDays.initialized = true;
        state.remaskAfterDays.status = ResponseStatus.FAILED;
      })
      .addCase(setMaskingSystemRemaskDays.pending, (state) => {
        state.remaskAfterDays.loading = true;
        state.remaskAfterDays.status = ResponseStatus.PENDING;
      })
      .addCase(
        setMaskingSystemRemaskDays.fulfilled,
        (state, { payload }: PayloadAction<number>) => {
          const remaskAfterDays = payload as number;
          state.remaskAfterDays.value = remaskAfterDays;
          state.remaskAfterDays.loading = false;
          state.remaskAfterDays.initialized = true;
          state.remaskAfterDays.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(setMaskingSystemRemaskDays.rejected, (state) => {
        state.remaskAfterDays.loading = false;
        state.remaskAfterDays.initialized = true;
        state.remaskAfterDays.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveMaskings.pending, (state) => {
        state.entitiesToMask.loading = true;
        state.entitiesToMask.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveMaskings.fulfilled,
        (state, { payload }: PayloadAction<MaskingType[]>) => {
          const maskingTypes = payload as MaskingType[];
          const newEntitiesToMask = { ...state.entitiesToMask.value };
          maskingTypes.forEach((masking: MaskingType) => {
            const { entityId } = masking;
            newEntitiesToMask[entityId] = masking;
          });
          state.entitiesToMask.value = newEntitiesToMask;
          state.entitiesToMask.loading = false;
          state.entitiesToMask.initialized = true;
          state.entitiesToMask.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveMaskings.rejected, (state) => {
        state.entitiesToMask.loading = false;
        state.entitiesToMask.initialized = true;
        state.entitiesToMask.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveMaskingsByStatus.pending, (state) => {
        state.entitiesToMask.loading = true;
        state.entitiesToMask.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveMaskingsByStatus.fulfilled,
        (state, { payload }: PayloadAction<MaskingType[]>) => {
          const maskingTypes = payload as MaskingType[];
          const newEntitiesToMask = { ...state.entitiesToMask.value };
          maskingTypes.forEach((masking: MaskingType) => {
            const { entityId } = masking;
            newEntitiesToMask[entityId] = masking;
          });
          state.entitiesToMask.value = newEntitiesToMask;
          state.entitiesToMask.loading = false;
          state.entitiesToMask.initialized = true;
          state.entitiesToMask.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveMaskingsByStatus.rejected, (state) => {
        state.entitiesToMask.loading = false;
        state.entitiesToMask.initialized = true;
        state.entitiesToMask.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveMasking.pending, (state) => {
        state.entitiesToMask.loading = true;
        state.entitiesToMask.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveMasking.fulfilled,
        (state, { payload }: PayloadAction<MaskingType>) => {
          const masking = payload as MaskingType;
          const newEntitiesToMask = { ...state.entitiesToMask.value };
          const { entityId } = masking;
          newEntitiesToMask[entityId] = masking;
          state.entitiesToMask.value = newEntitiesToMask;
          state.entitiesToMask.loading = false;
          state.entitiesToMask.initialized = true;
          state.entitiesToMask.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveMasking.rejected, (state) => {
        state.entitiesToMask.loading = false;
        state.entitiesToMask.initialized = true;
        state.entitiesToMask.status = ResponseStatus.FAILED;
      })
      .addCase(setNewMasking.pending, (state) => {
        state.entitiesToMask.loading = true;
        state.entitiesToMask.status = ResponseStatus.PENDING;
      })
      .addCase(
        setNewMasking.fulfilled,
        (state, { payload }: PayloadAction<MaskingType>) => {
          const masking = payload as MaskingType;
          const { entityId, status } = masking;
          if (status === 'approved') {
            const { [entityId]: _maskingToDelete, ...newEntitiesToMask } =
              state.entitiesToMask.value;
            state.entitiesToMask.value = newEntitiesToMask;
          } else {
            const newEntitiesToMask = { ...state.entitiesToMask.value };
            newEntitiesToMask[entityId] = masking;
            state.entitiesToMask.value = newEntitiesToMask;
          }
          state.entitiesToMask.loading = false;
          state.entitiesToMask.initialized = true;
          state.entitiesToMask.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(setNewMasking.rejected, (state) => {
        state.entitiesToMask.loading = false;
        state.entitiesToMask.initialized = true;
        state.entitiesToMask.status = ResponseStatus.FAILED;
      })
      .addCase(removeMasking.pending, (state) => {
        state.entitiesToMask.loading = true;
        state.entitiesToMask.status = ResponseStatus.PENDING;
      })
      .addCase(
        removeMasking.fulfilled,
        (
          state,
          { payload }: PayloadAction<{ userId: string; entityId: string }>
        ) => {
          const masking = payload as { userId: string; entityId: string };
          const { entityId } = masking;
          const { [entityId]: _maskingToDelete, ...newEntitiesToMask } =
            state.entitiesToMask.value;
          state.entitiesToMask.value = newEntitiesToMask;
          state.entitiesToMask.loading = false;
          state.entitiesToMask.initialized = true;
          state.entitiesToMask.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(removeMasking.rejected, (state) => {
        state.entitiesToMask.loading = false;
        state.entitiesToMask.initialized = true;
        state.entitiesToMask.status = ResponseStatus.FAILED;
      })
      .addCase(getAuditEvents.pending, (state) => {
        state.auditEvents.value = [];
        state.auditEvents.loading = true;
        state.auditEvents.status = ResponseStatus.PENDING;
      })
      .addCase(
        getAuditEvents.fulfilled,
        (state, { payload }: PayloadAction<AuditEvent[]>) => {
          state.auditEvents.value = payload;
          state.auditEvents.loading = false;
          state.auditEvents.initialized = true;
          state.auditEvents.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(getAuditEvents.rejected, (state) => {
        state.auditEvents.value = [];
        state.auditEvents.loading = false;
        state.auditEvents.initialized = true;
        state.auditEvents.status = ResponseStatus.FAILED;
      })
      .addCase(getEntityStatusEvents.pending, (state) => {
        state.entityStatuses.value = [];
        state.entityStatuses.loading = true;
        state.entityStatuses.status = ResponseStatus.PENDING;
      })
      .addCase(
        getEntityStatusEvents.fulfilled,
        (state, { payload }: PayloadAction<EntityStatusLog[]>) => {
          state.entityStatuses.value = payload;
          state.entityStatuses.loading = false;
          state.entityStatuses.initialized = true;
          state.entityStatuses.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(getEntityStatusEvents.rejected, (state) => {
        state.entityStatuses.value = [];
        state.entityStatuses.loading = false;
        state.entityStatuses.initialized = true;
        state.entityStatuses.status = ResponseStatus.FAILED;
      });
  },
});

export const isGovernanceSystemMaskingInitializedSelector = (
  state: RootState
): boolean => state?.governance?.systemMasking?.initialized ?? false;

export const isGovernanceAutoUnmaskPercentInitializedSelector = (
  state: RootState
): boolean => state?.governance?.autoUnmaskPercent?.initialized ?? false;

export const isGovernanceAutoUnmaskTopCountInitializedSelector = (
  state: RootState
): boolean => state?.governance?.autoUnmaskTopCount?.initialized ?? false;

export const isGovernanceRemaskAfterDaysInitializedSelector = (
  state: RootState
): boolean => state?.governance?.remaskAfterDays?.initialized ?? false;

export const isGovernanceEntitiestoMaskInitializedSelector = (
  state: RootState
): boolean => state?.governance?.entitiesToMask?.initialized ?? false;

export const isGovernanceAuditEventsInitializedSelector = (
  state: RootState
): boolean => state?.governance?.auditEvents?.initialized ?? false;

export const isGovernanceEntitiesStatusesInitializedSelector = (
  state: RootState
): boolean => state?.governance?.entityStatuses?.initialized ?? false;

export const isGovernanceSystemMaskingLoadingSelector = (
  state: RootState
): boolean => state?.governance?.systemMasking?.loading ?? false;

export const isGovernanceAutoUnmaskPercentLoadingSelector = (
  state: RootState
): boolean => state?.governance?.autoUnmaskPercent?.loading ?? false;

export const isGovernanceAutoUnmaskTopCountLoadingSelector = (
  state: RootState
): boolean => state?.governance?.autoUnmaskTopCount?.loading ?? false;

export const isGovernanceRemaskAfterDaysLoadingSelector = (
  state: RootState
): boolean => state?.governance?.remaskAfterDays?.loading ?? false;

export const isGovernanceEntitiestoMaskLoadingSelector = (
  state: RootState
): boolean => state?.governance?.entitiesToMask?.loading ?? false;

export const isGovernanceAuditEventsLoadingSelector = (
  state: RootState
): boolean => state?.governance?.auditEvents?.loading ?? false;

export const isGovernanceEntityStatusesLoadingSelector = (
  state: RootState
): boolean => state?.governance?.entityStatuses?.loading ?? false;

export const isGovernanceSystemMaskingStatusPendingSelector = (
  state: RootState
): boolean =>
  (state?.governance?.systemMasking?.status ?? null) === ResponseStatus.PENDING;

export const isGovernanceSystemMaskingStatusSuccessSelector = (
  state: RootState
): boolean =>
  (state?.governance?.systemMasking?.status ?? null) === ResponseStatus.SUCCESS;

export const isGovernanceSystemMaskingStatusFailedSelector = (
  state: RootState
): boolean =>
  (state?.governance?.systemMasking?.status ?? null) === ResponseStatus.FAILED;

export const isGovernanceAutoUnmaskPercentStatusPendingSelector = (
  state: RootState
): boolean =>
  (state?.governance?.autoUnmaskPercent?.status ?? null) ===
  ResponseStatus.PENDING;

export const isGovernanceAutoUnmaskPercentStatusSuccessSelector = (
  state: RootState
): boolean =>
  (state?.governance?.autoUnmaskPercent?.status ?? null) ===
  ResponseStatus.SUCCESS;

export const isGovernanceAutoUnmaskPercentStatusFailedSelector = (
  state: RootState
): boolean =>
  (state?.governance?.autoUnmaskPercent?.status ?? null) ===
  ResponseStatus.FAILED;

export const isGovernanceAutoUnmaskTopCountStatusPendingSelector = (
  state: RootState
): boolean =>
  (state?.governance?.autoUnmaskTopCount?.status ?? null) ===
  ResponseStatus.PENDING;

export const isGovernanceAutoUnmaskTopCountStatusSuccessSelector = (
  state: RootState
): boolean =>
  (state?.governance?.autoUnmaskTopCount?.status ?? null) ===
  ResponseStatus.SUCCESS;

export const isGovernanceAutoUnmaskTopCountStatusFailedSelector = (
  state: RootState
): boolean =>
  (state?.governance?.autoUnmaskTopCount?.status ?? null) ===
  ResponseStatus.FAILED;

export const isGovernanceRemaskAfterDaysStatusPendingSelector = (
  state: RootState
): boolean =>
  (state?.governance?.remaskAfterDays?.status ?? null) ===
  ResponseStatus.PENDING;

export const isGovernanceRemaskAfterDaysStatusSuccessSelector = (
  state: RootState
): boolean =>
  (state?.governance?.remaskAfterDays?.status ?? null) ===
  ResponseStatus.SUCCESS;

export const isGovernanceRemaskAfterDaysStatusFailedSelector = (
  state: RootState
): boolean =>
  (state?.governance?.remaskAfterDays?.status ?? null) ===
  ResponseStatus.FAILED;

export const isGovernanceEntitiestoMaskStatusPendingSelector = (
  state: RootState
): boolean =>
  (state?.governance?.entitiesToMask?.status ?? null) ===
  ResponseStatus.PENDING;

export const isGovernanceEntitiestoMaskStatusSuccessSelector = (
  state: RootState
): boolean =>
  (state?.governance?.entitiesToMask?.status ?? null) ===
  ResponseStatus.SUCCESS;

export const isGovernanceEntitiestoMaskStatusFailedSelector = (
  state: RootState
): boolean =>
  (state?.governance?.entitiesToMask?.status ?? null) === ResponseStatus.FAILED;

export const isGovernanceAuditEventsStatusPendingSelector = (
  state: RootState
): boolean =>
  (state?.governance?.auditEvents?.status ?? null) === ResponseStatus.PENDING;

export const isGovernanceAuditEventsStatusSuccessSelector = (
  state: RootState
): boolean =>
  (state?.governance?.auditEvents?.status ?? null) === ResponseStatus.SUCCESS;

export const isGovernanceAuditEventsStatusFailedSelector = (
  state: RootState
): boolean =>
  (state?.governance?.auditEvents?.status ?? null) === ResponseStatus.FAILED;

export const isGovernanceEntityStatusesStatusPendingSelector = (
  state: RootState
): boolean =>
  (state?.governance?.entityStatuses?.status ?? null) ===
  ResponseStatus.PENDING;

export const isGovernanceEntityStatusesStatusSuccessSelector = (
  state: RootState
): boolean =>
  (state?.governance?.entityStatuses?.status ?? null) ===
  ResponseStatus.SUCCESS;

export const isGovernanceEntityStatusesStatusFailedSelector = (
  state: RootState
): boolean =>
  (state?.governance?.entityStatuses?.status ?? null) === ResponseStatus.FAILED;

export const getSystemMaskingSelector = (state: RootState): boolean =>
  state?.governance?.systemMasking?.value ?? false;

export const getAutoUnmaskPercentSelector = (state: RootState): number =>
  state?.governance?.autoUnmaskPercent?.value ?? 0.0;

export const getAutoUnmaskTopCountSelector = (state: RootState): number =>
  state?.governance?.autoUnmaskTopCount?.value ?? 0;

export const getRemaskAfterDaysSelector = (state: RootState): number =>
  state.governance.remaskAfterDays?.value ?? 0;

export const getEntitiesToMaskSelector = (state: RootState): MaskingType[] =>
  Object.values(state?.governance?.entitiesToMask?.value ?? {});

export const getMaskedEntitySelector =
  (entityId: string): ((state: RootState) => MaskingType | null) =>
  (state: RootState) => {
    const entitiesToMask = state?.governance?.entitiesToMask?.value ?? null;
    if (entityId && entitiesToMask) {
      const maskedEntity = entitiesToMask[entityId];
      if (maskedEntity) {
        return maskedEntity;
      }
    }
    return null;
  };

export const getMaskedEntityStatusSelector =
  (entityId: string): ((state: RootState) => string) =>
  (state: RootState) => {
    const maskedEntity: MaskingType | null =
      getMaskedEntitySelector(entityId)(state);
    const defaultStatus: string = getEntityMaskingValuesDefaultStatus(state);
    if (maskedEntity) {
      return maskedEntity.status ?? defaultStatus;
    }
    return defaultStatus;
  };

export const getMaskedEntityIdsSelector = (state: RootState): string[] => {
  const entitiesToMask = state?.governance?.entitiesToMask?.value ?? {};
  if (entitiesToMask) {
    return Object.keys(entitiesToMask);
  }
  return [];
};

export const getEntityStatusesEntityIdsSelector = (
  state: RootState
): string[] => {
  const entityStatusLogValue = state?.governance?.entityStatuses?.value ?? [];
  if (entityStatusLogValue && entityStatusLogValue.length > 0) {
    return entityStatusLogValue.map(
      (entityStatus: EntityStatusLog) => entityStatus.entityId
    );
  }
  return [];
};

export const getUnmaskedTableData = (
  state: RootState
): UnmaskingTableType[] => {
  const entitiesToMask = state?.governance?.entitiesToMask?.value ?? {};
  if (entitiesToMask) {
    const entityIds = Object.keys(entitiesToMask);
    const entitiesInitialized = state?.entities?.initialized ?? false;
    if (entitiesInitialized) {
      const entities = state?.entities?.entities ?? {};
      const candidateUnmaskingTableRows = entityIds.map(
        (entityId): UnmaskingTableType | null => {
          if (!(entityId in entities)) {
            return null;
          }
          const entityProperties =
            entityPropertiesByIdSelector(entityId)(state);
          const {
            justification,
            score,
            userId,
            modelId,
            scoringInstance,
          }: MaskingType = entitiesToMask[entityId];
          return {
            ...entityProperties,
            id: entityId as string,
            name: (entityProperties?.name ?? MASKED_RESPONSE) as string,
            score: score as number,
            userId: userId as string,
            justification: justification as string,
            modelId: modelId as string,
            scoringInstance: scoringInstance as number,
          };
        }
      );
      const unmaskingTableRows: UnmaskingTableType[] = [];
      candidateUnmaskingTableRows.forEach((row: UnmaskingTableType | null) => {
        if (row !== null) {
          unmaskingTableRows.push(row);
        }
      });
      return unmaskingTableRows;
    }
  }
  return [];
};

export const getAuditEventsSelector = (state: RootState): AuditEvent[] => {
  const auditEvents = state?.governance?.auditEvents?.value ?? [];
  return auditEvents;
};

export const getAuditTableData = (state: RootState): UsageTableType[] => {
  const auditEvents = getAuditEventsSelector(state);
  const usageTable: UsageTableType[] = auditEvents.map(
    (auditEvent: AuditEvent) => {
      const { eventJson }: { eventJson: string } = auditEvent;
      const json: { type: string; details: string } = JSON.parse(eventJson) as {
        type: string;
        details: string;
      };
      return {
        id: auditEvent.userId,
        action: json.type,
        date: formatDate(new Date(auditEvent.timestamp)),
        user: auditEvent.userId,
        role: auditEvent.userId,
        description: JSON.stringify(json.details),
      };
    }
  );
  return usageTable;
};

export const getEntityStatusLog = (state: RootState): EntityStatusLog[] => {
  const entityStatuses = state?.governance?.entityStatuses?.value ?? [];
  return entityStatuses;
};

export const getEntityStatusTableData = (
  state: RootState
): StatusTableType[] => {
  const entityStatuses = state?.governance?.entityStatuses?.value ?? {};
  if (entityStatuses) {
    const entityIds: string[] = getEntityStatusesEntityIdsSelector(state);
    const entitiesInitialized = state?.entities?.initialized ?? false;
    if (entitiesInitialized) {
      const entities = state?.entities?.entities ?? {};
      const candidateUnmaskingTableRows = entityIds.map(
        (entityId: string, index: number): StatusTableType | null => {
          if (!(entityId in entities)) {
            return null;
          }
          const entityStatus: EntityStatusLog = entityStatuses[index];
          const entityProperties =
            entityPropertiesByIdSelector(entityId)(state);
          return {
            ...entityProperties,
            id: entityId,
            name: entityProperties?.name ?? MASKED_RESPONSE,
            status: entityStatus.entityStatus,
            date: formatDate(new Date(entityStatus.timeStamp)),
            user: entityStatus.author,
          };
        }
      );
      const unmaskingTableRows: StatusTableType[] = [];
      candidateUnmaskingTableRows.forEach((row: StatusTableType | null) => {
        if (row !== null) {
          unmaskingTableRows.push(row);
        }
      });
      return unmaskingTableRows;
    }
  }
  return [];
};

export default governanceSlice.reducer;
