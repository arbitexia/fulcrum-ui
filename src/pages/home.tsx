/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { DashboardLayout } from '@/layouts';
import { Box, Typography } from '@mui/material';
import {
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
  getAccessToken,
  setStateAccessToken,
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
  getEntities,
} from '@/redux/slices';
import { retrieveEntitiesConfig } from '@/redux/slices/config.slice';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import config from '@/config';
import { noop } from 'lodash';
import { RetrieveScoringCountParams } from '@/types/scoring.type';
import { getIsScoringCountInitialized } from '@/redux/slices/scoring.slice';

const baseAuthenticationUrl: string = config.URLS.AUTHENTICATION || '';

const HomePage = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { query, isReady } = router;
  const { accessToken: queryAccessToken = null } = query as {
    accessToken: string | null;
  };
  const modelId = useAppSelector(getSelectedModelId);
  const statusCardsSelected = useAppSelector(statsToStatusCards(modelId));
  const isDataSourceConfigInitialized = useAppSelector(
    getDataSourcesConfigInitialized
  );
  const isEntitiesConfigInitialized = useAppSelector(
    getEntitiesConfigInitialized
  );
  const stateAccessToken = useAppSelector(getAccessToken);
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
  const [innerModelId, setInnerModelId] = useState<string | null>(null);

  useEffect(() => {
    if (!modelsListInitialized && stateAccessToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveModels({ accessToken: stateAccessToken, limit: 3000 }));
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveAttributes({ accessToken: stateAccessToken, limit: 3000 })
      );
    }
  }, [dispatch, modelsListInitialized, stateAccessToken]);

  useEffect(() => {
    if (isReady) {
      if (!stateAccessToken && !queryAccessToken) {
        router
          .push(
            `${baseAuthenticationUrl}/login/${config.AUTHENTICATION_SERVICE}`
          )
          .then(noop);
      } else if (!stateAccessToken && queryAccessToken) {
        dispatch(setStateAccessToken({ accessToken: queryAccessToken }));
      }
    }
  }, [isReady, stateAccessToken, queryAccessToken, dispatch, router]);

  useEffect(() => {
    if (
      modelId &&
      stateAccessToken &&
      (modelId !== innerModelId || !isStatsInitialized)
    ) {
      setInnerModelId(modelId);
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getLatestStat({ modelId, accessToken: stateAccessToken })
      );
    }
  }, [dispatch, modelId, innerModelId, stateAccessToken, isStatsInitialized]);

  useEffect(() => {
    if (!isDataSourceConfigInitialized && stateAccessToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveDataSources({ accessToken: stateAccessToken }));
    }
  }, [dispatch, isDataSourceConfigInitialized, stateAccessToken]);

  useEffect(() => {
    if (!isEntitiesConfigInitialized && stateAccessToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveEntitiesConfig({ accessToken: stateAccessToken }));
    }
  }, [dispatch, isEntitiesConfigInitialized, stateAccessToken]);

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

  useEffect(() => {
    if (
      stateAccessToken &&
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
      const usePageNumber =
        innerModelId !== modelId ? 1 : selectPageInfo?.pageNumber ?? 1;
      const cursor = cursorsByPageNumber[usePageNumber]?.beginCursor ?? '';
      const useCursor = usePageNumber === 1 ? '' : cursor ?? '';
      const args = {
        accessToken: stateAccessToken,
        requestType: 'getRanked',
        modelId,
        modelInstance: modelStats.instance,
        cursor: useCursor,
        limit: selectPageInfo.limit,
        pageNumber: usePageNumber,
      };
      dispatchRetrieveScores(args)
        .then(() => {
          if (!isScoringCountInitialized) {
            dispatchRetrieveScoresCount(args);
          }
        })
        .then(() => setInnerModelId(modelId));
    }
  }, [
    dispatch,
    innerModelId,
    setInnerModelId,
    modelId,
    modelStats,
    stateAccessToken,
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
  ]);

  useEffect(() => {
    if (stateAccessToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(getEntities({ accessToken: stateAccessToken }));
    }
  }, [stateAccessToken, dispatch]);

  return (
    <DashboardLayout title="Home" navbarBorder={true} navEls={<HomeNavbar />}>
      <UIContainer>
        <UIFlexWrapBox sx={{ gap: 2.5 }}>
          {statusCardsSelected &&
            statusCardsSelected.length > 0 &&
            statusCardsSelected.map(
              (card: StateCardItemType, index: number) => (
                <HomeStateCard cardInfo={card} key={index} />
              )
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
            <HomeBarChart />
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
            <UIWhiteCard sx={{ height: '50%' }}>
              <Typography variant="h6" color="text.secondary">
                Top 1% of Individuals
              </Typography>

              <Box
                sx={{ height: '100%' }}
                display="flex"
                justifyContent="space-between"
              >
                <Box sx={{ width: '50%' }}>
                  <HomeDoughnutChart />
                </Box>
                <UIFlexCenterBox sx={{ width: '50%' }}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <UIScoreChip
                      sx={{ width: '38px', height: '38px', mb: 1 }}
                      label={44}
                      bgColor="#FF5722"
                    />
                    <Typography variant="h6">Average Score</Typography>
                  </Box>
                </UIFlexCenterBox>
              </Box>
            </UIWhiteCard>
            <HomeRiskIndicator />
          </Box>
        </UIFlexSpaceBox>
        <UIFlexWrapBox
          sx={{
            gap: 2.5,
            alignItems: 'stretch',
            margin: (theme) => theme.spacing(2.5, 'auto'),
          }}
        >
          <HomeUserTable />
        </UIFlexWrapBox>
      </UIContainer>
    </DashboardLayout>
  );
};

export default HomePage;
