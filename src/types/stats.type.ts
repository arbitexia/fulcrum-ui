/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
export type Stats = {
  modelId: string;
  instance: number;
  numEntities: number;
  numSources: number;
  numAttributes: number;
  numRecords: number;
};

export type GetStatsParams = {
  accessToken: string;
  limit: number;
};

export type GetLatestStatParams = {
  accessToken: string;
  modelId: string;
};

export type DeleteStatParams = {
  accessToken: string;
  modelId: string;
  instance: number;
};
