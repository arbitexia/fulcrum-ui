/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Dan Finkel
 */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from '@/redux/store';
import {
  Attributes,
  EntityPropertyBase,
  PaginateResult,
  ReduxJson,
  ResponseStatus,
  ScoringRankingResult,
} from '@/types';
import { entityApi } from '@/redux/apis';
import { AxiosError } from 'axios';
import {
  Entity,
  GetEntityParams,
  GetEntitiesParams,
  QueryEntityParams,
  PropertyType,
  Attribute,
  EntityRanking,
  ScoringResult,
} from '@/types';
import {
  HistoricalRanking,
  HistoricalRankingResult,
  Scoring,
} from '@/types/scoring.type';
import {
  retrieveHistoricalDataForModelAndEntity,
  retrieveScores,
  retrieveScoresForEntity,
} from '@/redux/slices/scoring.slice';
import {
  EntityComment,
  EntityReturn,
  EntityReturnStatus,
  EntityStatus,
  NewEntityCommentsParams,
  NewEntityStatusParams,
  QueryEntityCommentsParams,
  QueryEntityStatusParams,
} from '@/types/entity.type';
import { roundScoreIntelligently } from '@/libs/math-utils';
import {
  formatDate,
  HOUR_AS_MILLISECONDS_FROM_EPOCH,
  WEEK_AS_MILLISECONDS_FROM_EPOCH,
} from '@/libs/time-utils';
import {
  HistoricalDataCategoryScore,
  HistoricalDataForEntityId,
  HistoricalDataRiskIndicatorScore,
  ProfileTimeLineRiskType,
  ProfileTimeLineType,
} from '@/_mock/profile.mock';
import { BubbleDataPoint, ChartData, ScatterDataPoint } from 'chart.js';
import { outlierColor } from '@/libs/color-generator';
import { difference } from '@/libs/set-utils';
import {
  getMaskedEntityStatusSelector,
  getSystemMaskingSelector,
} from '@/redux/slices/governance.slice';
import { existsInArray } from '@/libs/array-utils';
import { entityMaskingIcons } from '@/redux/slices/config.slice';
import { genRefreshToken } from '@/libs/auth-token';

const initialState: ReduxJson.EntitiesState = {
  loading: true,
  initialized: false,
  status: null,
  entities: {},
  entitiesPending: {},
  entitiesHaveFailed: {},
  isCommentsInitialized: false,
  isStatusInitialized: false,
  rankingByEntityId: {},
  historyByEntityId: {},
};

export const ENTITY_STATUS_NEW = 'New';
export const ENTITY_STATUS_IN_PROGRESS = 'In progress';
export const ENTITY_STATUS_REVIEWED = 'Reviewed';
export const ENTITY_STATUS_CASE_OPENED = 'Case Opened';
export const ENTITY_STATUS_CASE_CLOSED = 'Case Closed';
export const MASKED_RESPONSE = '[MASKED]';
export const NOT_AVAILABLE = 'N/A';

export const getEntities = createAsyncThunk<
  Entity[],
  GetEntitiesParams,
  { dispatch: AppDispatch; state: RootState }
>('entity/getEntities', async (params: GetEntitiesParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    return await entityApi.loadEntitiesData(params);
  } catch (error) {
    const err = error as AxiosError;
    await genRefreshToken(err);
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const getEntity = createAsyncThunk<
  Entity,
  GetEntityParams,
  { dispatch: AppDispatch; state: RootState }
>('entity/getEntity', async (params: GetEntityParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    return await entityApi.loadEntityData(params);
  } catch (error) {
    const err = error as AxiosError;
    await genRefreshToken(err);
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const getUnmaskedEntity = createAsyncThunk<
  Entity,
  GetEntityParams,
  { dispatch: AppDispatch; state: RootState }
>('entity/getUnmaskedEntity', async (params: GetEntityParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    return await entityApi.loadUnmaskedEntityData(params);
  } catch (error) {
    const err = error as AxiosError;
    await genRefreshToken(err);
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const getEntityStatus = createAsyncThunk<
  EntityReturnStatus,
  QueryEntityStatusParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'entity/getEntityStatus',
  async (params: QueryEntityStatusParams, thunkAPI) => {
    try {
      // TODO - define the api auth token
      return await entityApi.loadEntityStatusData(params);
    } catch (error) {
      const err = error as AxiosError;
      await genRefreshToken(err);
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const newEntityStatus = createAsyncThunk<
  EntityReturnStatus,
  NewEntityStatusParams,
  { dispatch: AppDispatch; state: RootState }
>('entity/newEntityStatus', async (params: NewEntityStatusParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    return await entityApi.newEntityStatus(params);
  } catch (error) {
    const err = error as AxiosError;
    await genRefreshToken(err);
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const getEntityComments = createAsyncThunk<
  EntityReturn,
  QueryEntityCommentsParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'entity/getEntityComments',
  async (params: QueryEntityCommentsParams, thunkAPI) => {
    try {
      // TODO - define the api auth token
      return await entityApi.loadEntityCommentsData(params);
    } catch (error) {
      const err = error as AxiosError;
      await genRefreshToken(err);
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const newEntityComment = createAsyncThunk<
  EntityReturn,
  NewEntityCommentsParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'entity/newEntityComment',
  async (params: NewEntityCommentsParams, thunkAPI) => {
    try {
      // TODO - define the api auth token
      return await entityApi.newEntityComments(params);
    } catch (error) {
      const err = error as AxiosError;
      await genRefreshToken(err);
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const queryEntities = createAsyncThunk<
  Entity[],
  QueryEntityParams,
  { dispatch: AppDispatch; state: RootState }
>('entity/queryEntities', async (params: QueryEntityParams, thunkAPI) => {
  try {
    return await entityApi.queryEntityData(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

const entitiesSlice = createSlice({
  name: `entities`,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEntities.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        getEntities.fulfilled,
        (state, { payload }: PayloadAction<Entity[]>) => {
          state.loading = false;
          state.initialized = true;
          state.status = ResponseStatus.SUCCESS;
          const entitiesById: { [id: string]: Entity } = {};
          payload.forEach((entity) => {
            const { entityId, properties } = entity;
            const newProperties: { [propertyId: string]: string } = {};
            Object.entries(properties).forEach(([key, value]) => {
              const lowerCasedKey = key.toLowerCase();
              newProperties[lowerCasedKey] = value as string;
            });
            entitiesById[entityId] = { ...entity, properties: newProperties };
          });
          state.entities = entitiesById;
        }
      )
      .addCase(getEntities.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
        state.entities = {};
      })
      .addCase(getEntity.pending, (state, { meta }) => {
        state.loading = true;
        const { arg: params } = meta;
        const { entityId } = params;
        if (!(entityId in state.entitiesPending)) {
          const newEntitiesPending = {
            ...state.entitiesPending,
            [entityId]: true,
          };
          state.entitiesPending = newEntitiesPending;
        }
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        getEntity.fulfilled,
        (state, { payload }: PayloadAction<Entity>) => {
          state.loading = false;
          const { entityId, properties } = payload;
          const newProperties: { [propertyId: string]: string } = {};
          Object.entries(properties).forEach(([key, value]) => {
            const lowerCasedKey = key.toLowerCase();
            newProperties[lowerCasedKey] = value as string;
          });
          const newEntity: Entity = { ...payload, properties: newProperties };
          state.entities = {
            ...state.entities,
            [entityId]: newEntity,
          };
          if (entityId in state.entitiesPending) {
            const { [entityId]: _value, ...newEntitiesPending } =
              state.entitiesPending;
            state.entitiesPending = newEntitiesPending;
          }
          state.initialized = true;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(getEntity.rejected, (state, { meta }) => {
        state.loading = false;
        const { arg: params } = meta;
        const { entityId } = params;
        if (entityId in state.entitiesPending) {
          const { [entityId]: _value, ...newEntitiesPending } =
            state.entitiesPending;
          state.entitiesPending = newEntitiesPending;
        }
        if (!(entityId in state.entitiesHaveFailed)) {
          const newEntitiesHaveFailed = {
            ...state.entitiesHaveFailed,
            [entityId]: true,
          };
          state.entitiesHaveFailed = newEntitiesHaveFailed;
        }
        state.entities = {};
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(getUnmaskedEntity.pending, (state, { meta }) => {
        state.loading = true;
        const { arg: params } = meta;
        const { entityId } = params;
        if (!(entityId in state.entitiesPending)) {
          const newEntitiesPending = {
            ...state.entitiesPending,
            [entityId]: true,
          };
          state.entitiesPending = newEntitiesPending;
        }
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        getUnmaskedEntity.fulfilled,
        (state, { payload }: PayloadAction<Entity>) => {
          state.loading = false;
          const { entityId, properties } = payload;
          const newProperties: { [propertyId: string]: string } = {};
          Object.entries(properties).forEach(([key, value]) => {
            const lowerCasedKey = key.toLowerCase();
            newProperties[lowerCasedKey] = value as string;
          });
          const newEntity: Entity = { ...payload, properties: newProperties };
          state.entities = {
            ...state.entities,
            [entityId]: newEntity,
          };
          if (entityId in state.entitiesPending) {
            const { [entityId]: _value, ...newEntitiesPending } =
              state.entitiesPending;
            state.entitiesPending = newEntitiesPending;
          }
          state.initialized = true;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(getUnmaskedEntity.rejected, (state, { meta }) => {
        state.loading = false;
        const { arg: params } = meta;
        const { entityId } = params;
        if (entityId in state.entitiesPending) {
          const { [entityId]: _value, ...newEntitiesPending } =
            state.entitiesPending;
          state.entitiesPending = newEntitiesPending;
        }
        if (!(entityId in state.entitiesHaveFailed)) {
          const newEntitiesHaveFailed = {
            ...state.entitiesHaveFailed,
            [entityId]: true,
          };
          state.entitiesHaveFailed = newEntitiesHaveFailed;
        }
        state.entities = {};
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(queryEntities.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        queryEntities.fulfilled,
        (state, { payload }: PayloadAction<Entity[]>) => {
          state.loading = false;
          const entitiesById: { [id: string]: Entity } = {};
          payload.forEach((entity) => {
            const { entityId, properties } = entity;
            const newProperties: { [propertyId: string]: string } = {};
            Object.entries(properties).forEach(([key, value]) => {
              const lowerCasedKey = key.toLowerCase();
              newProperties[lowerCasedKey] = value as string;
            });
            entitiesById[entityId] = { ...entity, properties: newProperties };
          });
          state.entities = entitiesById;
          state.initialized = true;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(queryEntities.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
        state.entities = {};
      })
      .addCase(retrieveScores.pending, (state) => {
        state.loading = true;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveScores.fulfilled,
        (state, { payload }: PayloadAction<PaginateResult<Scoring>>) => {
          state.loading = false;
          state.initialized = true;
          const payloadScoring: Scoring[] = payload?.data ?? [];

          const entitiesById: { [id: string]: Entity } = {};
          const rankingByEntities: { [id: string]: EntityRanking } = {};
          payloadScoring.forEach((scoringObject: Scoring) => {
            const entity: Entity = scoringObject.entity;
            const ranking: ScoringRankingResult = scoringObject.ranking;
            const { ranking: rankingString } = ranking;
            const entityRanking: EntityRanking = JSON.parse(rankingString);
            const { entityId, properties } = entity;
            const newProperties: { [propertyId: string]: string } = {};
            Object.entries(properties).forEach(([key, value]) => {
              const lowerCasedKey = key.toLowerCase();
              newProperties[lowerCasedKey] = value as string;
            });
            const score = roundScoreIntelligently(entityRanking?.score ?? 0.0);
            const rank = entityRanking?.rank ?? 0;
            newProperties['score'] = score.toString();
            newProperties['rank'] = rank.toString();
            entitiesById[entityId] = { ...entity, properties: newProperties };
            rankingByEntities[entityId] = entityRanking;
          });
          state.entities = entitiesById;
          state.rankingByEntityId = rankingByEntities;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveScores.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.entities = {};
        state.rankingByEntityId = {};
        state.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveScoresForEntity.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveScoresForEntity.fulfilled,
        (state, { payload }: PayloadAction<EntityRanking>) => {
          state.loading = false;
          const entitiesById = { ...state.entities };
          const entityId: string = payload.entityId as string;
          const scoringResult: ScoringResult = payload.scoringResult;
          const rankingByEntities: { [entityId: string]: EntityRanking } = {
            [entityId]: payload,
          };
          if (entitiesById && entityId in entitiesById) {
            const entity = entitiesById[entityId];
            if (entity) {
              const { properties } = entity;
              const score = roundScoreIntelligently(
                rankingByEntities[entityId]?.score ?? 0.0
              );
              const rank = rankingByEntities[entityId]?.rank ?? 0;
              const newProperties = { ...properties };
              newProperties['score'] = score.toString();
              newProperties['rank'] = rank.toString();
              if (scoringResult) {
                const categories = scoringResult.attributes;
                const newCategories: Attributes = [];
                if (categories) {
                  categories.forEach((category) => {
                    const riskIndicators = category.attributes;
                    const newRiskIndicators: Attributes = [];
                    const {
                      scoringDetailsJsonString: _scoringDetailsString,
                      ...newCategory
                    } = category;
                    if (riskIndicators) {
                      riskIndicators.forEach((riskIndicator) => {
                        const {
                          scoringDetailsJsonString: riskIndicatorJsonString,
                          ...newRiskIndicator
                        } = riskIndicator;
                        const scoringDetailsJson = riskIndicatorJsonString
                          ? JSON.parse(riskIndicatorJsonString)
                          : undefined;
                        newRiskIndicators.push({
                          ...newRiskIndicator,
                          scoringDetailsJson,
                        });
                      });
                    }
                    newCategories.push({
                      ...newCategory,
                      attributes: newRiskIndicators,
                    });
                  });
                }
                const newScoringResult = {
                  ...scoringResult,
                  attributes: newCategories,
                };
                const newEntity: Entity = {
                  ...entity,
                  properties: newProperties,
                  scoringResult: newScoringResult,
                };
                entitiesById[entityId] = newEntity;
              } else {
                const newEntity: Entity = {
                  ...entity,
                  properties: newProperties,
                };
                entitiesById[entityId] = newEntity;
              }
            }
          }
          state.entities = entitiesById;
          state.rankingByEntityId = rankingByEntities;
          state.initialized = true;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveScoresForEntity.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.rankingByEntityId = {};
        state.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveHistoricalDataForModelAndEntity.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveHistoricalDataForModelAndEntity.fulfilled,
        (state, { payload }: PayloadAction<HistoricalRankingResult>) => {
          state.loading = false;
          const entitiesById: { [id: string]: Entity } = { ...state.entities };
          const entityId: string = payload.entityId;
          /* we create a linked list on this value, so we can see that the values are correct in timeline */
          const historicalRankingByTimestamp: {
            [dateString: string]: HistoricalRanking;
          } = {};

          const historicalRankingList: HistoricalRanking[] = [];
          const entityIds: string[] = [];
          payload.historicalRanking.forEach((historicalRankingValue) => {
            const timeStampUTCMilliseconds: number =
              historicalRankingValue.scoringInstance;
            const date = new Date(timeStampUTCMilliseconds);
            const dateString = formatDate(date);
            const rankingString: string = historicalRankingValue.ranking;
            const rankingValue = JSON.parse(rankingString);
            const ranking: ScoringResult =
              rankingValue.scoringResult as ScoringResult;
            const entity: string = historicalRankingValue.entity;
            const scoringInstance: number =
              historicalRankingValue.scoringInstance;
            const value: HistoricalRanking = {
              entity,
              scoringInstance,
              ranking,
              prev: null,
              next: null,
            };
            /* We always get the latest value for historical ranking by timestamp */
            historicalRankingByTimestamp[dateString] = value;
            historicalRankingList.push(value);
            entityIds.push(entity);
          });
          const historicalRankingLinkedList = historicalRankingList.map(
            (value, index, array) => {
              if (index === 0) {
                return { ...value, prev: null, next: array[index + 1] };
              } else if (index > 0 && index < array.length - 1) {
                return {
                  ...value,
                  prev: array[index - 1],
                  next: array[index + 1],
                };
              } else {
                // (index > 0 && index === array.length - 1)
                return { ...value, prev: array[index - 1], next: null };
              }
            }
          );
          if (!entityId) {
            throw new Error('Entity ID not found in payload');
          }
          const entityIdsUnique = entityIds.filter(
            (entityValue: string, index: number, array: string[]) =>
              array.indexOf(entityValue) === index
          );
          if (entityIdsUnique.length !== 1) {
            throw new Error(
              `Need one entityId. Found: ${entityIdsUnique.toString()}`
            );
          }
          const entityIdToOperate: string = entityIds[0];
          if (entityIdToOperate !== entityId) {
            throw new Error(
              `Expected entity ID: ${entityId}. Got: ${entityIdToOperate}`
            );
          }
          const currentEntity = entitiesById[entityId];
          if (currentEntity) {
            const newEntity: Entity = {
              ...currentEntity,
              entityHistoricalRanking: historicalRankingByTimestamp,
            };
            state.entities = { ...state.entities, [entityId]: newEntity };
          }
          state.historyByEntityId = {
            ...state.historyByEntityId,
            [entityId]: historicalRankingLinkedList,
          };
          state.initialized = true;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveHistoricalDataForModelAndEntity.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(getEntityComments.pending, (state) => {
        state.loading = true;
        state.isCommentsInitialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        getEntityComments.fulfilled,
        (state, { payload }: PayloadAction<EntityReturn>) => {
          state.loading = false;
          state.initialized = true;
          const { entityId, entityComments } = payload;
          if (entityId) {
            const stateEntity = state.entities[entityId] ?? null;
            if (stateEntity) {
              const newEntity = { ...stateEntity, entityComments };
              state.entities = { ...state.entities, [entityId]: newEntity };
            }
          }
          state.isCommentsInitialized = true;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(getEntityComments.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.isCommentsInitialized = true;
        state.status = ResponseStatus.FAILED;
        state.entities = {};
      })
      .addCase(newEntityComment.pending, (state) => {
        state.loading = true;
        state.isCommentsInitialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        newEntityComment.fulfilled,
        (state, { payload }: PayloadAction<EntityReturn>) => {
          state.loading = false;
          state.initialized = true;
          const { entityId, entityComments: savedEntityComments } = payload;
          if (entityId && savedEntityComments) {
            const stateEntity = state.entities[entityId] ?? null;
            if (stateEntity) {
              const oldEntityComments = stateEntity?.entityComments ?? [];
              const entityComments = [
                ...oldEntityComments,
                ...savedEntityComments,
              ];
              const newEntity = { ...stateEntity, entityComments };
              state.entities = { ...state.entities, [entityId]: newEntity };
            }
          }
          state.isCommentsInitialized = true;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(newEntityComment.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.isCommentsInitialized = true;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(getEntityStatus.pending, (state, { meta }) => {
        state.loading = true;
        const { arg: params } = meta;
        const { entityId } = params;
        if (!(entityId in state.entitiesPending)) {
          const newEntitiesPending = {
            ...state.entitiesPending,
            [entityId]: true,
          };
          state.entitiesPending = newEntitiesPending;
        }
        state.isStatusInitialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        getEntityStatus.fulfilled,
        (state, { payload }: PayloadAction<EntityReturnStatus>) => {
          const { entityId, entityStatus } = payload;
          if (entityId) {
            const entityIdString = entityId;
            const stateEntity = state.entities[entityIdString] ?? null;
            if (stateEntity) {
              const newEntity = {
                ...stateEntity,
                entityId: entityIdString,
                entityStatus,
              };
              state.entities = {
                ...state.entities,
                [entityIdString]: newEntity,
              };
            }
          }
          if (entityId in state.entitiesPending) {
            const { [entityId]: _value, ...newEntitiesPending } =
              state.entitiesPending;
            state.entitiesPending = newEntitiesPending;
          }
          state.loading = false;
          state.initialized = true;
          state.isStatusInitialized = true;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(getEntityStatus.rejected, (state, { meta }) => {
        const { arg: params } = meta;
        const { entityId } = params;
        if (entityId in state.entitiesPending) {
          const { [entityId]: _value, ...newEntitiesPending } =
            state.entitiesPending;
          state.entitiesPending = newEntitiesPending;
        }
        if (!(entityId in state.entitiesHaveFailed)) {
          const newEntitiesHaveFailed = {
            ...state.entitiesHaveFailed,
            [entityId]: true,
          };
          state.entitiesHaveFailed = newEntitiesHaveFailed;
        }
        state.loading = false;
        state.initialized = true;
        state.isStatusInitialized = true;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(newEntityStatus.pending, (state) => {
        state.loading = true;
        state.isStatusInitialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        newEntityStatus.fulfilled,
        (state, { payload }: PayloadAction<EntityReturnStatus>) => {
          state.loading = false;
          state.initialized = true;
          const { entityId, entityStatus } = payload;
          if (entityId && entityStatus) {
            const stateEntity = state.entities[entityId] ?? null;
            if (stateEntity) {
              const newEntity = {
                ...stateEntity,
                entityId,
                entityStatus,
              };
              state.entities = {
                ...state.entities,
                [entityId]: newEntity,
              };
            }
          }
          state.isStatusInitialized = true;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(newEntityStatus.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.isStatusInitialized = true;
        state.status = ResponseStatus.FAILED;
      });
  },
});

export const getEntitiesSelector: (state: RootState) => Entity[] = (
  state: RootState
) => {
  const entities = state?.entities?.entities ?? {};
  return Object.values(entities);
};

export const entitiesByIdSelector = (
  state: RootState
): { [id: string]: Entity } => state.entities?.entities ?? null;

export const entityByIdSelector =
  (entityId: string): ((state: RootState) => Entity | null) =>
  (state: RootState) => {
    if (entityId) {
      if (state.entities.entities) {
        if (entityId in state.entities.entities) {
          return state.entities?.entities[entityId];
        }
      }
    }
    return null;
  };

export const hasEntitiesSelector =
  (entityIds: string[]): ((state: RootState) => boolean[]) =>
  (state: RootState) => {
    if (entityIds && entityIds.length > 0) {
      if (state.entities.entities) {
        return entityIds.map(
          (entityId: string) => entityId in state.entities.entities
        );
      }
    }
    return new Array(entityIds.length).fill(false);
  };

export const needsStatusesEntityIdsSelector = (state: RootState): string[] => {
  const allEntities: Entity[] = Object.values(state?.entities?.entities ?? {});
  const entityIds = allEntities
    .filter((entity: Entity) => (entity?.entityStatus || '') === '')
    .map((entity: Entity) => entity.entityId);
  const entityIdsSet: Set<string> = new Set<string>(entityIds);
  const entitiesPending: Set<string> = new Set<string>(
    Object.keys(state.entities.entitiesPending)
  );
  const entitiesFailed: Set<string> = new Set<string>(
    Object.keys(state.entities.entitiesHaveFailed)
  );
  const entitiesStillExtant: Set<string> = difference<string>(
    entityIdsSet,
    entitiesPending
  );
  const entitiesNotFailed: Set<string> = difference<string>(
    entitiesStillExtant,
    entitiesFailed
  );
  return Array.from(entitiesNotFailed);
};

export const needsEntitiesSelector =
  (entityIds: string[]): ((state: RootState) => string[]) =>
  (state: RootState) => {
    const entityIdsSet: Set<string> = new Set<string>(entityIds);
    const entitiesPending: Set<string> = new Set<string>(
      Object.keys(state.entities.entitiesPending)
    );
    const entitiesFailed: Set<string> = new Set<string>(
        Object.keys(state.entities.entitiesHaveFailed)
    );
    const entitiesStillExtant: Set<string> = difference<string>(
      entityIdsSet,
      entitiesPending
    );
    const entitiesNotFailed: Set<string> = difference<string>(
        entitiesStillExtant,
        entitiesFailed
    );
    if (entityIds && entityIds.length > 0) {
      if (state.entities.entities) {
        const stateEntities: Set<string> = new Set<string>(
          Object.keys(state.entities.entities)
        );
        const setDifference: Set<string> = difference<string>(
          entitiesNotFailed,
          stateEntities
        );
        return Array.from(setDifference);
      }
    }
    return Array.from(entitiesNotFailed);
  };

const transformProperties =
  (properties: PropertyType): ((state: RootState) => PropertyType) =>
  (state: RootState) => {
    const newProperties = { ...properties };
    const {
      entityProperties: entityConfigProperties,
      entityDetailProperties: entityConfigDetailProperties,
    } = state.config.entities;
    entityConfigProperties.forEach(
      (entityConfigProperty: EntityPropertyBase | string) => {
        if (
          typeof entityConfigProperty === 'string' &&
          !(entityConfigProperty in newProperties)
        ) {
          newProperties[entityConfigProperty] = '';
        } else if (typeof entityConfigProperty === 'object') {
          const entityConfigPropertyBase: EntityPropertyBase =
            entityConfigProperty as EntityPropertyBase;
          const { propertyName, values = [] } = entityConfigPropertyBase;
          if (!(propertyName in newProperties)) {
            newProperties[propertyName] = values
              ? values
                  .map((value) => newProperties[value] ?? '')
                  .join(' ')
                  .trim()
              : '';
          }
        }
      }
    );
    entityConfigDetailProperties.forEach(
      (entityConfigProperty: EntityPropertyBase | string) => {
        if (
          typeof entityConfigProperty === 'string' &&
          !(entityConfigProperty in newProperties)
        ) {
          newProperties[entityConfigProperty] = '';
        } else if (typeof entityConfigProperty === 'object') {
          const entityConfigPropertyBase: EntityPropertyBase =
            entityConfigProperty as EntityPropertyBase;
          const { propertyName, values = [] } = entityConfigPropertyBase;
          if (!(propertyName in newProperties)) {
            newProperties[propertyName] = values
              ? values
                  .map((value) => newProperties[value] ?? '')
                  .join(' ')
                  .trim()
              : '';
          }
        }
      }
    );
    return newProperties;
  };

export const entityPropertiesByIdSelector =
  (entityId: string): ((state: RootState) => PropertyType | undefined) =>
  (state: RootState) => {
    if (entityId && state.entities.entities) {
      if (state.entities.entities[entityId]) {
        const { properties } = state.entities.entities[entityId];
        return transformProperties(properties)(state);
      }
    }
    return undefined;
  };

export const convertEntityToDashboardTable = (
  entityProperties: PropertyType[] | null,
  entityId: string,
  entity: Entity
): PropertyType | null => {
  const properties = (entity && entity?.properties) ?? {};

  if (!entityId || !properties) {
    return null;
  }

  return properties;
};

const maskedTransformer: {
  [key: string]: (
    input: string | number | boolean | null
  ) => string | number | boolean;
} = {
  score: (score: string | number | boolean | null): string | number | boolean =>
    !!score && score,
  name: (_name: string | number | boolean | null): string | number | boolean =>
    'Unmask',
  status: (
    status: string | number | boolean | null
  ): string | number | boolean => !!status && status,
  rank: (rank: string | number | boolean | null): string | number | boolean =>
    !!rank && rank,
  location: (
    location: string | number | boolean | null
  ): string | number | boolean => !!location && location,
};

const defaultTransformer = (
  _item: string | number | boolean | null
): string | number | boolean => '';

export const getEntitiesByIdWithMasking = (
  state: RootState
): { [entityId: string]: Entity } => {
  const entities: { [id: string]: Entity } =
    (state.entities?.entities && state?.entities?.entities) ?? null;
  const isMaskingOn = getSystemMaskingSelector(state);
  const entitiesMasked: { [entityId: string]: Entity } = {};
  if (entities) {
    Object.entries(entities).forEach(
      ([entityId, entity]: [entityid: string, entity: Entity]) => {
        const entityStatus =
          entity && entity.entityStatus
            ? entity.entityStatus
            : ENTITY_STATUS_NEW;
        const maskedEntityStatus: string =
          getMaskedEntityStatusSelector(entityId)(state);
        const maskedEntityIcon: string =
          maskedEntityStatus && maskedEntityStatus in entityMaskingIcons
            ? entityMaskingIcons[maskedEntityStatus]
            : '';
        const existsPropertyMasked = existsInArray<
          string | number | boolean | null
        >(
          Object.values(entity.properties ?? []),
          (property: string | number | boolean | null) => {
            if (property !== null) {
              return property.toString() === MASKED_RESPONSE;
            }
            return false;
          }
        );
        const maskedProperties: {
          [key: string]: string | number | boolean | null;
        } = {};
        const transformedProperties = transformProperties(entity.properties)(
          state
        );
        Object.entries(transformedProperties).forEach(([key, value]) => {
          if (
            isMaskingOn &&
            existsPropertyMasked &&
            maskedEntityStatus !== 'approved'
          ) {
            if (key in maskedTransformer) {
              maskedProperties[key] = maskedTransformer[key](value);
            } else {
              maskedProperties[key] = defaultTransformer(value);
            }
          } else {
            maskedProperties[key] = value;
          }
        });
        const newEntity: Entity = {
          ...entity,
          properties: { ...maskedProperties, status: entityStatus },
          isMasked:
            isMaskingOn &&
            existsPropertyMasked &&
            maskedEntityStatus !== 'approved',
          maskingStatus:
            isMaskingOn && existsPropertyMasked
              ? maskedEntityStatus
              : 'approved',
          icon: isMaskingOn && existsPropertyMasked ? maskedEntityIcon : null,
        };
        entitiesMasked[entityId] = newEntity;
      }
    );
  }
  return entitiesMasked;
};

export const convertEntitiesPropertiesToDashBoardTable = (
  state: RootState
): PropertyType[] => {
  const entities: { [id: string]: Entity } = getEntitiesByIdWithMasking(state);
  if (entities) {
    return Object.entries(entities).map(
      ([entityId, entity]: [entityid: string, entity: Entity]) => {
        const unmaskToken: string = entity.unmaskToken;
        return {
          ...entity.properties,
          id: entityId,
          isMasked: entity.isMasked ?? false,
          maskingStatus: entity.maskingStatus ?? 'approved',
          icon: entity.icon ?? null,
          unmaskToken,
        };
      }
    );
  }
  return [];
};

export const convertEntityPropertiesToDashBoardTable =
  (entityId: string): ((state: RootState) => PropertyType | undefined) =>
  (state: RootState) => {
    const entity =
      (state.entities?.entities && state?.entities?.entities[entityId]) ?? null;
    const entityProperties = state.entities?.entityProperties
      ? state.entities?.entityProperties
      : null;
    if (entity) {
      const dashboardEntityCandidate = convertEntityToDashboardTable(
        entityProperties,
        entityId,
        entity
      );
      if (dashboardEntityCandidate) {
        return dashboardEntityCandidate;
      }
    }
    return undefined;
  };

export const convertEntityPropertiesToEntityDetailsTableValues =
  (
    entityId: string,
    exclusions?: string[]
  ): ((state: RootState) => PropertyType | undefined) =>
  (state: RootState) => {
    const entity =
      (state?.entities?.entities && state?.entities?.entities[entityId]) ??
      null;
    const excludedSet: Set<string> = new Set(exclusions ?? []);
    if (entity) {
      const { properties } = entity;
      const parsedProperties: { [formattedProperty: string]: string } = {};
      Object.keys(properties).forEach((key: string) => {
        if (!excludedSet.has(key)) {
          parsedProperties[key] = properties[key];
        }
      });
      return parsedProperties;
    }
    return undefined;
  };

export const scoredCategoriesTreeListSelector =
  (entityId: string): ((state: RootState) => Attribute[]) =>
  (state: RootState) => {
    const entity =
      (state?.entities?.entities && state?.entities?.entities[entityId]) ??
      null;
    if (entity) {
      const rankingByEntityId =
        (state.entities?.rankingByEntityId &&
          state.entities?.rankingByEntityId[entityId]) ??
        null;
      if (rankingByEntityId) {
        const scoringResult: ScoringResult =
          rankingByEntityId.scoringResult ?? null;
        if (scoringResult) {
          return scoringResult.attributes ?? [];
        }
      }
    }
    return [];
  };

export const getIsEntitiesInitialized = (state: RootState): boolean =>
  state.entities?.initialized ?? false;

export const getCommentsForEntityId =
  (entityId: string): ((state: RootState) => EntityComment[]) =>
  (state: RootState) => {
    const entity =
      (state?.entities?.entities && state?.entities?.entities[entityId]) ??
      null;
    if (entity) {
      return entity.entityComments ?? [];
    }
    return [];
  };

export const getIsCommentsInitialized = (state: RootState): boolean => {
  return state.entities?.isCommentsInitialized ?? false;
};

export const getStatusForEntityId =
  (entityId: string): ((state: RootState) => EntityStatus) =>
  (state: RootState) => {
    const entity =
      (state?.entities?.entities && state?.entities?.entities[entityId]) ??
      null;
    if (entity) {
      return entity.entityStatus ?? null;
    }
    return null;
  };

export const getIsEntityStatusInitialized = (state: RootState): boolean => {
  return state.entities?.isStatusInitialized ?? false;
};

export const isEntityStatusPending = (state: RootState): boolean =>
  state?.entities.status === ResponseStatus.PENDING;
export const isEntityStatusSuccess = (state: RootState): boolean =>
  state?.entities.status === ResponseStatus.SUCCESS;
export const isEntityStatusFailed = (state: RootState): boolean =>
  state?.entities.status === ResponseStatus.FAILED;

export const getHistoryByEntityId =
  (entityId: string): ((state: RootState) => HistoricalRanking[]) =>
  (state: RootState) => {
    const entity =
      (state?.entities?.entities && state?.entities?.entities[entityId]) ??
      null;
    if (entity) {
      return entity.historyByEntityId[entityId] ?? [];
    }
    return [];
  };

export const formatHistoryByEntityid =
  (
    entityId: string
  ): ((state: RootState) => { [dateString: string]: Attributes }) =>
  (state: RootState) => {
    if (!entityId) {
      return {};
    }
    const entity =
      (state?.entities?.entities && state?.entities?.entities[entityId]) ??
      null;
    if (entity) {
      const historicalRankingByDate: {
        [dateString: string]: HistoricalRanking;
      } = entity.entityHistoricalRanking;
      if (historicalRankingByDate) {
        const historyFormatted: { [dateString: string]: Attributes } = {};
        Object.entries(historicalRankingByDate).forEach(
          ([dateString, value]) => {
            if (!(dateString in historyFormatted)) {
              historyFormatted[dateString] = [];
            }
            const scoringObject = value.ranking;
            if (scoringObject) {
              const categories = scoringObject.attributes;
              categories.forEach((category) => {
                const riskIndicators = category.attributes;
                if (riskIndicators) {
                  historyFormatted[dateString] = [
                    ...historyFormatted[dateString],
                    ...riskIndicators,
                  ];
                }
              });
            }
          }
        );
        return historyFormatted;
      }
      return {};
    }
    return {};
  };

export const timeLineViewForEntityId =
  (entityId: string): ((state: RootState) => ProfileTimeLineType[]) =>
  (state: RootState) => {
    const entity =
      (state?.entities?.entities && state?.entities?.entities[entityId]) ??
      null;
    if (entity) {
      const historicalRankingByDate: {
        [dateString: string]: HistoricalRanking;
      } = entity.entityHistoricalRanking;
      const returnValues: ProfileTimeLineType[] = [];
      if (historicalRankingByDate) {
        Object.entries(historicalRankingByDate).map(
          ([dateString, historicalRanking], mappingIndex) => {
            const categories = historicalRanking.ranking?.attributes ?? [];
            const categoryScores = categories.map((category) => category.score);
            const categorySum = categoryScores.reduce(
              (total, val) => total + val,
              0
            );
            const averageScore = categorySum / categories.length;
            let riskIndicatorIndex = 0;
            const items: ProfileTimeLineRiskType[] = [];
            categories.forEach((category) => {
              const riskIndicatorsForCategory = category.attributes ?? [];
              if (riskIndicatorsForCategory) {
                riskIndicatorsForCategory.forEach((riskIndicator) => {
                  const timelineItem: ProfileTimeLineRiskType = {
                    id: riskIndicatorIndex,
                    trend: riskIndicator.score,
                    label: riskIndicator.name,
                    up: 0,
                    colorIndex: 0,
                  };
                  riskIndicatorIndex += 1;
                  items.push(timelineItem);
                });
              }
            });
            const returnValue: ProfileTimeLineType = {
              id: mappingIndex,
              score: averageScore,
              date: dateString,
              items,
            };
            returnValues.push(returnValue);
          }
        );
      }
      return returnValues;
    }
    return [];
  };

export const getHistoricalDataForEntityId =
  (entityId: string): ((state: RootState) => HistoricalDataForEntityId) =>
  (state: RootState) => {
    const entity =
      (state?.entities?.entities && state?.entities?.entities[entityId]) ??
      null;
    if (entity) {
      const historicalRankingByDate: {
        [dateString: string]: HistoricalRanking;
      } = entity.entityHistoricalRanking;
      const historicalData: HistoricalDataForEntityId = {};
      if (historicalRankingByDate) {
        Object.entries(historicalRankingByDate).forEach(
          ([dateString, historicalRanking]) => {
            const historicalRankingCategories =
              historicalRanking.ranking?.attributes ?? [];
            const categories: HistoricalDataCategoryScore[] = [];
            historicalRankingCategories.forEach((category) => {
              const riskIndicatorsForCategory = category.attributes ?? [];
              const riskIndicators: HistoricalDataRiskIndicatorScore[] = [];
              if (riskIndicatorsForCategory) {
                riskIndicatorsForCategory.forEach((riskIndicator) => {
                  const historicalRiskIndicator: HistoricalDataRiskIndicatorScore =
                    {
                      name: riskIndicator.name,
                      score: riskIndicator.score,
                    };
                  riskIndicators.push(historicalRiskIndicator);
                });
              }
              categories.push({
                name: category.name,
                score: category.score,
                riskIndicators,
              });
            });
            historicalData[dateString] = categories;
          }
        );
      }
      return historicalData;
    }
    return {};
  };

export const getOutlierTableData =
  (
    entityId: string,
    categoryIndex: number,
    riskIndicatorIndex: number
  ): ((state: RootState) => {
    frameStart: number;
    weekEpochs: number[];
    values: ScatterDataPoint[];
  }) =>
  (
    state
  ): {
    frameStart: number;
    weekEpochs: number[];
    values: ScatterDataPoint[];
  } => {
    const entity =
      (state?.entities?.entities && state?.entities?.entities[entityId]) ??
      null;
    if (entity) {
      const { scoringResult } = entity;
      if (scoringResult) {
        const { attributes: categories } = scoringResult;
        if (
          categories &&
          categoryIndex >= 0 &&
          categoryIndex < categories.length
        ) {
          const category = categories[categoryIndex];
          const { attributes: riskIndicators } = category;
          if (
            riskIndicators &&
            riskIndicatorIndex >= 0 &&
            riskIndicatorIndex < riskIndicators.length
          ) {
            const riskIndicator: Attribute = riskIndicators[riskIndicatorIndex];
            if (riskIndicator) {
              const { scoringDetailsJson } = riskIndicator;
              if (scoringDetailsJson) {
                const returnValue: ScatterDataPoint[] = [];
                const weekEpochs: number[] = [];
                const { frames, startingEpoch } = scoringDetailsJson;
                const frameMilliseconds = WEEK_AS_MILLISECONDS_FROM_EPOCH;
                const hourMilliseconds = HOUR_AS_MILLISECONDS_FROM_EPOCH;
                frames.forEach((frame: number[], frameIndex: number) => {
                  const frameStartEpoch =
                    startingEpoch + frameIndex * frameMilliseconds;
                  weekEpochs.push(frameStartEpoch);
                  frame.forEach((point: number, pointIndex: number) => {
                    const pointEpoch = pointIndex * hourMilliseconds;
                    if (point > 0) {
                      returnValue.push({ x: pointEpoch, y: frameStartEpoch });
                    }
                  });
                });
                return {
                  frameStart: startingEpoch,
                  weekEpochs,
                  values: returnValue,
                };
              }
            }
          }
        }
      }
    }
    return { frameStart: 0, weekEpochs: [], values: [] };
  };

export const getOutlierChartData =
  (
    entityId: string,
    categoryIndex: number,
    riskIndicatorIndex: number
  ): ((
    state: RootState
  ) => ChartData<
    'scatter',
    (number | ScatterDataPoint | BubbleDataPoint | null)[]
  >) =>
  (state) => {
    const { weekEpochs, values } = getOutlierTableData(
      entityId,
      categoryIndex,
      riskIndicatorIndex
    )(state);
    return {
      labels: weekEpochs,
      datasets: [
        {
          label: 'Outlier by Time',
          data: values,
          fill: false,
          backgroundColor: outlierColor,
        },
      ],
    };
  };

export const getFrameStart =
  (
    entityId: string,
    categoryIndex: number,
    riskIndicatorIndex: number
  ): ((state: RootState) => number) =>
  (state) => {
    const { frameStart } = getOutlierTableData(
      entityId,
      categoryIndex,
      riskIndicatorIndex
    )(state);
    return frameStart;
  };

export default entitiesSlice.reducer;
