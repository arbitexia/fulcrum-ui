/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Dan Finkel
 */
import { HistoricalRanking, ScoringResult } from '@/types/scoring.type';

export type PropertyType = {
  [propertyid: string]: string | null | number | boolean;
};

export type Frame = number[];

export type ScoringDetailsOutlierConfig = {
  threshold: number;
  minimumEventCountThreshold: number;
  occurrenceBased: boolean;
  fillInUnits: number;
  unitMilliseconds: number;
  unitsInFrame: number;
  unitsInSubframe: number;
  unitWeightingOffset: number;
  unitWeightingLength: number;
  frameWeightedUnits: number[];
  unitWeighting: number;
  frameWeighting: number;
  scoringType: string;
};

export type ScoringDetailsJson = {
  frames: Frame[];
  outlierPeriods: number[];
  maxOutlierPeriod: number;
  startingEpoch: number;
  populationMean: number;
  populationStdDev: number;
  outlierConfig: ScoringDetailsOutlierConfig;
};

export type Entity = {
  entityId: string;
  properties: PropertyType;
  entityComments?: EntityComment[];
  entityStatus: EntityStatus;
  scoringResult: ScoringResult;
  entityHistoricalRanking?: { [dateString: string]: HistoricalRanking };
  unmaskToken: string;
};

export type EntityStatus = string;

export type EntityReturn = {
  entityId: string;
  entityComments?: EntityComment[];
};

export type EntityReturnStatus = {
  entityId: string;
  entityStatus: EntityStatus;
};

export type EntityComment = {
  comment: string;
  author: string;
  timestamp: number;
};

export type GetEntityParams = {
  accessToken: string;
  entityId: string;
  unmaskToken: string;
};

export type GetEntitiesParams = {
  accessToken: string;
};

export type GetPropertiesParams = {
  accessToken: string;
};

export type QueryEntityParams = {
  accessToken: string;
  entityQuery: string;
};

export type QueryEntityStatusParams = {
  accessToken: string;
  entityId: string;
};

export type NewEntityStatusParams = {
  accessToken: string;
  entityId: string;
  entityStatus: string;
  author: string;
  timeStamp: number;
};

export type QueryEntityCommentsParams = {
  accessToken: string;
  entityId: string;
};

export type NewEntityCommentsParams = {
  accessToken: string;
  entityId: string;
  entityComment: string;
  author: string;
};
