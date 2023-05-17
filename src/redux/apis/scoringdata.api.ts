/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import {
  RetrieveScoringParams,
  ScoringDataResult,
  RetrieveBasisParams,
  ScoreBasisResult,
  PaginateResult,
  ScoringRankingResult,
  Entity,
  EntityRanking,
} from '@/types';
import axios from 'axios';
import config from '@/config';
import {
  BasisCount,
  RetrieveBasisCountParams,
  RetrieveScoresForEntityParams,
  RetrieveScoringCountParams,
  ScoreBasisResponse,
  Scoring,
  ScoringCount,
} from '@/types/scoring.type';

const baseScoringUrl: string = config.URLS.SCORING || '';

const headers = {
  'Access-Control-Allow-Origin': baseScoringUrl,
  'Access-Control-Allow-Methods':
    config.ACCESS_CONTROL_ALLOWED_METHODS.SCORING.join(','),
};

export const loadScoresData = async (
  params: RetrieveScoringParams
): Promise<PaginateResult<Scoring>> => {
  const { pageNumber: pageNumber, ...outParams }: { pageNumber: number } =
    params;
  const response = await axios.post<ScoringDataResult>(
    `${baseScoringUrl}/api/scoring`,
    outParams,
    {
      headers,
    }
  );
  const { data } = response;
  const { ranking, entities } = data;
  const { records }: { records: ScoringRankingResult[] } = ranking;
  const entitiesByEntityId: { [entityId: string]: Entity } = {};
  entities.forEach((entity: Entity) => {
    const { entityId } = entity;
    entitiesByEntityId[entityId] = entity;
  });
  const scoringData = records.map((rankingResult: ScoringRankingResult) => {
    const { entity: entityId } = rankingResult;
    const entity = entitiesByEntityId[entityId];
    return {
      entity,
      ranking: rankingResult,
    };
  });

  return {
    data: scoringData,
    modelId: params.modelId,
    pageInfo: {
      beginCursor: data.ranking.beginCursor,
      endCursor: data.ranking.endCursor,
      limit: params.limit,
      pageNumber: pageNumber,
    },
  };
};

export const loadScoresCountData = async (
  params: RetrieveScoringCountParams
): Promise<ScoringCount> => {
  const response = await axios.post<ScoringCount>(
    `${baseScoringUrl}/api/scoring/count`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const loadScoresForEntityData = async (
  params: RetrieveScoresForEntityParams
): Promise<EntityRanking> => {
  const response = await axios.post<EntityRanking>(
    `${baseScoringUrl}/api/scoring/entity`,
    params,
    {
      headers,
    }
  );
  return {
    ...response.data,
    entityId: params.entityId,
    modelId: params.modelId,
  };
};

export const loadBasisData = async (
  params: RetrieveBasisParams
): Promise<PaginateResult<ScoreBasisResult>> => {
  const { pageNumber: pageNumber, ...outParams }: { pageNumber: number } =
    params;
  const response = await axios.post<ScoreBasisResponse>(
    `${baseScoringUrl}/api/scoring/basis`,
    outParams,
    {
      headers,
    }
  );
  const { data } = response;
  return {
    data: data.records,
    modelId: params.modelId,
    pageInfo: {
      beginCursor: data.beginCursor,
      endCursor: data.endCursor,
      limit: params.limit,
      pageNumber: pageNumber,
    },
  };
};

export const loadBasisCountData = async (
  params: RetrieveBasisCountParams
): Promise<BasisCount> => {
  const response = await axios.post<BasisCount>(
    `${baseScoringUrl}/api/scoring/basis/count`,
    params,
    {
      headers,
    }
  );
  return response.data;
};
