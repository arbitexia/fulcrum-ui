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
  Attribute,
  BarChartDataSet,
  PeerDataType,
  ReduxJson,
  ResponseStatus,
  ScoringResult,
  StateCardItemType,
} from '@/types';
import { statsApi } from '@/redux/apis';
import { AxiosError } from 'axios';
import {
  DataSourceStatByFieldName,
  DataSourceStatByPopulationName,
  DataSourceStats,
  DatasourceStatsParam,
  DeleteStatParams,
  FilterSummaryStat,
  GetLatestStatParams,
  GetYearStatsByStatusParam,
  PeerGroupBaseStats,
  PeerGroupModelStatsBackend,
  PeerGroupStats,
  PeerStats,
  TopRiskIndicatorPercentageParam,
  Stats,
  StatsBackend,
  StatsBackendPayload,
  SummaryStat,
  YearStatsByStatus,
  TriageAndAverageScoreParam,
  TopRiskIndicatorPercentageResponse,
  TriageAndAverageScoreResponse,
  TopRiskIndicatorPercentage,
  TriageAndAverageScore,
} from '@/types/stats.type';
import { formatNumber, shortenFormat } from '@/libs/string-utils';
import { BubbleDataPoint, ChartData, ScatterDataPoint } from 'chart.js';
import { getColorPair } from '@/libs/color-generator';
import { roundScoreIntelligently, roundToSignificant } from '@/libs/math-utils';
import { formatDate } from '@/libs/time-utils';
import { keyComparator, stableSort } from '@/libs/sort-utils';
import { genRefreshToken } from '@/libs/auth-token';

const keysToObjects: { [id: string]: StateCardItemType } = {
  numEntities: {
    title: 'Total Persons',
    amount: '0',
    info: '1',
    icon: '/images/icons/up.svg',
    index: 0,
    formatter: formatNumber,
  },
  numSources: {
    title: 'Data Sources',
    amount: '0',
    info: '1',
    icon: '/images/icons/up.svg',
    index: 1,
    formatter: formatNumber,
  },
  numAttributes: {
    title: '# Risk Indicators',
    amount: '0',
    info: '1',
    icon: '/images/icons/up.svg',
    index: 2,
    formatter: formatNumber,
  },
  numRecords: {
    title: 'Records Analyzed',
    amount: '0',
    info: '1',
    icon: '/images/icons/up.svg',
    index: 3,
    formatter: shortenFormat,
  },
};

const keysToObjectsGlobalStats: { [id: string]: StateCardItemType } = {
  numberOfLeads: {
    title: 'Leads Reviewed (past year)',
    amount: '0',
    info: 'in the last year',
    index: 0,
    formatter: (value: number) => value.toString(),
  },
  numberOfCases: {
    title: 'Cases Opened (past year)',
    amount: '0',
    info: 'in the last year',
    index: 1,
    formatter: (value: number) => value.toString(),
  },
};

const statusesToAccessors: { [status: string]: keyof ReduxJson.StatsState } = {
  Reviewed: 'numberOfLeads',
  'Case Opened': 'numberOfCases',
};

const statusesToInitializeBooleans: {
  [status: string]: keyof ReduxJson.StatsState;
} = {
  Reviewed: 'numberOfLeadsInitialized',
  'Case Opened': 'numberOfCasesInitialized',
};

const initialState: ReduxJson.StatsState = {
  loading: true,
  initialized: false,
  status: null,
  latestStatsByModelId: {},
  maxInstanceNumber: -1,
  statsByDataSourceId: {},
  topAttributesByModelIdInitialized: {},
  topAttributesByModelId: {},
  countTriageByModelIdInitialized: {},
  countTriagedByModelId: {},
  selectedStats: null,
  numberOfLeads: null,
  numberOfLeadsInitialized: false,
  numberOfCases: null,
  numberOfCasesInitialized: false,
};

export const getLatestStat = createAsyncThunk<
  StatsBackendPayload,
  GetLatestStatParams,
  { dispatch: AppDispatch; state: RootState }
>('stats/getLatestStat', async (params: GetLatestStatParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    return await statsApi.loadLatestStatData(params);
  } catch (error) {
    const err = error as AxiosError;
    await genRefreshToken(err);
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const deleteStats = createAsyncThunk<
  string,
  DeleteStatParams,
  { dispatch: AppDispatch; state: RootState }
>('stats/deleteStats', async (params: DeleteStatParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    return await statsApi.deleteStatData(params);
  } catch (error) {
    const err = error as AxiosError;
    await genRefreshToken(err);
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const getDataSourceStats = createAsyncThunk<
  DataSourceStats,
  DatasourceStatsParam,
  { dispatch: AppDispatch; state: RootState }
>(
  'stats/getDataSourceStats',
  async (params: DatasourceStatsParam, thunkAPI) => {
    try {
      return await statsApi.loadDataSourceStats(params);
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const getYearStatuses = createAsyncThunk<
  YearStatsByStatus,
  GetYearStatsByStatusParam,
  { dispatch: AppDispatch; state: RootState }
>(
  'stats/getYearStatuses',
  async (params: GetYearStatsByStatusParam, thunkAPI) => {
    try {
      return await statsApi.loadYearStatsByStatus(params);
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const getTopRiskIndicators = createAsyncThunk<
  TopRiskIndicatorPercentageResponse,
  TopRiskIndicatorPercentageParam,
  { dispatch: AppDispatch; state: RootState }
>(
  'stats/getTopRiskIndicators',
  async (params: TopRiskIndicatorPercentageParam, thunkAPI) => {
    try {
      return await statsApi.loadTopRiskIndicatorsPercentage(params);
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const getTriageAndAverageScores = createAsyncThunk<
  TriageAndAverageScoreResponse,
  TriageAndAverageScoreParam,
  { dispatch: AppDispatch; state: RootState }
>(
  'stats/getTriageAndAverageScores',
  async (params: TriageAndAverageScoreParam, thunkAPI) => {
    try {
      return await statsApi.loadTriageAndAverageScores(params);
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

const statsSlice = createSlice({
  name: `stats`,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLatestStat.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        getLatestStat.fulfilled,
        (state, { payload }: PayloadAction<StatsBackendPayload>) => {
          state.loading = false;
          const { modelId, statsBackend } = payload;
          const statsByInstanceNumber: Stats[] = [];
          statsBackend.forEach((stat: StatsBackend) => {
            const {
              numAttributes,
              numRecords,
              numSources,
              numEntities,
              instance,
              peerStatsJson,
            } = stat;
            const peerStats: PeerStats = {};
            if (peerStatsJson) {
              const peerStatsIncoming: PeerGroupModelStatsBackend =
                JSON.parse(peerStatsJson);
              if (peerStatsIncoming) {
                const { peerGroupModelStats } = peerStatsIncoming;
                if (peerGroupModelStats) {
                  peerGroupModelStats.forEach((peerGroupStatIncoming) => {
                    const { peerGroupIdHash } = peerGroupStatIncoming;
                    peerStats[peerGroupIdHash] = peerGroupStatIncoming;
                  });
                }
              }
            }
            const newStats: Stats = {
              modelId,
              numAttributes,
              numRecords,
              numSources,
              numEntities,
              instance,
              peerStats,
            };
            statsByInstanceNumber.push(newStats);
          });
          statsByInstanceNumber.sort((statA, statB) => {
            const { instance: statAInstance } = statA;
            const { instance: statBInstance } = statB;
            if (statAInstance > statBInstance) {
              return -1;
            }
            if (statAInstance < statBInstance) {
              return 1;
            }
            return 0;
          });
          if (statsByInstanceNumber && statsByInstanceNumber.length > 0) {
            const maxInstance = statsByInstanceNumber[0].instance;
            state.maxInstanceNumber = maxInstance;
          } else {
            state.maxInstanceNumber = -1;
          }
          state.latestStatsByModelId = { [modelId]: statsByInstanceNumber };
          state.selectedStats = statsByInstanceNumber[0];
          state.initialized = true;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(getLatestStat.rejected, (state) => {
        state.loading = false;
        state.latestStatsByModelId = {};
        state.selectedStats = null;
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(getTopRiskIndicators.pending, (state, { meta }) => {
        state.loading = true;
        const { arg: params } = meta;
        const { modelId } = params;
        state.topAttributesByModelIdInitialized = {
          ...state.topAttributesByModelIdInitialized,
          [modelId]: false,
        };
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        getTopRiskIndicators.fulfilled,
        (
          state,
          { payload }: PayloadAction<TopRiskIndicatorPercentageResponse>
        ) => {
          const { modelId, riskIndicatorPercentages } = payload;
          state.topAttributesByModelId = {
            ...state.topAttributesByModelId,
            [modelId]: riskIndicatorPercentages,
          };
          state.topAttributesByModelIdInitialized = {
            ...state.topAttributesByModelIdInitialized,
            [modelId]: true,
          };
          state.loading = false;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(getTopRiskIndicators.rejected, (state, { meta }) => {
        const { arg: params } = meta;
        const { modelId } = params;
        state.topAttributesByModelIdInitialized = {
          ...state.topAttributesByModelIdInitialized,
          [modelId]: true,
        };
        state.loading = false;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(getTriageAndAverageScores.pending, (state, { meta }) => {
        state.loading = true;
        const { arg: params } = meta;
        const { modelId } = params;
        state.countTriageByModelIdInitialized = {
          ...state.countTriageByModelIdInitialized,
          [modelId]: false,
        };
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        getTriageAndAverageScores.fulfilled,
        (state, { payload }: PayloadAction<TriageAndAverageScoreResponse>) => {
          const {
            modelId,
            countTriaged: backendCountTriaged,
            topCount: backendTopCount,
            avgScore: backendAvgScore,
          } = payload;
          const countTriaged = roundToSignificant(backendCountTriaged, 0);
          const topCount = roundToSignificant(backendTopCount, 0);
          state.countTriagedByModelId = {
            ...state.countTriagedByModelId,
            [modelId]: {
              countTriaged,
              topCount,
              avgScore: backendAvgScore,
            },
          };
          state.countTriageByModelIdInitialized = {
            ...state.countTriageByModelIdInitialized,
            [modelId]: true,
          };
          state.loading = false;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(getTriageAndAverageScores.rejected, (state, { meta }) => {
        const { arg: params } = meta;
        const { modelId } = params;
        state.countTriageByModelIdInitialized = {
          ...state.countTriageByModelIdInitialized,
          [modelId]: true,
        };
        state.loading = false;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(deleteStats.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        deleteStats.fulfilled,
        (state, { payload }: PayloadAction<string>) => {
          state.loading = false;
          const modelId = payload as string;
          const { [modelId]: _deletedStat, ...newStatsByModelId } =
            state.latestStatsByModelId;
          state.latestStatsByModelId = newStatsByModelId;
          state.selectedStats = null;
          state.initialized = true;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(deleteStats.rejected, (state) => {
        state.loading = false;
        state.latestStatsByModelId = {};
        state.selectedStats = null;
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(getDataSourceStats.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        getDataSourceStats.fulfilled,
        (state, { payload }: PayloadAction<DataSourceStats>) => {
          state.loading = false;
          const sourceId = payload.source;
          const summaryStats = payload.filterSummaryStats;
          const newStatsByFilterName: {
            [filterName: string]: { [fieldName: string]: SummaryStat };
          } = {};
          summaryStats.forEach((summaryStat: FilterSummaryStat) => {
            const filterId: string = summaryStat.filterId;
            const features = summaryStat.featureSummaryStats;
            const newStatsByFieldName: { [fieldName: string]: SummaryStat } =
              {};
            features.forEach((feature: SummaryStat) => {
              const fieldName = feature.fieldName;
              newStatsByFieldName[fieldName] = feature;
            });
            newStatsByFilterName[filterId] = newStatsByFieldName;
          });
          state.statsByDataSourceId = {
            ...state.statsByDataSourceId,
            [sourceId]: newStatsByFilterName,
          };
          state.initialized = true;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(getDataSourceStats.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(getYearStatuses.pending, (state, action) => {
        const { meta } = action;
        const { arg: params } = meta;
        const { entityStatus } = params;
        const accessor: keyof ReduxJson.StatsState =
          statusesToInitializeBooleans[
            entityStatus
          ] as keyof ReduxJson.StatsState;
        if (accessor in state) {
          return {
            ...state,
            [accessor]: false,
            loading: true,
            initialized: false,
            status: ResponseStatus.PENDING,
          };
        }
        return state;
      })
      .addCase(getYearStatuses.fulfilled, (state, action) => {
        const { meta, payload } = action;
        const { arg: params } = meta;
        const { entityStatus } = params;
        const { count } = payload;
        const accessor: keyof ReduxJson.StatsState = statusesToAccessors[
          entityStatus
        ] as keyof ReduxJson.StatsState;
        const initializedAccessor: keyof ReduxJson.StatsState =
          statusesToInitializeBooleans[
            entityStatus
          ] as keyof ReduxJson.StatsState;
        if (accessor in state) {
          return {
            ...state,
            [accessor]: count,
            [initializedAccessor]: true,
            loading: true,
            initialized: false,
            status: ResponseStatus.SUCCESS,
          };
        }
        return state;
      })
      .addCase(getYearStatuses.rejected, (state, action) => {
        const { meta } = action;
        const { arg: params } = meta;
        const { entityStatus } = params;
        const accessor: keyof ReduxJson.StatsState =
          statusesToInitializeBooleans[
            entityStatus
          ] as keyof ReduxJson.StatsState;
        if (accessor in state) {
          return {
            ...state,
            [accessor]: true,
            loading: true,
            initialized: false,
            status: ResponseStatus.FAILED,
          };
        }
        return state;
      });
  },
});

export const getStatsSelector: (state: RootState) => Stats[] = (
  state: RootState
) => {
  const stats = state?.stats?.latestStatsByModelId ?? {};
  return Object.values(stats);
};

export const getStatsByModelIdSelector = (
  state: RootState
): { [modelId: string]: Stats } => state.stats?.latestStatsByModelId ?? null;

export const getMaxInstanceNumber = (state: RootState): number =>
  state?.stats?.maxInstanceNumber ?? -1;

export const statByModelIdSelector =
  (modelId: string): ((state: RootState) => Stats | undefined) =>
  (state: RootState) =>
    state.stats?.latestStatsByModelId &&
    state?.stats?.maxInstanceNumber > 0 &&
    state.stats?.latestStatsByModelId[modelId] &&
    state.stats?.latestStatsByModelId[modelId][0];

export const statsToStatusCards =
  (modelId: string): ((state: RootState) => StateCardItemType[]) =>
  (state: RootState) => {
    if (modelId) {
      const stats: Stats[] =
        (state?.stats?.latestStatsByModelId &&
          state?.stats?.latestStatsByModelId[modelId]) ??
        null;
      if (stats && stats.length > 0) {
        const topStat: Stats = stats[0];
        const unfilteredValue: (StateCardItemType | null)[] = Object.entries(
          topStat
        ).map(([key, value]) => {
          if (key in keysToObjects) {
            const initialValue = keysToObjects[key];
            const { formatter } = initialValue;
            const valueString: string = formatter(value as number);
            return {
              ...initialValue,
              amount: valueString,
            };
          } else {
            return null;
          }
        });
        const returnValue: StateCardItemType[] = [];
        unfilteredValue.forEach((value: StateCardItemType | null) => {
          if (value != null) {
            returnValue.push(value);
          }
        });
        const sortedReturnValue = stableSort<StateCardItemType>(
          returnValue,
          keyComparator(returnValue, 'index')
        ).map(([row, _]) => row);
        return sortedReturnValue;
      }
    }
    return [];
  };

export const getSelectedStats = (state: RootState): Stats | null => {
  return state.stats.selectedStats;
};

export const getStatsInitialized = (state: RootState): boolean =>
  state.stats.initialized ?? false;

export const isStatsStatusPending = (state: RootState): boolean =>
  state?.stats.status === ResponseStatus.PENDING;
export const isStatsStatusSuccess = (state: RootState): boolean =>
  state?.stats.status === ResponseStatus.SUCCESS;
export const isStatsStatusFailed = (state: RootState): boolean =>
  state?.stats.status === ResponseStatus.FAILED;

export const getTopRiskIndicatorsInitializedByModelId: (
  modelId: string
) => (state: RootState) => boolean = (modelId: string) => (state: RootState) =>
  state?.stats?.topAttributesByModelIdInitialized[modelId] ?? false;

export const getTriageAndAverageScoresInitializedByModelId: (
  modelId: string
) => (state: RootState) => boolean = (modelId: string) => (state: RootState) =>
  state?.stats?.countTriageByModelIdInitialized[modelId] ?? false;

export const getAllStatsByDataSource = (
  state: RootState
): { [dataSourceId: string]: DataSourceStats } =>
  state?.stats.statsByDataSourceId ?? {};

export const getStatsByDataSourceId =
  (
    dataSourceId: string
  ): ((state: RootState) => DataSourceStatByPopulationName) =>
  (state: RootState) => {
    if (dataSourceId) {
      return state.stats?.statsByDataSourceId[dataSourceId] ?? {};
    }
    return {};
  };

export const getFiltersByDataSourceId =
  (
    dataSourceId: string
  ): ((state: RootState) => { id: string; name: string }[]) =>
  (state: RootState) => {
    if (dataSourceId) {
      const statsObject = state.stats?.statsByDataSourceId[dataSourceId] ?? {};
      return Object.keys(statsObject).map((key) => ({ id: key, name: key }));
    }
    return [];
  };

export const getStatsByDataSourceIdAndFeatureName =
  (
    dataSourceId: string,
    featureName: string
  ): ((state: RootState) => DataSourceStatByFieldName) =>
  (state: RootState) => {
    if (dataSourceId) {
      const statsByDataSource = state.stats?.statsByDataSourceId[dataSourceId];
      if (statsByDataSource) {
        return statsByDataSource[featureName] ?? {};
      }
      return {};
    }
    return {};
  };

export const getStatsByDataSourceIdFeatureAndFieldName =
  (
    dataSourceId: string,
    featureName: string,
    fieldName: string
  ): ((state: RootState) => SummaryStat) =>
  (state: RootState) => {
    if (dataSourceId && featureName && fieldName) {
      const statsByDataSource = state.stats?.statsByDataSourceId[dataSourceId];
      if (!statsByDataSource) {
        return {};
      }
      const statsByFeatureName = statsByDataSource[featureName];
      if (!statsByFeatureName) {
        return {};
      }
      return statsByFeatureName[fieldName] ?? {};
    }
    return {};
  };

export const getPeerCompareData =
  (
    entityId: string,
    modelId: string,
    peerGroupHash: number,
    categoryIndex: number
  ): ((state: RootState) => ChartData<'radar'>) =>
  (state: RootState): ChartData<'radar'> => {
    const peerCompareData: {
      [name: string]: {
        label: string;
        accessor: keyof PeerGroupBaseStats | 'score';
      };
    } = {
      average: {
        label: 'Peer Average',
        accessor: 'mean',
      },
      max: {
        label: 'Peer Max',
        accessor: 'max',
      },
      min: {
        label: 'Peer Min',
        accessor: 'min',
      },
      score: {
        label: "Person's Score",
        accessor: 'score',
      },
    };
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
        const { attributes: categories } = scoringResult;
        if (modelId && peerGroupHash !== null && categories) {
          const stats = state?.stats?.latestStatsByModelId[modelId] ?? null;
          if (stats && stats.length > 0) {
            const topStat = stats[0];
            const { peerStats } = topStat;
            const hashStat: PeerGroupStats = peerStats[peerGroupHash];
            if (hashStat) {
              const { peerGroupCategoryStats } = hashStat;
              if (
                categoryIndex !== -1 &&
                peerGroupCategoryStats &&
                peerGroupCategoryStats.length > categoryIndex
              ) {
                const categoryLevelStats =
                  peerGroupCategoryStats[categoryIndex];
                if (categoryLevelStats) {
                  const { peerGroupAttributeStats } = categoryLevelStats;
                  const labels = peerGroupAttributeStats
                    ? peerGroupAttributeStats.map((peerGroupAttribute) => {
                        return peerGroupAttribute.attributeId;
                      })
                    : [];
                  const datasets = peerCompareData
                    ? Object.values(peerCompareData).map(
                        (val, peerCompareIndex) => {
                          const { accessor, label } = val;
                          if (accessor !== 'score') {
                            if (peerGroupAttributeStats) {
                              const data = peerGroupAttributeStats.map(
                                (attributeStat) => {
                                  if (attributeStat) {
                                    const { attributeLevelStats } =
                                      attributeStat;
                                    if (attributeLevelStats) {
                                      const score = (attributeLevelStats[
                                        accessor
                                      ] ?? 0) as number;
                                      return roundScoreIntelligently(
                                        score ?? 0
                                      );
                                    }
                                  }
                                  return 0;
                                }
                              );
                              const { textColor, bgColor } =
                                getColorPair(peerCompareIndex);
                              return {
                                label,
                                data,
                                backgroundColor: textColor,
                                borderColor: bgColor,
                                borderWidth: 1,
                              };
                            }
                          } else if (
                            categories &&
                            categories.length > categoryIndex
                          ) {
                            const category: Attribute =
                              categories[categoryIndex];
                            if (category) {
                              const { attributes } = category;
                              if (attributes) {
                                const riskIndicators = attributes ?? [];
                                const data = riskIndicators.map(
                                  (riskIndicatorStat) => {
                                    if (riskIndicatorStat) {
                                      const { score } = riskIndicatorStat;
                                      return roundScoreIntelligently(
                                        score ?? 0
                                      );
                                    }
                                    return 0;
                                  }
                                );
                                const { textColor, bgColor } =
                                  getColorPair(peerCompareIndex);
                                return {
                                  label,
                                  data,
                                  backgroundColor: textColor,
                                  borderColor: bgColor,
                                  borderWidth: 1,
                                };
                              }
                            }
                          }
                          return {
                            label: '',
                            data: [],
                          };
                        }
                      )
                    : [];
                  return { labels, datasets };
                }
              } else if (peerGroupCategoryStats) {
                const labels = peerGroupCategoryStats.map(
                  (peerGroupCategory) => {
                    if (peerGroupCategory) {
                      return peerGroupCategory.categoryId;
                    }
                    return '';
                  }
                );
                const datasets = Object.values(peerCompareData).map(
                  (val, peerCompareIndex) => {
                    const { accessor, label } = val;
                    if (accessor !== 'score') {
                      const data = peerGroupCategoryStats.map(
                        (categoryStat) => {
                          if (categoryStat) {
                            const { categoryLevelStats } = categoryStat;
                            if (categoryLevelStats) {
                              const score = (categoryLevelStats[accessor] ??
                                0) as number;
                              return roundScoreIntelligently(score);
                            }
                          }
                          return 0;
                        }
                      );
                      const { textColor, bgColor } =
                        getColorPair(peerCompareIndex);
                      return {
                        label,
                        data,
                        backgroundColor: textColor,
                        borderColor: bgColor,
                        borderWidth: 1,
                      };
                    } else {
                      const data = categories
                        ? categories.map((categoryStat) => {
                            if (categoryStat) {
                              const { score } = categoryStat;
                              return roundScoreIntelligently(score ?? 0);
                            }
                            return 0;
                          })
                        : [];
                      const { textColor, bgColor } =
                        getColorPair(peerCompareIndex);
                      return {
                        label,
                        data,
                        backgroundColor: textColor,
                        borderColor: bgColor,
                        borderWidth: 1,
                      };
                    }
                  }
                );
                return { labels, datasets };
              }
            }
          }
        }
      }
    }
    return { labels: [], datasets: [] };
  };

export const getPeerChartData =
  (
    modelId: string,
    entityId: string,
    categoryIndex: number
  ): ((
    state: RootState
  ) => ChartData<
    'bar',
    (number | ScatterDataPoint | BubbleDataPoint | BarChartDataSet | null)[]
  >) =>
  (
    state: RootState
  ): ChartData<
    'bar',
    (number | ScatterDataPoint | BubbleDataPoint | BarChartDataSet | null)[]
  > => {
    const peerCompareData: {
      label: string;
      accessor: keyof PeerGroupBaseStats | 'score';
      bgColor: string;
    }[] = [
      {
        label: 'Peer Maximum Score',
        accessor: 'max',
        bgColor: '#C62828',
      },
      {
        label: "Individual's Score",
        accessor: 'score',
        bgColor: '#EDA200',
      },
      {
        label: 'Peer Average Score',
        accessor: 'mean',
        bgColor: '#75AC00',
      },
      // {
      //   label: 'Peer Minimum Score',
      //   accessor: 'min',
      //   bgColor: '#0050BE',
      // },
    ];
    const scores = state?.scores || null;
    if (scores) {
      const { peerAttributeData } = scores;
      if (peerAttributeData) {
        const { score, peerIdHash } = peerAttributeData;
        if (
          score !== null &&
          score !== undefined &&
          entityId &&
          peerIdHash !== null
        ) {
          const entity =
            (state?.entities?.entities &&
              state?.entities?.entities[entityId]) ??
            null;
          if (entity) {
            const rankingByEntityId =
              (state.entities?.rankingByEntityId &&
                state.entities?.rankingByEntityId[entityId]) ??
              null;
            if (rankingByEntityId) {
              const scoringResult: ScoringResult =
                rankingByEntityId.scoringResult ?? null;
              const { attributes: categories } = scoringResult;
              if (peerIdHash !== null && categories) {
                const stats: Stats[] =
                  state?.stats?.latestStatsByModelId[modelId] ?? [];
                if (stats) {
                  const labelsCandidate: (string | null)[] = stats
                    ? stats.map(({ instance, peerStats }) => {
                        if (peerStats) {
                          const hashStat: PeerGroupStats =
                            peerStats[peerIdHash];
                          if (instance && hashStat) {
                            const instanceDate = new Date(instance);
                            return formatDate(instanceDate);
                          }
                        }
                        return null;
                      })
                    : [];
                  const labels: string[] = [];
                  labelsCandidate.forEach((label: string | null) => {
                    if (label !== null) {
                      labels.push(label);
                    }
                  });
                  const datasets = peerCompareData
                    ? peerCompareData.map((dict) => {
                        if (dict) {
                          const { accessor, bgColor, label } = dict;
                          const candidateData: (number | null)[] = stats.map(
                            (stat) => {
                              const { peerStats } = stat;
                              if (peerStats) {
                                const hashStat: PeerGroupStats =
                                  peerStats[peerIdHash];
                                if (hashStat) {
                                  const { peerGroupCategoryStats } = hashStat;
                                  if (
                                    peerGroupCategoryStats &&
                                    peerGroupCategoryStats.length >
                                      categoryIndex
                                  ) {
                                    const categoryPeerGroup =
                                      peerGroupCategoryStats[categoryIndex];
                                    if (categoryPeerGroup) {
                                      const { categoryLevelStats } =
                                        categoryPeerGroup;
                                      if (categoryLevelStats) {
                                        const dataItem =
                                          accessor !== 'score'
                                            ? roundScoreIntelligently(
                                                (categoryLevelStats[accessor] ??
                                                  0) as number
                                              )
                                            : roundScoreIntelligently(
                                                (score ?? 0) as number
                                              );
                                        return dataItem;
                                      }
                                    }
                                  }
                                }
                              }
                              return null;
                            }
                          );
                          const data: number[] = [];
                          candidateData.forEach((item: number | null) => {
                            if (item !== null) {
                              data.push(item);
                            }
                          });
                          const dataSet: BarChartDataSet = {
                            label,
                            data,
                            borderColor: bgColor,
                            backgroundColor: bgColor,
                          };
                          return dataSet;
                        } else {
                          return {
                            label: '',
                            data: [],
                          };
                        }
                      })
                    : [];
                  return {
                    labels,
                    datasets,
                  };
                }
              }
            }
          }
        }
      }
    }
    return {
      labels: [],
      datasets: [],
    };
  };

export const getChartDataSets =
  (
    modelId: string,
    entityId: string,
    categoryIndex: number
  ): ((state: RootState) => PeerDataType[] | null) =>
  (state: RootState): PeerDataType[] | null => {
    const scores = state?.scores || null;
    if (scores) {
      const { peerAttributeData } = scores;
      if (peerAttributeData) {
        const { scoringInstance, score, ties, peerIdHash, ranking } =
          peerAttributeData;
        if (
          scoringInstance &&
          score &&
          peerIdHash !== null &&
          entityId &&
          ranking
        ) {
          const instanceDate = new Date(scoringInstance);
          const dateString = formatDate(instanceDate);
          const entity =
            (state?.entities?.entities &&
              state?.entities?.entities[entityId]) ??
            null;
          if (entity) {
            const rankingByEntityId =
              (state.entities?.rankingByEntityId &&
                state.entities?.rankingByEntityId[entityId]) ??
              null;
            if (rankingByEntityId) {
              const scoringResult: ScoringResult =
                rankingByEntityId.scoringResult ?? null;
              const { attributes: categories } = scoringResult;
              if (peerIdHash !== null && categories && categories.length > 0) {
                const stats =
                  state?.stats?.latestStatsByModelId[modelId] ?? null;
                if (stats !== null) {
                  const candidateData: (PeerDataType | null)[] = stats.map(
                    (stat: Stats) => {
                      const { peerStats } = stat;
                      if (peerStats) {
                        const hashStat: PeerGroupStats = peerStats[peerIdHash];
                        if (hashStat) {
                          const { peerGroupCategoryStats } = hashStat;
                          if (
                            peerGroupCategoryStats &&
                            peerGroupCategoryStats.length > categoryIndex
                          ) {
                            const categoryPeerGroup =
                              peerGroupCategoryStats[categoryIndex];
                            if (categoryPeerGroup) {
                              const { categoryLevelStats } = categoryPeerGroup;
                              if (categoryLevelStats) {
                                const { min, max, mean } = categoryLevelStats;
                                return {
                                  minimum: roundScoreIntelligently(min ?? 0),
                                  max: roundScoreIntelligently(max ?? 0),
                                  average: roundScoreIntelligently(mean ?? 0),
                                  rank: ranking,
                                  individual: roundScoreIntelligently(
                                    score ?? 0
                                  ),
                                  startDate: dateString,
                                  endDate: dateString,
                                  ties,
                                };
                              }
                            }
                          }
                        }
                      }
                      return null;
                    }
                  );
                  const dataReturn: PeerDataType[] = [];
                  candidateData.forEach((item) => {
                    if (item !== null) {
                      dataReturn.push(item);
                    }
                  });
                  return dataReturn;
                }
              }
            }
          }
        }
      }
    }
    return null;
  };

export const getPeerGroupId =
  (modelId: string): ((state: RootState) => string | null) =>
  (state: RootState): string | null => {
    const scores = state?.scores || null;
    if (scores) {
      const { peerAttributeData } = scores;
      if (peerAttributeData) {
        const { peerIdHash } = peerAttributeData;
        if (peerIdHash !== null && modelId) {
          const stats = state?.stats?.latestStatsByModelId[modelId] ?? null;
          if (stats && stats.length > 0) {
            const { peerStats } = stats[0];
            if (peerStats) {
              const hashStat: PeerGroupStats = peerStats[peerIdHash];
              if (hashStat) {
                const { peerGroupId } = hashStat;
                if (peerGroupId) {
                  const peerGroupIds = Object.values(peerGroupId).join(',');
                  return peerGroupIds;
                }
              }
            }
          }
        }
      }
    }
    return null;
  };

export const getGlobalStatsInitializedByStatus =
  (status: string): ((state: RootState) => boolean) =>
  (state: RootState): boolean => {
    const statusAccessor: keyof ReduxJson.StatsState =
      statusesToInitializeBooleans[status];
    if (statusAccessor) {
      return state?.stats[statusAccessor] ?? false;
    }
    return false;
  };

export const getGlobalStatsByStatus =
  (status: string): ((state: RootState) => StateCardItemType | null) =>
  (state: RootState): StateCardItemType | null => {
    const statusAccessor: keyof ReduxJson.StatsState =
      statusesToAccessors[status];
    if (statusAccessor) {
      const amount = state?.stats[statusAccessor] ?? 0;
      const object =
        statusAccessor in keysToObjectsGlobalStats
          ? keysToObjectsGlobalStats[statusAccessor]
          : null;
      if (object) {
        return {
          ...object,
          amount,
        };
      }
    }
    return null;
  };

export const getTopRiskIndicatorsByModelId: (
  modelId: string
) => (state: RootState) => TopRiskIndicatorPercentage[] =
  (modelId: string) => (state: RootState) =>
    state?.stats?.topAttributesByModelId[modelId] ?? [];

export const getTriageAndAverageScoresByModelId: (
  modelId: string
) => (state: RootState) => TriageAndAverageScore | null =
  (modelId: string) => (state: RootState) =>
    state?.stats?.countTriagedByModelId[modelId] ?? null;

export default statsSlice.reducer;
