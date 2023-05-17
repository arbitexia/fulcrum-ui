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
import { Scoring } from '@/types/scoring.type';
import {
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
import { checkAuthToken } from '@/libs/auth-token';

const initialState: ReduxJson.EntitiesState = {
  loading: true,
  initialized: false,
  status: null,
  entities: {},
  isCommentsInitialized: false,
  isStatusInitialized: false,
  rankingByEntityId: {},
};

export const getEntities = createAsyncThunk<
  Entity[],
  GetEntitiesParams,
  { dispatch: AppDispatch; state: RootState }
>('entity/getEntities', async (params: GetEntitiesParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await checkAuthToken();
    return await entityApi.loadEntitiesData(params);
  } catch (error) {
    const err = error as AxiosError;
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
    await checkAuthToken();
    return await entityApi.loadEntityData(params);
  } catch (error) {
    const err = error as AxiosError;
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
      await checkAuthToken();
      return await entityApi.loadEntityStatusData(params);
    } catch (error) {
      const err = error as AxiosError;
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
    await checkAuthToken();
    return await entityApi.newEntityStatus(params);
  } catch (error) {
    const err = error as AxiosError;
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
      await checkAuthToken();
      return await entityApi.loadEntityCommentsData(params);
    } catch (error) {
      const err = error as AxiosError;
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
      await checkAuthToken();
      return await entityApi.newEntityComments(params);
    } catch (error) {
      const err = error as AxiosError;
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
              newProperties[lowerCasedKey] = value;
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
      .addCase(getEntity.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        getEntity.fulfilled,
        (state, { payload }: PayloadAction<Entity>) => {
          state.loading = false;
          state.initialized = true;
          state.status = ResponseStatus.SUCCESS;
          const { entityId, properties } = payload;
          const newProperties: { [propertyId: string]: string } = {};
          Object.entries(properties).forEach(([key, value]) => {
            const lowerCasedKey = key.toLowerCase();
            newProperties[lowerCasedKey] = value;
          });
          const newEntity: Entity = { ...payload, properties: newProperties };
          state.entities = {
            [entityId]: newEntity,
          };
        }
      )
      .addCase(getEntity.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
        state.entities = {};
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
          state.initialized = true;
          state.status = ResponseStatus.SUCCESS;
          const entitiesById: { [id: string]: Entity } = {};
          payload.forEach((entity) => {
            const { entityId, properties } = entity;
            const newProperties: { [propertyId: string]: string } = {};
            Object.entries(properties).forEach(([key, value]) => {
              const lowerCasedKey = key.toLowerCase();
              newProperties[lowerCasedKey] = value;
            });
            entitiesById[entityId] = { ...entity, properties: newProperties };
          });
          state.entities = entitiesById;
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
              newProperties[lowerCasedKey] = value;
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
              const newEntity: Entity = {
                ...entity,
                properties: newProperties,
              };
              entitiesById[entityId] = newEntity;
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
          state.status = ResponseStatus.SUCCESS;
          const { entityId, entityComments } = payload;
          if (entityId) {
            const stateEntity = state.entities[entityId] ?? null;
            if (stateEntity) {
              const newEntity = { ...stateEntity, entityComments };
              state.entities = { ...state.entities, [entityId]: newEntity };
            }
          }
          state.isCommentsInitialized = true;
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
      .addCase(getEntityStatus.pending, (state) => {
        state.loading = true;
        state.isStatusInitialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        getEntityStatus.fulfilled,
        (state, { payload }: PayloadAction<EntityReturnStatus>) => {
          state.loading = false;
          state.initialized = true;
          const { entityId, entityStatus } = payload;
          if (entityId) {
            const entityIdString = entityId.toString();
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
          state.isStatusInitialized = true;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(getEntityStatus.rejected, (state) => {
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
            const entityIdString = entityId.toString();
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

export const entityPropertiesByIdSelector =
  (entityId: string): ((state: RootState) => PropertyType | undefined) =>
  (state: RootState) =>
    state.entities?.entities && state.entities?.entities[entityId].properties;

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

export const convertEntitiesPropertiesToDashBoardTable = (
  state: RootState
): PropertyType[] => {
  const entities: { [id: string]: Entity } =
    (state.entities?.entities && state?.entities?.entities) ?? null;
  if (entities) {
    return Object.entries(entities).map(
      ([entityId, entity]: [entityid: string, entity: Entity]) => ({
        ...entity.properties,
        id: entityId,
      })
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

export default entitiesSlice.reducer;
