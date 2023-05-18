/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { Entity, PropertyType, ScoringDetailsJson } from '@/types/entity.type';

export type BasisPropertyType = PropertyType;

export type Attribute = {
  name: string;
  type: string;
  weight: number;
  score: number;
  scoringDetailsJsonString?: string;
  scoringDetailsJson?: ScoringDetailsJson;
  attributes?: Attributes;
};

export type Attributes = Attribute[];

export type ScoringResult = {
  attributes: Attributes;
};

export type ScoreRankingResponse = {
  beginCursor: string;
  endCursor: string;
  records: ScoringRankingResult[];
};

export type ScoringRankingResult = {
  entity: string;
  ranking: string;
};

export type ScoringDataResult = {
  ranking: ScoreRankingResponse;
  entities: Entity[];
};

export type ScoreBasisResult = {
  basis: BasisPropertyType;
};

export type Scoring = {
  entity: Entity;
  ranking: ScoringRankingResult;
};

export type ScoringCount = {
  modelId: string;
  scoringCount: number;
};

export type BasisCount = {
  modelId: string;
  basisCount: number;
};

export type ScoreBasisResponse = {
  beginCursor: string;
  endCursor: string;
  records: ScoreBasisResult[];
};

export type EntityRanking = {
  entityId: string;
  modelId: string;
  name: string;
  rank: number;
  score: number;
  scoringResult: ScoringResult;
};

export type HistoricalRankingBackend = {
  entity: string;
  scoringInstance: number;
  ranking: string;
};

export type HistoricalRanking = {
  entity?: string | null;
  scoringInstance?: number | null;
  ranking?: ScoringResult | null;
  next?: HistoricalRanking | null;
  prev?: HistoricalRanking | null;
};

export type HistoricalRankingDisplay = {
  [dateString: string]: HistoricalRanking[];
};

export type HistoricalRankingResult = {
  entityId: string;
  modelId: string;
  historicalRanking: HistoricalRankingBackend[];
};

export type BarChartDataSet = {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor: string;
};

export type BarChartDataSets = BarChartDataSet[];

export type RetrieveScoringParams = {
  accessToken: string;
  requestType?: string;
  modelId: string;
  modelInstance: number;
  cursor: string;
  pageNumber: number;
  limit: number;
  categories?: string[];
};

export type RetrieveScoringCountParams = {
  accessToken: string;
  requestType?: string;
  modelId: string;
  modelInstance: number;
  cursor: string;
  pageNumber: number;
  limit: number;
  categories?: string[];
};

export type RetrieveScoresForEntityParams = {
  accessToken: string;
  modelId: string;
  modelInstance: number;
  entityId: string;
};

export type RetrieveHistoricalScoreDataForEntityParams = {
  accessToken: string;
  modelId: string;
  entityId: string;
};

export type RetrieveBasisParams = {
  accessToken: string;
  entityId: string;
  dataSourceId: string;
  modelId: string;
  modelInstance: number;
  cursor: string;
  pageNumber: number;
  limit: number;
  unmaskToken: string;
};

export type RetrieveBasisCountParams = {
  accessToken: string;
  entityId: string;
  dataSourceId: string;
  modelId: string;
  modelInstance: number;
  cursor: string;
  pageNumber: number;
  limit: number;
  unmaskToken: string;
};

export type RetrieveBasisOutParams = {
  accessToken: string;
  entityId: string;
  dataSourceId: string;
  modelId: string;
  modelInstance: number;
  cursor: string;
  limit: number;
};

export type PaginationState = {
  beginCursor: string;
  endCursor: string;
  pageLimit: number;
  pageNumber: number;
};
