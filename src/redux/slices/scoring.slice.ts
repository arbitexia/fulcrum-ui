/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from '@/redux/store';
import { scoresDataApi } from '@/redux/apis';
import { AxiosError } from 'axios';
import {
  ReduxJson,
  ResponseStatus,
  Attribute,
  BarChartDataSet,
  BarChartDataSets,
  EntityRanking,
  RetrieveScoringParams,
  RetrieveBasisParams,
  ScoreBasisResult,
  PaginateResult,
  PaginateParam,
  PaginationState,
  ScoringRankingResult,
  ScoringResult,
  GetPeerAttributeRankingParams,
} from '@/types';
import { ChartData } from 'chart.js';
import { getColorPair } from '@/libs/color-generator';
import { returnScore, roundToSignificant } from '@/libs/math-utils';
import {
  BasisPropertyType,
  Scoring,
  RetrieveScoresForEntityParams,
  ScoringCount,
  RetrieveScoringCountParams,
  RetrieveBasisCountParams,
  BasisCount,
  RetrieveHistoricalScoreDataForEntityParams,
  HistoricalRankingResult,
  HistoricalRanking,
  HistoricalRankingBackend,
} from '@/types/scoring.type';
import {
  GetPeerGroupHistoricalRankingParams,
  GetPeerGroupRankingParams,
  GetPeerGroupRankingResponse,
  HistoricalPeerGroupType,
  PeerAttributeData,
} from '@/types/graph.type';
import { sum } from 'lodash';
import { genRefreshToken } from '@/libs/auth-token';

const pageLimitDefault: { [pageName: string]: number } = {
  homePage: 25,
  basis: 25,
};

const initialState: ReduxJson.ScoresState = {
  loading: true,
  scoresInitialized: false,
  countInitialized: false,
  scoringReportInitialized: false,
  scoringCategoriesInitialized: false,
  categoriesCountInitialized: false,
  scoringHistoryDataInitialized: false,
  peerGroupHashInitialized: false,
  peerGroupHistoricalHashesInitialized: false,
  peerAttributeDataInitialized: false,
  status: null,
  entityModelId: null,
  entityRanking: [],
  dataSourceId: '',
  beginCursor: '',
  endCursor: '',
  pageNumber: 1,
  previousPageNumber: 0,
  pageLimit: null,
  basisReport: [],
  scoringHistory: [],
  countRecords: 0,
  basisCursorByPageNumber: {},
  peerGroupHashModelId: null,
  peerGroupHash: null,
  peerGroupHashCallFailed: {},
  peerGroupHistoricalHashes: [],
  peerAttributeData: null,
  selectedCategories: undefined,
};

export const retrieveScores = createAsyncThunk<
  PaginateResult<Scoring>,
  RetrieveScoringParams,
  { dispatch: AppDispatch; state: RootState }
>('scores/retrieveScores', async (params: RetrieveScoringParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    if (params.requestType && !params.categories) {
      return await scoresDataApi.loadScoresData(params);
    } else {
      return await scoresDataApi.loadScoresDataForCategories(params);
    }
  } catch (error) {
    const err = error as AxiosError;
    await genRefreshToken(err);
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const retrieveScoresCount = createAsyncThunk<
  ScoringCount,
  RetrieveScoringCountParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'scores/retrieveScoresCount',
  async (params: RetrieveScoringCountParams, thunkAPI) => {
    try {
      // TODO - define the api auth token
      if (params.requestType && !params.categories) {
        return await scoresDataApi.loadScoresCountData(params);
      } else {
        return await scoresDataApi.loadScoresCategoriesCountData(params);
      }
    } catch (error) {
      const err = error as AxiosError;
      await genRefreshToken(err);
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const retrieveBasis = createAsyncThunk<
  PaginateResult<ScoreBasisResult>,
  RetrieveBasisParams,
  { dispatch: AppDispatch; state: RootState }
>('scores/retrieveBasis', async (params: RetrieveBasisParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    return await scoresDataApi.loadBasisData(params);
  } catch (error) {
    const err = error as AxiosError;
    await genRefreshToken(err);
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const retrieveBasisCount = createAsyncThunk<
  BasisCount,
  RetrieveBasisCountParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'scores/retrieveBasisCount',
  async (params: RetrieveBasisCountParams, thunkAPI) => {
    try {
      // TODO - define the api auth token
      return await scoresDataApi.loadBasisCountData(params);
    } catch (error) {
      const err = error as AxiosError;
      await genRefreshToken(err);
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const retrieveScoresForEntity = createAsyncThunk<
  EntityRanking,
  RetrieveScoresForEntityParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'scores/retrieveScoresForEntity',
  async (params: RetrieveScoresForEntityParams, thunkAPI) => {
    try {
      // TODO - define the api auth token
      return await scoresDataApi.loadScoresForEntityData(params);
    } catch (error) {
      const err = error as AxiosError;
      await genRefreshToken(err);
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const retrieveGroupHash = createAsyncThunk<
  GetPeerGroupRankingResponse,
  GetPeerGroupRankingParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'scores/retrieveGroupHash',
  async (params: GetPeerGroupRankingParams, thunkAPI) => {
    try {
      // TODO - define the api auth token
      return await scoresDataApi.loadPeerGroupHashRankingData(params);
    } catch (error) {
      const err = error as AxiosError;
      await genRefreshToken(err);
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const retrieveHistoricalGroupHashes = createAsyncThunk<
  HistoricalPeerGroupType[],
  GetPeerGroupHistoricalRankingParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'scores/retrieveHistoricalGroupHashes',
  async (params: GetPeerGroupHistoricalRankingParams, thunkAPI) => {
    try {
      // TODO - define the api auth token
      return await scoresDataApi.loadPeerGroupHistoricalData(params);
    } catch (error) {
      const err = error as AxiosError;
      await genRefreshToken(err);
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const retrievePeerAttributeData = createAsyncThunk<
  PeerAttributeData,
  GetPeerAttributeRankingParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'scores/retrievePeerAttributeData',
  async (params: GetPeerAttributeRankingParams, thunkAPI) => {
    try {
      // TODO - define the api auth token
      return await scoresDataApi.loadPeerAttributeRankingData(params);
    } catch (error) {
      const err = error as AxiosError;
      await genRefreshToken(err);
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const retrieveHistoricalDataForModelAndEntity = createAsyncThunk<
  HistoricalRankingResult,
  RetrieveHistoricalScoreDataForEntityParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'scores/retrieveHistoricalDataForModelAndEntity',
  async (params: RetrieveHistoricalScoreDataForEntityParams, thunkAPI) => {
    try {
      // TODO - define the api auth token
      return await scoresDataApi.loadHistoricalDataForEntity(params);
    } catch (error) {
      const err = error as AxiosError;
      await genRefreshToken(err);
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

const scoringSlice = createSlice({
  name: `scores`,
  initialState,
  reducers: {
    changeLimit: (state, { payload }) => {
      const { limit } = payload;
      return {
        ...state,
        beginCursor: '',
        endCursor: '',
        pageNumber: 1,
        previousPageNumber: 0,
        pageLimit: limit,
        countInitialized: false,
        scoringReportInitialized: false,
      };
    },
    changePageNumber: (state, { payload }) => {
      const { pageNumber } = payload;
      if (pageNumber > 0) {
        const previousPageNumber = state.pageNumber;
        const newBeginCursor =
          pageNumber > 1
            ? state?.basisCursorByPageNumber[pageNumber]?.beginCursor ?? ''
            : '';
        const countInitialized = pageNumber > 1;
        return {
          ...state,
          beginCursor: newBeginCursor,
          pageNumber,
          previousPageNumber,
          countInitialized,
          scoringReportInitialized: false,
        };
      }
      return state;
    },
    changeDataSourceId: (state, { payload }) => {
      const { dataSourceId } = payload;
      if (dataSourceId) {
        return {
          ...state,
          beginCursor: '',
          endCursor: '',
          pageNumber: 1,
          previousPageNumber: 0,
          pageLimit: pageLimitDefault['basis'],
          scoringReportInitialized: false,
          countInitialized: false,
          dataSourceId,
        };
      }
      return state;
    },
    setSelectedCategoriesState: (state, { payload }) => {
      const { categories }: { categories?: string[] } = payload;
      if (categories && categories.length > 0) {
        return {
          ...state,
          beginCursor: '',
          endCursor: '',
          pageNumber: 1,
          previousPageNumber: 0,
          pageLimit: pageLimitDefault['home'],
          scoringReportInitialized: false,
          countInitialized: false,
          selectedCategories: categories,
        };
      } else {
        return {
          ...state,
          beginCursor: '',
          endCursor: '',
          pageNumber: 1,
          previousPageNumber: 0,
          pageLimit: pageLimitDefault['home'],
          scoringReportInitialized: false,
          countInitialized: false,
          selectedCategories: undefined,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveScores.pending, (state) => {
        state.loading = true;
        state.scoresInitialized = false;
        state.scoringReportInitialized = false;
        state.countInitialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveScores.fulfilled,
        (state, { payload }: PayloadAction<PaginateResult<Scoring>>) => {
          state.loading = false;
          state.scoresInitialized = true;
          state.entityModelId = payload.modelId;
          const payloadScoring: Scoring[] = payload?.data ?? [];
          if (payloadScoring) {
            const entitiesRanking: EntityRanking[] = payloadScoring.map(
              (scoring) => {
                const ranking: ScoringRankingResult = scoring?.ranking;
                const { ranking: rankingString } = ranking;
                const entityRanking: EntityRanking = JSON.parse(rankingString);
                return entityRanking;
              }
            );
            state.entityRanking = entitiesRanking;
            const beginCursor = payload.pageInfo?.beginCursor ?? '';
            state.beginCursor = beginCursor;
            const endCursor = payload.pageInfo?.endCursor ?? '';
            state.endCursor = endCursor;
            const basisLimit = pageLimitDefault['homePage'];
            state.pageLimit = basisLimit;
            const pageNumber = payload.pageInfo?.pageNumber ?? 1;
            const oldPageNumber = state.previousPageNumber;
            state.pageNumber = pageNumber;
            if (pageNumber === 1) {
              const newCursorsByPageNumber: {
                [pageNumber: number]: PaginationState;
              } = {};
              newCursorsByPageNumber[pageNumber] = {
                beginCursor,
                endCursor,
                pageLimit: basisLimit,
                pageNumber: pageNumber,
              };
              newCursorsByPageNumber[pageNumber + 1] = {
                beginCursor: endCursor,
                endCursor: '',
                pageLimit: basisLimit,
                pageNumber: pageNumber + 1,
              };
              state.basisCursorByPageNumber = newCursorsByPageNumber;
            } else if (pageNumber > oldPageNumber) {
              const cursorsByPageNumber = { ...state.basisCursorByPageNumber };
              cursorsByPageNumber[pageNumber] = {
                beginCursor,
                endCursor,
                pageLimit: basisLimit,
                pageNumber: pageNumber,
              };
              cursorsByPageNumber[pageNumber + 1] = {
                beginCursor: endCursor,
                endCursor: '',
                pageLimit: basisLimit,
                pageNumber: pageNumber + 1,
              };
              state.basisCursorByPageNumber = cursorsByPageNumber;
            }
            state.scoringReportInitialized = true;
          }
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveScores.rejected, (state) => {
        state.loading = false;
        state.scoresInitialized = true;
        state.scoringReportInitialized = true;
        state.entityRanking = [];
        state.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveScoresCount.pending, (state) => {
        state.loading = true;
        state.countInitialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveScoresCount.fulfilled,
        (state, { payload }: PayloadAction<ScoringCount>) => {
          state.loading = false;
          state.entityModelId = payload.modelId;
          state.countRecords = payload.scoringCount;
          state.countInitialized = true;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveScoresCount.rejected, (state) => {
        state.loading = false;
        state.countInitialized = true;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveScoresForEntity.pending, (state) => {
        state.loading = true;
        state.scoresInitialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveScoresForEntity.fulfilled,
        (state, { payload }: PayloadAction<EntityRanking>) => {
          state.loading = false;
          state.scoresInitialized = true;
          state.entityModelId = payload.modelId;
          state.entityRanking = [payload];
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveScoresForEntity.rejected, (state) => {
        state.loading = false;
        state.scoresInitialized = true;
        state.entityRanking = [];
        state.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveHistoricalDataForModelAndEntity.pending, (state) => {
        state.loading = true;
        state.scoringHistoryDataInitialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveHistoricalDataForModelAndEntity.fulfilled,
        (state, { payload }: PayloadAction<HistoricalRankingResult>) => {
          state.loading = false;
          state.entityModelId = payload.modelId;
          state.scoringHistoryDataInitialized = true;
          /* we create a linked list on this value so we can see that the values are correct in timeline */
          const historicalRankingList: HistoricalRanking[] = [];
          payload.historicalRanking.forEach(
            (historicalRankingValue: HistoricalRankingBackend) => {
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
              historicalRankingList.push(value);
            }
          );
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
          state.scoringHistory = historicalRankingLinkedList;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveHistoricalDataForModelAndEntity.rejected, (state) => {
        state.loading = false;
        state.scoringHistoryDataInitialized = true;
        state.scoringHistory = [];
        state.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveBasis.pending, (state) => {
        state.loading = true;
        state.scoringReportInitialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveBasis.fulfilled,
        (
          state,
          { payload }: PayloadAction<PaginateResult<ScoreBasisResult>>
        ) => {
          state.loading = false;
          state.entityModelId = payload.modelId;
          state.basisReport = payload.data;
          const beginCursor = payload.pageInfo?.beginCursor ?? '';
          state.beginCursor = beginCursor;
          const endCursor = payload.pageInfo?.endCursor ?? '';
          state.endCursor = endCursor;
          const basisLimit =
            payload.pageInfo?.limit ?? pageLimitDefault['basis'];
          state.pageLimit = basisLimit;
          const cursorsByPageNumber = { ...state.basisCursorByPageNumber };
          const pageNumber = payload.pageInfo?.pageNumber ?? 1;
          state.pageNumber = pageNumber;
          cursorsByPageNumber[pageNumber] = {
            beginCursor,
            endCursor,
            pageLimit: basisLimit,
            pageNumber: pageNumber,
          };
          if (!(pageNumber + 1 in cursorsByPageNumber)) {
            cursorsByPageNumber[pageNumber + 1] = {
              beginCursor: endCursor,
              endCursor: '',
              pageLimit: basisLimit,
              pageNumber: pageNumber + 1,
            };
          }
          state.basisCursorByPageNumber = cursorsByPageNumber;
          state.scoringReportInitialized = true;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveBasis.rejected, (state) => {
        state.loading = false;
        state.scoringReportInitialized = true;
        state.basisReport = [];
        state.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveBasisCount.pending, (state) => {
        state.loading = true;
        state.countInitialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveBasisCount.fulfilled,
        (state, { payload }: PayloadAction<BasisCount>) => {
          state.loading = false;
          state.entityModelId = payload.modelId;
          state.countRecords = payload.basisCount;
          state.countInitialized = true;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveBasisCount.rejected, (state) => {
        state.loading = false;
        state.countInitialized = true;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveGroupHash.pending, (state, { meta }) => {
        state.loading = true;
        state.peerGroupHashModelId = null;
        state.peerGroupHash = null;
        state.peerGroupHashInitialized = false;
        const { arg } = meta;
        const { modelId } = arg;
        const peerGroupHashCallFailed = {
          ...state.peerGroupHashCallFailed,
          [modelId]: false,
        };
        state.peerGroupHashCallFailed = peerGroupHashCallFailed;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveGroupHash.fulfilled,
        (state, { payload }: PayloadAction<GetPeerGroupRankingResponse>) => {
          state.loading = false;
          const { modelId, peerGroupHash } = payload;
          state.peerGroupHashModelId = modelId;
          state.peerGroupHash = peerGroupHash;
          state.peerGroupHashInitialized = true;
          const peerGroupHashCallFailed = {
            ...state.peerGroupHashCallFailed,
            [modelId]: false,
          };
          state.peerGroupHashCallFailed = peerGroupHashCallFailed;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveGroupHash.rejected, (state, { meta }) => {
        state.loading = false;
        state.peerGroupHashModelId = null;
        state.peerGroupHash = null;
        state.peerGroupHashInitialized = true;
        const { arg } = meta;
        const { modelId } = arg;
        const peerGroupHashCallFailed = {
          ...state.peerGroupHashCallFailed,
          [modelId]: true,
        };
        state.peerGroupHashCallFailed = peerGroupHashCallFailed;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveHistoricalGroupHashes.pending, (state) => {
        state.loading = true;
        state.peerGroupHistoricalHashes = [];
        state.peerGroupHistoricalHashesInitialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveHistoricalGroupHashes.fulfilled,
        (state, { payload }: PayloadAction<HistoricalPeerGroupType[]>) => {
          state.loading = false;
          state.peerGroupHistoricalHashes = payload;
          state.peerGroupHistoricalHashesInitialized = true;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveHistoricalGroupHashes.rejected, (state) => {
        state.loading = false;
        state.peerGroupHistoricalHashes = [];
        state.peerGroupHistoricalHashesInitialized = true;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(retrievePeerAttributeData.pending, (state) => {
        state.loading = true;
        state.peerAttributeData = null;
        state.peerAttributeDataInitialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrievePeerAttributeData.fulfilled,
        (state, { payload }: PayloadAction<PeerAttributeData>) => {
          state.loading = false;
          state.peerAttributeData = payload;
          state.peerAttributeDataInitialized = true;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrievePeerAttributeData.rejected, (state) => {
        state.loading = false;
        state.peerAttributeData = null;
        state.peerAttributeDataInitialized = true;
        state.status = ResponseStatus.FAILED;
      });
  },
});

export const entityScoringSelector = (state: RootState): EntityRanking[] =>
  state.entityRanking;

export const barChartLabelsSelector = (state: RootState): string[] => {
  const entityRankingData = state.scores?.entityRanking ?? [];
  return entityRankingData.map((entity: EntityRanking) => {
    const { scoringResult } = entity;
    const { attributes: categories } = scoringResult;
    const categoryArray = categories.map((category: Attribute) => {
      const { score: categoryScore } = category;
      const significanceScore = roundToSignificant(categoryScore, 4);
      const roundedScore = returnScore(significanceScore);
      return roundedScore;
    });
    const scoreSum = sum(categoryArray);
    return scoreSum;
  });
};

const barChartDataSetsSelector = (state: RootState): BarChartDataSets => {
  const entityRankingData = state?.scores?.entityRanking ?? [];

  const barchartGroupDictionary: { [name: string]: number[] } = {};
  const backGroundColors: { [name: string]: string } = {};
  entityRankingData.forEach((entity: EntityRanking) => {
    const { scoringResult } = entity;
    const { attributes: categories } = scoringResult;
    categories.forEach((category: Attribute, index: number) => {
      const { name: categoryName, score: categoryScore } = category;
      const significanceScore = roundToSignificant(categoryScore, 4);
      const roundedScore = returnScore(significanceScore);
      if (!(categoryName in barchartGroupDictionary)) {
        barchartGroupDictionary[categoryName] = [roundedScore];
        const colorPair = getColorPair(index);
        backGroundColors[categoryName] = colorPair.bgColor;
      } else {
        barchartGroupDictionary[categoryName].push(roundedScore);
      }
    });
  });
  return Object.entries(barchartGroupDictionary).map(([label, data]) => {
    const backgroundColor = backGroundColors[label];
    const dataSet: BarChartDataSet = {
      label,
      data,
      backgroundColor,
    };
    return dataSet;
  });
};

export const categoriesSelector = (state: RootState): string[] => {
  const dataSets = barChartDataSetsSelector(state);
  return dataSets.map((dataset) => dataset.label || '');
};

export const barChartDataSelector = (
  state: RootState
): ChartData<'bar', number[]> => ({
  labels: barChartLabelsSelector(state),
  datasets: barChartDataSetsSelector(state),
});

export const scoringPageInfoSelector =
  (source: string): ((state: RootState) => PaginateParam) =>
  (state: RootState): PaginateParam => ({
    beginCursor: state?.scores?.beginCursor ?? '',
    endCursor: state?.scores?.endCursor ?? '',
    pageNumber: state?.scores?.pageNumber ?? 1,
    limit: state?.scores.pageLimit ?? pageLimitDefault[source],
  });

export const getSelectedCategoriesSelector = (state: RootState): string[] =>
  state?.scores?.selectedCategories ?? [];

export const getCurrentPageInfoByPageNumber =
  (pageNumber: number, source: string) =>
  (state: RootState): PaginateParam => {
    const pageInfo = state?.scores?.basisCursorByPageNumber ?? null;
    const pageValues =
      pageInfo && pageNumber in pageInfo ? pageInfo[pageNumber] : null;
    if (pageValues) {
      return {
        beginCursor: pageValues?.beginCursor,
        endCursor: pageValues?.endCursor,
        pageNumber: pageValues?.pageNumber,
        limit: pageValues?.limit,
      };
    }
    return {
      beginCursor: '',
      endCursor: '',
      pageNumber: 1,
      limit: state?.scores.pageLimit ?? pageLimitDefault[source],
    };
  };

export const getAllCursorsByPageNumber = (
  state: RootState
): { [pageNumber: number]: PaginationState } =>
  state?.scores?.basisCursorByPageNumber ?? {};

export const basisReportSelector = (state: RootState): BasisPropertyType[] => {
  const basisReport: ScoreBasisResult[] = state?.scores?.basisReport ?? [];
  return basisReport.map((basisValue: ScoreBasisResult) => {
    return basisValue.basis;
  });
};

export const getPeerGroupHashModelId = (state: RootState): string | null => {
  return state?.scores?.peerGroupHashModelId ?? null;
};

export const getPeerGroupHash = (state: RootState): number | null => {
  return state?.scores?.peerGroupHash ?? null;
};

export const getPeerGroupHashCallFailed = (state: RootState): boolean => {
  return state?.scores?.peerGroupHashCallFailed ?? false;
};
export const getPeerGroupHashCallFailedForModelId =
  (modelId: string): ((state: RootState) => boolean) =>
  (state: RootState): boolean => {
    return state?.scores?.peerGroupHashCallFailed[modelId] ?? false;
  };

export const getHistoricalPeerGroupHashes = (state: RootState): number[] => {
  return state?.scores?.peerGroupHistoricalHashes;
};

export const isScoringStatusPending = (state: RootState): boolean =>
  state?.scores.status === ResponseStatus.PENDING;
export const isScoringStatusSuccess = (state: RootState): boolean =>
  state?.scores.status === ResponseStatus.SUCCESS;
export const isScoringStatusFailed = (state: RootState): boolean =>
  state?.scores.status === ResponseStatus.FAILED;

export const isScoringLoading = (state: RootState): boolean =>
  state?.scores?.loading ?? false;

export const isScoringReportInitializedSelector = (state: RootState): boolean =>
  state?.scores.scoringReportInitialized ?? false;

export const isScoringInitializedSelector = (state: RootState): boolean =>
  state?.scores.scoresInitialized ?? false;

export const getIsHistoricalDataInitialized = (state: RootState): boolean =>
  state?.scores?.scoringHistoryDataInitialized ?? false;

export const getScoringCurrentModelId = (state: RootState): string =>
  state?.scores.entityModelId ?? null;

export const getScoringCount = (state: RootState): number =>
  state?.scores?.countRecords ?? 0;

export const getIsScoringCountInitialized = (state: RootState): boolean =>
  state?.scores?.countInitialized ?? false;

export const getIsPeerGroupHashInitialized = (state: RootState): boolean =>
  state?.scores?.peerGroupHashInitialized ?? false;

export const getIsPeerGroupHistoricalHashesInitialized = (
  state: RootState
): boolean => state?.scores?.peerGroupHistoricalHashesInitialized ?? false;

export const getIsPeerAttributeDataInitialized = (state: RootState): boolean =>
  state?.scores?.peerAttributeDataInitialized ?? false;

export const getPeerAttributeData = (
  state: RootState
): PeerAttributeData | null => state?.scores.peerAttributeData;

export const {
  changePageNumber,
  changeLimit,
  changeDataSourceId,
  setSelectedCategoriesState,
} = scoringSlice.actions;
export default scoringSlice.reducer;
