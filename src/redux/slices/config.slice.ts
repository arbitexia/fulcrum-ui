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
  DataSourceDescriptorConfig,
  GetDataSourceConfigParams,
  ReduxJson,
  ResponseStatus,
  EntityProperty,
} from '@/types';
import { configApi } from '@/redux/apis';
import { AxiosError } from 'axios';
import {
  EntitiesDescriptorConfig,
  GetEntitiesConfigParams,
} from '@/types/config.type';
import { keyComparator } from '@/libs/sort-utils';
import { checkAuthToken } from '@/libs/auth-token';

const initialState: ReduxJson.ConfigState = {
  dataSources: {
    loading: false,
    status: null,
    initialized: false,
    dataSourcesSelect: [],
    dataSourcesFields: {},
  },
  entities: {
    loading: false,
    status: null,
    initialized: false,
    entityProperties: [],
    entityDetailProperties: [],
    entityStatusValues: {
      default: 'new',
      values: [],
    },
  },
};

export const retrieveDataSources = createAsyncThunk<
  DataSourceDescriptorConfig,
  GetDataSourceConfigParams,
  { dispatch: AppDispatch; state: RootState }
>('config/retrieveDataSources', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await checkAuthToken();
    return await configApi.loadDataSourceConfig(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const retrieveEntitiesConfig = createAsyncThunk<
  EntitiesDescriptorConfig,
  GetEntitiesConfigParams,
  { dispatch: AppDispatch; state: RootState }
>('config/retrieveEntitiesConfig', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await checkAuthToken();
    return await configApi.loadEntitiesDisplayConfig(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

const configSlice = createSlice({
  name: `config`,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(retrieveDataSources.pending, (state) => {
        state.dataSources.loading = true;
        state.dataSources.initialized = false;
        state.dataSources.dataSourcesSelect = [];
        state.dataSources.dataSourcesFields = {};
        state.dataSources.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveDataSources.fulfilled,
        (state, { payload }: PayloadAction<DataSourceDescriptorConfig>) => {
          const dataSources: { id: string; name: string }[] = [];
          const dataSourcesFields: {
            [descriptorName: string]: { id: string; name: string }[];
          } = {};
          const { descriptors } = payload;
          Object.entries(descriptors).forEach((descriptorObject) => {
            const [descriptorName, descriptorSubObject]: [
              string,
              { labels: string[] }
            ] = descriptorObject;
            const dataSource: { id: string; name: string } = {
              id: descriptorName,
              name: descriptorName,
            };
            const { labels: subObjectLabels } = descriptorSubObject;
            const labelsForObject: { id: string; name: string }[] = [];
            subObjectLabels.forEach((label: string) => {
              labelsForObject.push({ id: label, name: label });
            });
            dataSources.push(dataSource);
            dataSourcesFields[descriptorName] = labelsForObject;
          });
          state.dataSources.loading = false;
          state.dataSources.initialized = true;
          dataSources.sort(
            keyComparator<{ id: string; name: string }>(dataSources, 'name')
          );
          state.dataSources.dataSourcesSelect = dataSources;
          state.dataSources.dataSourcesFields = dataSourcesFields;
          state.dataSources.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveDataSources.rejected, (state) => {
        state.dataSources.loading = false;
        state.dataSources.initialized = false;
        state.dataSources.dataSourcesSelect = [];
        state.dataSources.dataSourcesFields = {};
        state.dataSources.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveEntitiesConfig.pending, (state) => {
        state.entities.loading = true;
        state.entities.initialized = false;
        state.entities.entityProperties = [];
        state.entities.entityDetailProperties = [];
        state.entities.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveEntitiesConfig.fulfilled,
        (state, { payload }: PayloadAction<EntitiesDescriptorConfig>) => {
          const {
            entityProperties,
            entityDetailProperties,
            entityStatusValues,
          } = payload;
          state.entities.loading = false;
          state.entities.initialized = true;
          state.entities.entityProperties = entityProperties;
          state.entities.entityDetailProperties = entityDetailProperties;
          state.entities.entityStatusValues = entityStatusValues;
          state.entities.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveEntitiesConfig.rejected, (state) => {
        state.entities.loading = false;
        state.entities.initialized = false;
        state.entities.entityProperties = [];
        state.entities.entityDetailProperties = [];
        state.entities.status = ResponseStatus.FAILED;
      });
  },
});

export const getDataSourcesConfigInitialized = (state: RootState): boolean =>
  state.config.dataSources.initialized;

export const getDataSourcesSelect = (
  state: RootState
): { id: string; name: string }[] => state.config.dataSources.dataSourcesSelect;

export const getDataSourcesFields = (
  state: RootState
): { [descriptorName: string]: { id: string; name: string }[] } =>
  state.config.dataSources.dataSourcesFields;

export const getEntitiesConfigInitialized = (state: RootState): boolean =>
  state.config.entities.initialized;

export const getEntityProperties = (state: RootState): EntityProperty[] =>
  state.config.entities.entityProperties;

export const getEntityDetailProperties = (state: RootState): EntityProperty[] =>
  state.config.entities.entityDetailProperties;

export const geEntityStatusValues = (
  state: RootState
): { default: string; values: EntityProperty[] } =>
  state.config.entities.entityStatusValues;

export default configSlice.reducer;
