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
} from '@/types';
import { BubbleDataPoint, ChartData, ScatterDataPoint } from 'chart.js';
import { getColorPair } from '@/libs/color-generator';
import { roundScore } from '@/libs/math-utils';
import {
  BasisPropertyType,
  Scoring,
  RetrieveScoresForEntityParams,
  ScoringCount,
  RetrieveScoringCountParams,
  RetrieveBasisCountParams,
  BasisCount,
} from '@/types/scoring.type';
import { checkAuthToken } from '@/libs/auth-token';

const pageLimitDefault: { [pageName: string]: number } = {
  homePage: 25,
  basis: 25,
};

const initialState: ReduxJson.ScoresState = {
  loading: true,
  scoresInitialized: false,
  countInitialized: false,
  status: null,
  entityModelId: null,
  entityRanking: [],
  scoringReportInitialized: false,
  dataSourceId: '',
  beginCursor: '',
  endCursor: '',
  pageNumber: 1,
  previousPageNumber: 0,
  pageLimit: null,
  basisReport: [],
  countRecords: 0,
  basisCursorByPageNumber: {},
};

export const retrieveScores = createAsyncThunk<
  PaginateResult<Scoring>,
  RetrieveScoringParams,
  { dispatch: AppDispatch; state: RootState }
>('scores/retrieveScores', async (params: RetrieveScoringParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await checkAuthToken();
    return await scoresDataApi.loadScoresData(params);
  } catch (error) {
    const err = error as AxiosError;
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
      await checkAuthToken();
      return await scoresDataApi.loadScoresCountData(params);
    } catch (error) {
      const err = error as AxiosError;
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
    await checkAuthToken();
    return await scoresDataApi.loadBasisData(params);
  } catch (error) {
    const err = error as AxiosError;
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
      await checkAuthToken();
      return await scoresDataApi.loadBasisCountData(params);
    } catch (error) {
      const err = error as AxiosError;
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
      await checkAuthToken();
      return await scoresDataApi.loadScoresForEntityData(params);
    } catch (error) {
      const err = error as AxiosError;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveScores.pending, (state) => {
        state.loading = true;
        state.scoresInitialized = false;
        state.scoringReportInitialized = false;
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
      });
  },
});

export const entityScoringSelector = (state: RootState): EntityRanking[] =>
  state.entityRanking;

export const barChartLabelsSelector = (state: RootState): string[] => {
  const entityRankingData = state.scores?.entityRanking ?? [];
  return entityRankingData.map((entity: EntityRanking) =>
    roundScore(entity.score).toString()
  );
};

const barChartDataSetsSelector = (state: RootState): BarChartDataSets => {
  const entityRankingData = state?.scores?.entityRanking ?? [];

  const barchartGroupDictionary: { [name: string]: number[] } = {};
  const backGroundColors: { [name: string]: string } = {};
  entityRankingData.forEach((entity: EntityRanking) => {
    const { scoringResult } = entity;
    const { attributes } = scoringResult;
    attributes.forEach((attribute: Attribute, index: number) => {
      const { name, score } = attribute;
      const roundedScore = roundScore(score);
      if (!(name in barchartGroupDictionary)) {
        barchartGroupDictionary[name] = [roundedScore];
        const colorPair = getColorPair(index);
        backGroundColors[name] = colorPair.bgColor;
      } else {
        barchartGroupDictionary[name].push(roundedScore);
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
): ChartData<
  'bar',
  (number | ScatterDataPoint | BubbleDataPoint | null)[]
> => ({
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

export const isScoringStatusPending = (state: RootState): boolean =>
  state?.scores.status === ResponseStatus.PENDING;
export const isScoringStatusSuccess = (state: RootState): boolean =>
  state?.scores.status === ResponseStatus.SUCCESS;
export const isScoringStatusFailed = (state: RootState): boolean =>
  state?.scores.status === ResponseStatus.FAILED;

export const isScoringReportInitializedSelector = (state: RootState): boolean =>
  state?.scores.scoringReportInitialized ?? false;

export const isScoringInitializedSelector = (state: RootState): boolean =>
  state?.scores.scoresInitialized ?? false;

export const getScoringCurrentModelId = (state: RootState): string =>
  state?.scores.entityModelId ?? null;

export const getScoringCount = (state: RootState): number =>
  state?.scores?.countRecords ?? 0;

export const getIsScoringCountInitialized = (state: RootState): boolean =>
  state?.scores?.countInitialized ?? false;

export const { changePageNumber, changeLimit, changeDataSourceId } =
  scoringSlice.actions;
export default scoringSlice.reducer;
