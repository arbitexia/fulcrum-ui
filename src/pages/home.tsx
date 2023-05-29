/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { DashboardLayout } from '@/layouts';
import { Box, LinearProgress, Typography } from '@mui/material';
import {
  AccessTokenType,
  PaginateParam,
  PaginationState,
  RetrieveScoringParams,
  StateCardItemType,
} from '@/types';
import {
  HomeBarChart,
  HomeStateCard,
  HomeNavbar,
  HomeUserTable,
  HomeDoughnutChart,
  HomeRiskIndicator,
} from '@/modules/Home';
import {
  UIFlexSpaceBox,
  UIContainer,
  UIWhiteCard,
  UIFlexWrapBox,
  UIFlexCenterBox,
  UIScoreChip,
} from '@/components/UI';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  getLatestStat,
  statsToStatusCards,
  getSelectedModelId,
  getSelectedStats,
  getDataSourcesConfigInitialized,
  retrieveDataSources,
  getEntitiesConfigInitialized,
  getStatsInitialized,
  isModelsInitialized,
  retrieveModels,
  retrieveAttributes,
  retrieveScores,
  retrieveScoresCount,
  isScoringInitializedSelector,
  isScoringReportInitializedSelector,
  isScoringStatusFailed,
  scoringPageInfoSelector,
  isEntityStatusPending,
  getAllCursorsByPageNumber,
  categoriesSelector,
  getHomePageTopPercent,
  getNumberTopRiskIndicators,
  getRiskIndicatorsConfigInitialized,
  retrieveEntitiesConfig,
  retrieveRiskIndicatorsConfig,
  retrieveMaskingSystemStatus,
  isGovernanceSystemMaskingInitializedSelector,
  isGovernanceEntitiestoMaskInitializedSelector,
  retrieveMaskings,
  getIsEntityStatusInitialized,
  getEntityStatus,
} from '@/redux/slices';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import config from '@/config';
import { noop } from 'lodash';
import { RetrieveScoringCountParams } from '@/types/scoring.type';
import {
  getIsScoringCountInitialized,
  getScoringCount,
  getSelectedCategoriesSelector,
} from '@/redux/slices/scoring.slice';
import {
  getGlobalStatsByStatus,
  getGlobalStatsInitializedByStatus,
  getTopRiskIndicators,
  getTopRiskIndicatorsInitializedByModelId,
  getTriageAndAverageScores,
  getTriageAndAverageScoresByModelId,
  getTriageAndAverageScoresInitializedByModelId,
  getYearStatuses,
} from '@/redux/slices/stat.slice';
import {
  ENTITY_STATUS_CASE_OPENED,
  ENTITY_STATUS_REVIEWED,
  needsStatusesEntityIdsSelector,
} from '@/redux/slices/entity.slice';
import { roundScore } from '@/libs/math-utils';
import { getScoreColor } from '@/libs/color-generator';
import { readCookie, writeCookie } from '@/libs/cookie-utils';
import { QueryEntityStatusParams } from '@/types/entity.type';

const baseAuthenticationUrl: string = config.URLS.AUTHENTICATION || '';

const HomePage = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { query, isReady } = router as {
    query: AccessTokenType;
    isReady: boolean;
  };
  const {
    accessToken: queryAccessToken = null,
    refreshToken: queryRefreshToken = null,
  } = query as AccessTokenType;
  const modelId = useAppSelector(getSelectedModelId);
  const statusCardsSelected = useAppSelector(statsToStatusCards(modelId));
  const isStatusReviewedInitialized = useAppSelector(
    getGlobalStatsInitializedByStatus('Reviewed')
  );
  const isStatusCaseOpenedInitialized = useAppSelector(
    getGlobalStatsInitializedByStatus('Case Opened')
  );
  const reviewedStatsByStatus: StateCardItemType | null = useAppSelector(
    getGlobalStatsByStatus('Reviewed')
  );
  const caseOpenedStatsByStatus: StateCardItemType | null = useAppSelector(
    getGlobalStatsByStatus('Case Opened')
  );
  const isDataSourceConfigInitialized = useAppSelector(
    getDataSourcesConfigInitialized
  );
  const isEntitiesConfigInitialized = useAppSelector(
    getEntitiesConfigInitialized
  );
  const isRiskIndicatorConfigInitialized = useAppSelector(
    getRiskIndicatorsConfigInitialized
  );
  const cookieAccessToken = readCookie('accessToken');
  const categories = useAppSelector(categoriesSelector);
  const selectedCategories: string[] = useAppSelector(
    getSelectedCategoriesSelector
  );
  const isStatsInitialized = useAppSelector(getStatsInitialized);
  const modelsListInitialized = useAppSelector(isModelsInitialized);
  const modelStats = useAppSelector(getSelectedStats);
  const isScoringInitialized = useAppSelector(isScoringInitializedSelector);
  const isScoringReportInitialized = useAppSelector(
    isScoringReportInitializedSelector
  );
  const selectPageInfo: PaginateParam = useAppSelector(
    scoringPageInfoSelector('homePage')
  );
  const isScoringCountInitialized = useAppSelector(
    getIsScoringCountInitialized
  );
  const cursorsByPageNumber: { [pageNumber: number]: PaginationState } =
    useAppSelector(getAllCursorsByPageNumber);
  const isScoringStatusFailedValue = useAppSelector(isScoringStatusFailed);
  const isEntityStatusPendingValue = useAppSelector(isEntityStatusPending);
  const scoringCount = useAppSelector(getScoringCount);
  const isTopRiskIndicatorsInitialized = useAppSelector(
    getTopRiskIndicatorsInitializedByModelId(modelId)
  );
  const isTriageInitialized = useAppSelector(
    getTriageAndAverageScoresInitializedByModelId(modelId)
  );
  const triageAndAverageScoresByModelId = useAppSelector(
    getTriageAndAverageScoresByModelId(modelId)
  );
  const isGovernanceSystemMaskingInitialized = useAppSelector(
    isGovernanceSystemMaskingInitializedSelector
  );
  const isGovernanceEntitiestoMaskInitialized = useAppSelector(
    isGovernanceEntitiestoMaskInitializedSelector
  );
  const homePageTopPercent = useAppSelector(getHomePageTopPercent);
  const numberTopRiskIndicators = useAppSelector(getNumberTopRiskIndicators);
  const entityStatusentityIdsNeeded = useAppSelector(
    needsStatusesEntityIdsSelector
  );
  const isEntityStatusInitialized = useAppSelector(
    getIsEntityStatusInitialized
  );
  const [innerModelId, setInnerModelId] = useState<string | null>(null);
  const [originalCategories, setOriginalCategories] = useState<string[]>([]);
  const [originalCategoriesSet, setOriginalCategoriesSet] =
    useState<boolean>(false);
  const [refreshCategories, setRefreshCategories] = useState<boolean>(false);

  useEffect(() => {
    if (
      originalCategories.length === 0 &&
      isScoringInitialized &&
      !originalCategoriesSet
    ) {
      setOriginalCategories(categories);
      setOriginalCategoriesSet(true);
      setRefreshCategories(true);
    }
  }, [
    originalCategories,
    categories,
    isScoringInitialized,
    setOriginalCategories,
    originalCategoriesSet,
    setOriginalCategoriesSet,
    setRefreshCategories,
  ]);

  useEffect(() => {
    if (isReady) {
      if (!cookieAccessToken && !queryAccessToken) {
        router
          .push(
            `${baseAuthenticationUrl}/login/${config.AUTHENTICATION_SERVICE}`
          )
          .then(noop);
      } else if (!cookieAccessToken && queryAccessToken) {
        writeCookie('accessToken', queryAccessToken);
        writeCookie('refreshToken', queryRefreshToken ?? '');
      }
    }
  }, [
    isReady,
    cookieAccessToken,
    queryAccessToken,
    queryRefreshToken,
    router,
    dispatch,
  ]);

  useEffect(() => {
    if (!modelsListInitialized && cookieAccessToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveModels({ accessToken: cookieAccessToken, limit: 3000 }));
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveAttributes({ accessToken: cookieAccessToken, limit: 3000 })
      );
    }
  }, [dispatch, modelsListInitialized, cookieAccessToken]);

  useEffect(() => {
    if (
      modelId &&
      cookieAccessToken &&
      (modelId !== innerModelId || !isStatsInitialized)
    ) {
      setInnerModelId(modelId);
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getLatestStat({ modelId, accessToken: cookieAccessToken, limit: 6 })
      );
    }
  }, [dispatch, modelId, innerModelId, cookieAccessToken, isStatsInitialized]);

  useEffect(() => {
    if (!isDataSourceConfigInitialized && cookieAccessToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveDataSources({ accessToken: cookieAccessToken }));
    }
  }, [dispatch, isDataSourceConfigInitialized, cookieAccessToken]);

  useEffect(() => {
    if (!isEntitiesConfigInitialized && cookieAccessToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveEntitiesConfig({ accessToken: cookieAccessToken }));
    }
  }, [dispatch, isEntitiesConfigInitialized, cookieAccessToken]);

  useEffect(() => {
    if (!isRiskIndicatorConfigInitialized && cookieAccessToken) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveRiskIndicatorsConfig({ accessToken: cookieAccessToken })
      );
    }
  }, [dispatch, isRiskIndicatorConfigInitialized, cookieAccessToken]);

  const dispatchRetrieveScores = useCallback(
    (args: RetrieveScoringParams): Promise<unknown> => {
      return new Promise<void>((resolve) => {
        dispatch(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          retrieveScores(args)
        );
        resolve();
      });
    },
    [dispatch]
  );
  const dispatchRetrieveScoresCount = useCallback(
    (args: RetrieveScoringCountParams): Promise<unknown> => {
      return new Promise<void>((resolve) => {
        dispatch(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          retrieveScoresCount(args)
        );
        resolve();
      });
    },
    [dispatch]
  );

  const retrieveScoresCallback = useCallback(
    ({
      inputCategories,
      inputSelectPageInfo,
      inputCursorsByPageNumber,
    }: {
      inputCategories?: string[];
      inputSelectPageInfo: PaginateParam;
      inputCursorsByPageNumber: { [_pageNumber: number]: PaginationState };
    }) => {
      if (modelStats && cookieAccessToken) {
        const changingModel = innerModelId !== modelId;
        const usePageNumber = changingModel
          ? 1
          : inputSelectPageInfo?.pageNumber ?? 1;
        const cursor =
          inputCursorsByPageNumber[usePageNumber]?.beginCursor ?? '';
        const useCursor = usePageNumber === 1 ? '' : cursor ?? '';
        const args: RetrieveScoringParams = {
          accessToken: cookieAccessToken,
          requestType:
            inputCategories && inputCategories.length > 0
              ? undefined
              : 'getRanked',
          modelId,
          modelInstance: modelStats.instance,
          cursor: useCursor,
          limit: inputSelectPageInfo.limit,
          pageNumber: usePageNumber,
          categories: inputCategories,
        };
        dispatchRetrieveScores(args)
          .then(() => {
            dispatchRetrieveScoresCount(args);
          })
          .then(() => {
            setInnerModelId(modelId);
            if (changingModel) {
              setOriginalCategories([]);
              setOriginalCategoriesSet(false);
            }
          });
      }
    },
    [
      innerModelId,
      setInnerModelId,
      setOriginalCategories,
      setOriginalCategoriesSet,
      modelId,
      modelStats,
      cookieAccessToken,
      dispatchRetrieveScores,
      dispatchRetrieveScoresCount,
    ]
  );

  useEffect(() => {
    if (
      cookieAccessToken &&
      modelId &&
      modelStats &&
      modelsListInitialized &&
      !isScoringStatusFailedValue &&
      !isEntityStatusPendingValue &&
      (!innerModelId ||
        innerModelId !== modelId ||
        !isScoringInitialized ||
        !isScoringReportInitialized)
    ) {
      retrieveScoresCallback({
        inputCategories:
          selectedCategories.length === 0 || innerModelId !== modelId
            ? undefined
            : selectedCategories,
        inputSelectPageInfo: selectPageInfo,
        inputCursorsByPageNumber: cursorsByPageNumber,
      });
    }
  }, [
    innerModelId,
    setInnerModelId,
    modelId,
    modelStats,
    cookieAccessToken,
    isScoringInitialized,
    selectPageInfo,
    isScoringReportInitialized,
    isScoringStatusFailedValue,
    isEntityStatusPendingValue,
    modelsListInitialized,
    dispatchRetrieveScores,
    dispatchRetrieveScoresCount,
    isScoringCountInitialized,
    cursorsByPageNumber,
    categories,
    selectedCategories,
    retrieveScoresCallback,
  ]);

  useEffect(() => {
    if (!isStatusReviewedInitialized && cookieAccessToken) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getYearStatuses({
          accessToken: cookieAccessToken,
          entityStatus: ENTITY_STATUS_REVIEWED,
        })
      );
    }
  }, [dispatch, cookieAccessToken, isStatusReviewedInitialized]);

  useEffect(() => {
    if (!isStatusCaseOpenedInitialized && cookieAccessToken) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getYearStatuses({
          accessToken: cookieAccessToken,
          entityStatus: ENTITY_STATUS_CASE_OPENED,
        })
      );
    }
  }, [dispatch, cookieAccessToken, isStatusCaseOpenedInitialized]);

  useEffect(() => {
    if (
      modelStats &&
      isRiskIndicatorConfigInitialized &&
      (!isTopRiskIndicatorsInitialized || modelStats.modelId !== modelId) &&
      cookieAccessToken
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getTopRiskIndicators({
          accessToken: cookieAccessToken,
          modelId: modelStats.modelId,
          instance: modelStats.instance,
          limit: numberTopRiskIndicators,
        })
      );
    }
  }, [
    dispatch,
    cookieAccessToken,
    modelId,
    modelStats,
    isTopRiskIndicatorsInitialized,
    isRiskIndicatorConfigInitialized,
    numberTopRiskIndicators,
  ]);

  useEffect(() => {
    if (
      modelStats &&
      isScoringCountInitialized &&
      isEntitiesConfigInitialized &&
      (!isTriageInitialized || modelStats.modelId !== modelId) &&
      cookieAccessToken
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getTriageAndAverageScores({
          accessToken: cookieAccessToken,
          modelId: modelStats.modelId,
          modelInstance: modelStats.instance,
          fraction: homePageTopPercent,
          cursor: '',
          limit: scoringCount,
        })
      );
    }
  }, [
    dispatch,
    cookieAccessToken,
    modelId,
    modelStats,
    isScoringCountInitialized,
    isEntitiesConfigInitialized,
    homePageTopPercent,
    isTriageInitialized,
    scoringCount,
  ]);

  useEffect(() => {
    if (cookieAccessToken && !isGovernanceSystemMaskingInitialized) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveMaskingSystemStatus({ accessToken: cookieAccessToken })
      );
    }
  }, [cookieAccessToken, isGovernanceSystemMaskingInitialized, dispatch]);

  useEffect(() => {
    if (cookieAccessToken && !isGovernanceEntitiestoMaskInitialized) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveMaskings({
          accessToken: cookieAccessToken,
          userId: '',
        })
      );
    }
  }, [cookieAccessToken, isGovernanceEntitiestoMaskInitialized, dispatch]);

  const dispatchQueryEntityStatus = useCallback(
    (args: QueryEntityStatusParams): Promise<void> => {
      return new Promise<void>((resolve) => {
        dispatch(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          getEntityStatus(args)
        );
        resolve();
      });
    },
    [dispatch]
  );

  useEffect(() => {
    if (
      cookieAccessToken &&
      (!isEntityStatusInitialized ||
        (entityStatusentityIdsNeeded && entityStatusentityIdsNeeded.length > 0))
    ) {
      const getEntityStatusesPromises = entityStatusentityIdsNeeded.map(
        (entityId) => {
          return dispatchQueryEntityStatus({
            accessToken: cookieAccessToken,
            entityId,
          });
        }
      );
      Promise.all(getEntityStatusesPromises).then(noop);
    }
  }, [
    cookieAccessToken,
    entityStatusentityIdsNeeded,
    isEntityStatusInitialized,
    dispatchQueryEntityStatus,
  ]);

  if (!cookieAccessToken) {
    return <LinearProgress />;
  }

  const { countTriaged, topCount, avgScore } =
    triageAndAverageScoresByModelId ?? {
      countTriaged: 0,
      topCount: 0,
      avgScore: 0,
    };

  return (
    <DashboardLayout
      title="Home"
      navbarBorder={true}
      navEls={<HomeNavbar accessToken={cookieAccessToken} />}
    >
      <UIContainer>
        <UIFlexWrapBox sx={{ gap: 2.5 }}>
          {statusCardsSelected &&
            statusCardsSelected.length > 0 &&
            statusCardsSelected.map(
              (card: StateCardItemType, index: number) => (
                <HomeStateCard cardInfo={card} key={index} />
              )
            )}
          {reviewedStatsByStatus && (
            <HomeStateCard cardInfo={reviewedStatsByStatus} />
          )}
          {caseOpenedStatsByStatus && (
            <HomeStateCard cardInfo={caseOpenedStatsByStatus} />
          )}
        </UIFlexWrapBox>
        <UIFlexSpaceBox
          sx={{
            gap: 2.5,
            alignItems: 'stretch',
            margin: (theme) => theme.spacing(2.5, 'auto'),
          }}
        >
          <UIWhiteCard sx={{ width: '67%', alignItem: 'flex-start' }}>
            <HomeBarChart
              originalCategories={originalCategories}
              originalCategoriesInitialized={originalCategoriesSet}
              refreshCategories={refreshCategories}
              setRefreshCategories={setRefreshCategories}
            />
          </UIWhiteCard>
          <Box
            sx={{
              width: '33%',
              display: 'flex',
              gap: 2,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {isTopRiskIndicatorsInitialized && modelId && (
              <HomeRiskIndicator modelId={modelId} />
            )}
            {isTriageInitialized && triageAndAverageScoresByModelId && (
              <UIWhiteCard sx={{ height: '50%' }}>
                <Typography variant="h6" color="text.secondary">
                  Top {roundScore(homePageTopPercent)}% of Individuals
                </Typography>

                <Box
                  sx={{ height: '100%' }}
                  display="flex"
                  justifyContent="space-between"
                >
                  <Box sx={{ width: '50%' }}>
                    <HomeDoughnutChart
                      triagedAmount={countTriaged}
                      totalAmount={topCount}
                    />
                  </Box>
                  <UIFlexCenterBox sx={{ width: '50%' }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <UIScoreChip
                        sx={{ width: '38px', height: '38px', mb: 1 }}
                        label={roundScore(avgScore)}
                        bgColor={getScoreColor(roundScore(avgScore))}
                      />
                      <Typography variant="h6">Average Score</Typography>
                    </Box>
                  </UIFlexCenterBox>
                </Box>
              </UIWhiteCard>
            )}
          </Box>
        </UIFlexSpaceBox>
        <UIFlexWrapBox
          sx={{
            gap: 2.5,
            alignItems: 'stretch',
            margin: (theme) => theme.spacing(2.5, 'auto'),
          }}
        >
          <HomeUserTable accessToken={cookieAccessToken} />
        </UIFlexWrapBox>
      </UIContainer>
    </DashboardLayout>
  );
};

export default HomePage;
