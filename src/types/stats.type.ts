/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */

export type PeerGroupBaseStats = {
  min: number;
  max: number;
  mean: number;
  stdDev: number;
};

export type PeerGroupModelStats = PeerGroupBaseStats;

export type PeerGroupCategoryStats = PeerGroupBaseStats;

export type PeerGroupAttributeStats = PeerGroupBaseStats;

export type PeerGroupAttributeStat = {
  attributeId: string;
  attributeLevelStats: PeerGroupAttributeStats;
};

export type PeerGroupCategoryStat = {
  categoryId: string;
  categoryLevelStats: PeerGroupCategoryStats;
  peerGroupAttributeStats: PeerGroupAttributeStat[];
};

export type PeerGroupId = {
  [peerGroupDescription: string]: string;
};

export type PeerGroupStats = {
  peerGroupId: PeerGroupId;
  modelLevelStats: PeerGroupModelStats;
  peerGroupCategoryStats: PeerGroupCategoryStat[];
};

export type PeerGroupStatsBackend = {
  peerGroupIdHash: number;
} & PeerGroupStats;

export type PeerStats = {
  [peerGroupIdHash: number]: PeerGroupStats;
};

export type StatsBackend = {
  modelId: string;
  instance: number;
  numEntities: number;
  numSources: number;
  numAttributes: number;
  numRecords: number;
  peerStatsJson: string;
};

export type StatsBackendPayload = {
  statsBackend: StatsBackend[];
  modelId: string;
};

export type PeerGroupModelStatsBackend = {
  peerGroupModelStats: PeerGroupStatsBackend[];
};

export type Stats = {
  modelId: string;
  instance: number;
  numEntities: number;
  numSources: number;
  numAttributes: number;
  numRecords: number;
  peerStats: PeerStats;
};

export type GetStatsParams = {
  accessToken: string;
  limit: number;
};

export type GetLatestStatParams = {
  accessToken: string;
  modelId: string;
  limit: number;
};

export type DeleteStatParams = {
  accessToken: string;
  modelId: string;
  instance: number;
};

export type DatasourceStatsParam = {
  accessToken: string;
  sourceId: string;
};

export type GetYearStatsByStatusParam = {
  accessToken: string;
  entityStatus: string;
};

export type TopRiskIndicatorPercentage = {
  attribute: string;
  percentage: number;
};

export type TopRiskIndicatorPercentageResponse = {
  modelId: string;
  riskIndicatorPercentages: TopRiskIndicatorPercentage[];
};

export type TopRiskIndicatorPercentageParam = {
  accessToken: string;
  modelId: string;
  instance: number;
  limit: number;
};

export type TriageAndAverageScoreResponse = {
  modelId: string;
  countTriaged: number;
  topCount: number;
  avgScore: number;
};

export type TriageAndAverageScore = {
  countTriaged: number;
  topCount: number;
  avgScore: number;
};

export type TriageAndAverageScoreParam = {
  accessToken: string;
  modelId: string;
  modelInstance: number;
  fraction: number;
  cursor: string;
  limit: number;
};

export type UniqueValueCount = {
  [value: string]: number;
};

export type UniqueValueCountDisplay = {
  value: string;
  occurrence: number;
};

export type SummaryStat = {
  fieldName: string;
  isNumeric: boolean;
  count: number;
  uniqueValueCounts: UniqueValueCount;
  countUnique: number;
  uniquenessLimitExceeded: string;
  min: number;
  max: number;
  mean: number;
  median: number;
  stdDev: number;
  skewness: number;
  kurtosis: number;
};

export type DataSourceStatsJson = {
  dataStatsJson: string;
};

export type FilterSummaryStat = {
  filterId: string;
  featureSummaryStats: SummaryStat[];
};

export type DataSourceStats = {
  source: string;
  filterSummaryStats: FilterSummaryStat[];
};

export type YearStatsByStatus = {
  entityStatus: string;
  count: number;
};

export type YearStatsByStatusResponse = {
  count: number;
};

export type DataSourceStatByFieldName = {
  [fieldName: string]: SummaryStat;
};

export type DataSourceStatByPopulationName = {
  [populationName: string]: DataSourceStatByFieldName;
};
