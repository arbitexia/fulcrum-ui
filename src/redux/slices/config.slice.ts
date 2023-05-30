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
  GetRiskIndicatorConfigParams,
  RiskIndicatorConfig,
} from '@/types/config.type';
import { keyComparator } from '@/libs/sort-utils';
import { isAccessTokenValid } from '@/libs/auth-token';
import { UISelectInterface } from '@/types/common.type';
import { formatKey } from '@/libs/string-utils';

const initialState: ReduxJson.ConfigState = {
  dataSources: {
    loading: false,
    status: null,
    initialized: false,
    dataSourcesSelect: [],
    dataSourcesFields: {},
    entityFields: [],
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
    entityMaskingValues: {
      default: 'in-review',
      values: [],
    },
    homePageTopPercent: 0.01,
  },
  riskIndicators: {
    loading: false,
    status: null,
    initialized: false,
    topNumberRiskIndicators: 10,
  },
};

export const retrieveDataSources = createAsyncThunk<
  DataSourceDescriptorConfig,
  GetDataSourceConfigParams,
  { dispatch: AppDispatch; state: RootState }
>('config/retrieveDataSources', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
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
    await isAccessTokenValid();
    return await configApi.loadEntitiesDisplayConfig(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const retrieveRiskIndicatorsConfig = createAsyncThunk<
  RiskIndicatorConfig,
  GetRiskIndicatorConfigParams,
  { dispatch: AppDispatch; state: RootState }
>('config/retrieveRiskIndicatorsConfig', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await configApi.loadRiskIndicatorsConfig(params);
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
          const newSetEntityFields = new Set<string>(
            state.dataSources.entityFields
          );
          const { descriptors } = payload;
          Object.entries(descriptors).forEach((descriptorObject) => {
            const [descriptorName, descriptorSubObject]: [
              string,
              { labels: string[]; entityFields: string[] }
            ] = descriptorObject;
            const dataSource: { id: string; name: string } = {
              id: descriptorName,
              name: descriptorName,
            };
            const {
              labels: subObjectLabels,
              entityFields: entityFieldsForObject,
            } = descriptorSubObject;
            const labelsForObject: { id: string; name: string }[] = [];
            subObjectLabels.forEach((label: string) => {
              labelsForObject.push({ id: label, name: label });
            });
            if (entityFieldsForObject) {
              entityFieldsForObject.forEach((label: string) => {
                newSetEntityFields.add(label);
              });
            }
            dataSources.push(dataSource);
            dataSourcesFields[descriptorName] = labelsForObject;
          });
          state.dataSources.entityFields = Array.from(newSetEntityFields);
          dataSources.sort(
            keyComparator<{ id: string; name: string }>(dataSources, 'name')
          );
          state.dataSources.dataSourcesSelect = dataSources;
          state.dataSources.dataSourcesFields = dataSourcesFields;
          state.dataSources.loading = false;
          state.dataSources.initialized = true;
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
            entityMaskingValues,
            homePageTopPercent,
          } = payload;
          state.entities.loading = false;
          state.entities.initialized = true;
          state.entities.entityProperties = entityProperties;
          state.entities.entityDetailProperties = entityDetailProperties;
          state.entities.entityStatusValues = entityStatusValues;
          state.entities.entityMaskingValues = entityMaskingValues;
          state.entities.homePageTopPercent = homePageTopPercent;
          state.entities.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveEntitiesConfig.rejected, (state) => {
        state.entities.loading = false;
        state.entities.initialized = false;
        state.entities.entityProperties = [];
        state.entities.entityDetailProperties = [];
        state.entities.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveRiskIndicatorsConfig.pending, (state) => {
        state.riskIndicators.loading = true;
        state.riskIndicators.initialized = false;
        state.riskIndicators.topNumberRiskIndicators = 0;
        state.riskIndicators.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveRiskIndicatorsConfig.fulfilled,
        (state, { payload }: PayloadAction<RiskIndicatorConfig>) => {
          const { topNumberRiskIndicators } = payload;
          state.riskIndicators.loading = false;
          state.riskIndicators.initialized = true;
          state.riskIndicators.topNumberRiskIndicators =
            topNumberRiskIndicators;
          state.riskIndicators.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveRiskIndicatorsConfig.rejected, (state) => {
        state.riskIndicators.loading = false;
        state.riskIndicators.initialized = false;
        state.riskIndicators.topNumberRiskIndicators = 0;
        state.riskIndicators.status = ResponseStatus.FAILED;
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

export const getEntityFilterValues = (
  state: RootState
): UISelectInterface[] => {
  const entityFilterFields: Set<string> = state.config.dataSources.entityFields;
  return Array.from(entityFilterFields).map((entityFilter: string) => {
    return { id: entityFilter, name: formatKey(entityFilter) };
  });
};

export const getEntityStatusValues = (
  state: RootState
): { default: string; values: EntityProperty[] } =>
  state.config.entities.entityStatusValues;

export const getEntityMaskingValues = (
  state: RootState
): { default: string; values: EntityProperty[] } =>
  state.config.entities.entityMaskingValues;

export const getEntityMaskingValuesDefaultStatus = (state: RootState): string =>
  state.config.entities.entityMaskingValues.default;

export const entityMaskingIcons: { [status: string]: string } = {
  none: 'images/icons/eye.svg',
  'in-review': 'images/icons/sending.svg',
};

export const getHomePageTopPercent = (state: RootState): number =>
  state?.config?.entities?.homePageTopPercent ?? 0;

export const getRiskIndicatorsConfigInitialized = (state: RootState): boolean =>
  state?.config?.riskIndicators?.initialized ?? false;

export const getNumberTopRiskIndicators = (state: RootState): number =>
  state?.config?.riskIndicators?.topNumberRiskIndicators ?? 10;

export default configSlice.reducer;
