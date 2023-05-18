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
  GetPeerAttributeRankingParams,
} from '@/types';
import axios from 'axios';
import config from '@/config';
import {
  BasisCount,
  HistoricalRankingBackend,
  HistoricalRankingResult,
  RetrieveBasisCountParams,
  RetrieveHistoricalScoreDataForEntityParams,
  RetrieveScoresForEntityParams,
  RetrieveScoringCountParams,
  ScoreBasisResponse,
  Scoring,
  ScoringCount,
} from '@/types/scoring.type';
import { keyComparator, stableSort } from '@/libs/sort-utils';
import {
  GetPeerGroupHistoricalRankingParams,
  GetPeerGroupRankingParams,
  GetPeerGroupRankingResponse,
  HistoricalPeerGroupType,
  PeerAttributeData,
} from '@/types/graph.type';

const baseScoringUrl: string = config.URLS.SCORING || '';

const headers = {
  'Access-Control-Allow-Origin': baseScoringUrl,
  'Access-Control-Allow-Methods':
    config.ACCESS_CONTROL_ALLOWED_METHODS.SCORING.join(','),
};

export const loadScoresData = async (
  params: RetrieveScoringParams
): Promise<PaginateResult<Scoring>> => {
  const {
    pageNumber: pageNumber,
    categories,
    requestType,
    ...rest
  }: {
    pageNumber: number;
    categories?: string[];
    requestType?: string;
  } = params;
  if (categories) {
    throw new Error('Cannot include categories');
  }
  if (!requestType) {
    throw new Error('Must include requestType');
  }
  const outParams = { ...rest, requestType };
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
  const {
    categories,
    requestType,
    ...rest
  }: { pageNumber: number; categories?: string[]; requestType?: string } =
    params;
  if (categories) {
    throw new Error('Cannot include categories');
  }
  if (!requestType) {
    throw new Error('Must include requestType');
  }
  const outParams = { ...rest, requestType };
  const response = await axios.post<ScoringCount>(
    `${baseScoringUrl}/api/scoring/count`,
    outParams,
    {
      headers,
    }
  );
  return response.data;
};

export const loadScoresDataForCategories = async (
  params: RetrieveScoringParams
): Promise<PaginateResult<Scoring>> => {
  const {
    pageNumber: pageNumber,
    categories,
    requestType,
    ...rest
  }: {
    pageNumber: number;
    categories?: string[];
    requestType?: string;
  } = params;
  if (!categories || categories.length === 0) {
    throw new Error('Must include categories');
  }
  if (requestType) {
    throw new Error('Cannot include requestType');
  }
  const outParams = { ...rest, categories: categories.join(',') };
  const response = await axios.post<ScoringDataResult>(
    `${baseScoringUrl}/api/scoring/categories`,
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
      beginCursor: ((pageNumber - 1) * params.limit).toString(),
      endCursor: (pageNumber * params.limit).toString(),
      limit: params.limit,
      pageNumber: pageNumber,
    },
  };
};

export const loadScoresCategoriesCountData = async (
  params: RetrieveScoringCountParams
): Promise<ScoringCount> => {
  const {
    categories,
    requestType,
    ...rest
  }: { categories?: string[]; requestType?: string } = params;
  if (!categories || categories.length === 0) {
    throw new Error('Must include categories');
  }
  if (requestType) {
    throw new Error('Cannot include requestType');
  }
  const outParams = { ...rest, categories: categories.join(',') };
  const response = await axios.post<ScoringCount>(
    `${baseScoringUrl}/api/scoring/categories/count`,
    outParams,
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

export const loadHistoricalDataForEntity = async (
  params: RetrieveHistoricalScoreDataForEntityParams
): Promise<HistoricalRankingResult> => {
  const response = await axios.post<HistoricalRankingBackend[]>(
    `${baseScoringUrl}/api/scoring/entity/historical`,
    params,
    {
      headers,
    }
  );
  const historicalRankingStart = response.data;
  const historicalRankingSorted = stableSort<HistoricalRankingBackend>(
    historicalRankingStart,
    keyComparator<HistoricalRankingBackend>(
      historicalRankingStart,
      'scoringInstance'
    )
  );

  return {
    entityId: params.entityId,
    modelId: params.modelId,
    historicalRanking: historicalRankingSorted.map((el) => el[0]),
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

export const loadPeerGroupHashRankingData = async (
  params: GetPeerGroupRankingParams
): Promise<GetPeerGroupRankingResponse> => {
  const response = await axios.post<number>(
    `${baseScoringUrl}/api/scoring/peer/group`,
    params,
    {
      headers,
    }
  );
  return { modelId: params.modelId, peerGroupHash: response.data };
};

export const loadPeerGroupHistoricalData = async (
  params: GetPeerGroupHistoricalRankingParams
): Promise<HistoricalPeerGroupType[]> => {
  const response = await axios.post<HistoricalPeerGroupType[]>(
    `${baseScoringUrl}/api/scoring/peer/attribute/historical`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const loadPeerAttributeRankingData = async (
  params: GetPeerAttributeRankingParams
): Promise<PeerAttributeData> => {
  const response = await axios.post<PeerAttributeData>(
    `${baseScoringUrl}/api/scoring/peer/attribute`,
    params,
    {
      headers,
    }
  );
  return response.data;
};
