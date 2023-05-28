/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { DashboardLayout } from '@/layouts';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  entityByIdSelector,
  getDataSourcesConfigInitialized,
  getEntitiesConfigInitialized,
  getSelectedModelId,
  retrieveDataSources,
  isScoringInitializedSelector,
  getIsEntitiesInitialized,
  isModelsInitialized,
  setSelectedModelId,
  retrieveModels,
  retrieveAttributes,
  getSelectedStats,
  getStatsInitialized,
  getLatestStat,
  getIsEntityStatusInitialized,
  getEntity,
  isScoringStatusFailed,
  isStatsStatusPending,
  isEntityStatusPending,
  getIsHistoricalDataInitialized,
  retrieveHistoricalDataForModelAndEntity,
  isScoringStatusPending,
  isStatsStatusSuccess,
} from '@/redux/slices';
import {
  UserDetailNavbar,
  UserDetailView,
  UserDetailRiskView,
  UserDetailBasisView,
  UserDetailTimeLineView,
} from '@/modules/Users';
import { Entity, PropertyType } from '@/types/entity.type';
import { useRouter } from 'next/router';
import {
  convertEntityPropertiesToEntityDetailsTableValues,
  getEntityStatus,
  scoredCategoriesTreeListSelector,
} from '@/redux/slices/entity.slice';
import { retrieveEntitiesConfig } from '@/redux/slices/config.slice';
import { Box, LinearProgress } from '@mui/material';
import {
  getIsPeerGroupHashInitialized,
  getIsPeerGroupHistoricalHashesInitialized,
  getPeerGroupHashCallFailedForModelId,
  getPeerGroupHashModelId,
  getScoringCurrentModelId,
  retrieveGroupHash,
  retrieveHistoricalGroupHashes,
  retrieveScoresForEntity,
} from '@/redux/slices/scoring.slice';
import config from '@/config';
import { noop } from 'lodash';
import { readCookie } from '@/libs/cookie-utils';

const baseAuthenticationUrl: string = config.URLS.AUTHENTICATION || '';

const Profile = (): ReactElement => {
  const router = useRouter();
  const basisRef = useRef(null);
  const dispatch = useAppDispatch();
  const { query, isReady } = router as {
    query: {
      id?: string | null;
      modelId?: string | null;
      unmaskToken?: string | null;
    };
    isReady: boolean;
  };
  const {
    id: entityId = '',
    modelId: queryModelId = null,
    unmaskToken: queryUnmaskToken,
  } = query as {
    id: string;
    modelId: string;
    unmaskToken: string;
  };
  const decodedUnmaskToken = queryUnmaskToken
    ? decodeURIComponent(queryUnmaskToken)
    : '';
  const cookieAccessToken = readCookie('accessToken');
  const entity: Entity | null =
    useAppSelector(entityByIdSelector(entityId)) || null;

  const entitiesInitialized = useAppSelector(getIsEntitiesInitialized);
  const isPeerGroupHashInitialized = useAppSelector(
    getIsPeerGroupHashInitialized
  );
  const isPeerGroupHistoricalHashInitialized = useAppSelector(
    getIsPeerGroupHistoricalHashesInitialized
  );
  const isModelsInitializedValue = useAppSelector(isModelsInitialized);
  const modelId = useAppSelector(getSelectedModelId);
  const scoresModelId = useAppSelector(getScoringCurrentModelId);
  const peerGroupHashModelId = useAppSelector(getPeerGroupHashModelId);
  const isStatsInitialized = useAppSelector(getStatsInitialized);
  const isStatStatusSuccessValue = useAppSelector(isStatsStatusSuccess);
  const peerGroupHashCallFailed = useAppSelector(
    getPeerGroupHashCallFailedForModelId(modelId)
  );
  const modelStats = useAppSelector(getSelectedStats);
  const entityProperties: PropertyType | null =
    useAppSelector(
      convertEntityPropertiesToEntityDetailsTableValues(entityId, ['name'])
    ) || null;
  const isDataSourceConfigInitialized = useAppSelector(
    getDataSourcesConfigInitialized
  );
  const isEntitiesConfigInitialized = useAppSelector(
    getEntitiesConfigInitialized
  );
  const isEntitiesStatusInitialized = useAppSelector(
    getIsEntityStatusInitialized
  );
  const isHistoricalDataInitialized = useAppSelector(
    getIsHistoricalDataInitialized
  );
  const isStatStatusPendingValue = useAppSelector(isStatsStatusPending);
  const isEntityStatusPendingValue = useAppSelector(isEntityStatusPending);
  const isScoringStatusFailedValue = useAppSelector(isScoringStatusFailed);
  const isScoringStatusPendingValue = useAppSelector(isScoringStatusPending);
  const isScoringInitialized = useAppSelector(isScoringInitializedSelector);
  const categoriesSelected = useAppSelector(
    scoredCategoriesTreeListSelector(entityId)
  );
  const [selectedAttributeId, setSelectedAttributeId] = useState('');
  const [isDataSourceChanged, setIsDataSourceChanged] = useState(false);
  const [currentQueryModelId, setCurrentQueryModelId] = useState<string | null>(
    queryModelId
  );

  useEffect(() => {
    if (isReady) {
      if (!cookieAccessToken) {
        router
          .push(
            `${baseAuthenticationUrl}/login/${config.AUTHENTICATION_SERVICE}`
          )
          .then(noop);
      }
    }
  }, [isReady, cookieAccessToken, router, dispatch]);

  useEffect(() => {
    if (isReady && isModelsInitializedValue && currentQueryModelId) {
      dispatch(setSelectedModelId({ modelId: currentQueryModelId }));
      setCurrentQueryModelId(null);
    }
  }, [dispatch, isModelsInitializedValue, currentQueryModelId, isReady]);

  useEffect(() => {
    if (!isDataSourceConfigInitialized && cookieAccessToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveDataSources({ accessToken: cookieAccessToken }));
    }
  }, [isDataSourceConfigInitialized, dispatch, cookieAccessToken]);

  useEffect(() => {
    if (!isEntitiesConfigInitialized && cookieAccessToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveEntitiesConfig({ accessToken: cookieAccessToken }));
    }
  }, [isEntitiesConfigInitialized, dispatch, cookieAccessToken]);

  useEffect(() => {
    if (
      isReady &&
      !entitiesInitialized &&
      cookieAccessToken &&
      entityId &&
      !isEntityStatusPendingValue
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getEntity({
          accessToken: cookieAccessToken,
          entityId,
          unmaskToken: decodedUnmaskToken ?? '',
        })
      );
    }
  }, [
    dispatch,
    isReady,
    entitiesInitialized,
    cookieAccessToken,
    entityId,
    isEntityStatusPendingValue,
    decodedUnmaskToken,
  ]);

  useEffect(() => {
    if (
      isReady &&
      !isEntitiesStatusInitialized &&
      entitiesInitialized &&
      cookieAccessToken &&
      entityId
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(getEntityStatus({ accessToken: cookieAccessToken, entityId }));
    }
  }, [
    isEntitiesStatusInitialized,
    entitiesInitialized,
    dispatch,
    cookieAccessToken,
    entityId,
    isReady,
  ]);

  useEffect(() => {
    if (!isModelsInitializedValue && cookieAccessToken) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveModels({ accessToken: cookieAccessToken, limit: 3000 })
      );
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveAttributes({ accessToken: cookieAccessToken, limit: 3000 })
      );
    }
  }, [isModelsInitializedValue, dispatch, cookieAccessToken]);

  useEffect(() => {
    const statsModelId = modelStats?.modelId ?? null;
    if (
      (!isStatsInitialized || statsModelId !== modelId) &&
      cookieAccessToken &&
      modelId &&
      !isStatStatusPendingValue
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getLatestStat({ modelId, accessToken: cookieAccessToken, limit: 6 })
      );
    }
  }, [
    isStatsInitialized,
    modelStats,
    cookieAccessToken,
    modelId,
    isStatStatusPendingValue,
    dispatch,
  ]);

  useEffect(() => {
    const modelStatsId = modelStats?.modelId ?? null;
    const modelInstance = modelStats?.instance ?? null;
    if (
      (!isPeerGroupHashInitialized || peerGroupHashModelId !== modelId) &&
      cookieAccessToken &&
      modelId &&
      entityId &&
      isStatStatusSuccessValue &&
      modelStatsId === modelId &&
      modelInstance &&
      !peerGroupHashCallFailed
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveGroupHash({
          accessToken: cookieAccessToken,
          modelId,
          modelInstance,
          entityId,
        })
      );
    }
  }, [
    dispatch,
    modelId,
    entityId,
    peerGroupHashModelId,
    modelStats,
    cookieAccessToken,
    isPeerGroupHashInitialized,
    isStatStatusSuccessValue,
    peerGroupHashCallFailed,
  ]);

  useEffect(() => {
    const modelChanged = scoresModelId !== modelId;
    if (
      (!isScoringInitialized || modelChanged) &&
      isModelsInitializedValue &&
      modelId &&
      entityId &&
      !currentQueryModelId &&
      isStatsInitialized &&
      isStatStatusSuccessValue &&
      modelStats &&
      modelStats.modelId === modelId &&
      cookieAccessToken &&
      !isScoringStatusFailedValue
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveScoresForEntity({
          accessToken: cookieAccessToken,
          modelId,
          modelInstance: modelStats.instance,
          entityId,
        })
      );
    }
  }, [
    dispatch,
    modelId,
    entityId,
    scoresModelId,
    currentQueryModelId,
    isStatsInitialized,
    isStatStatusSuccessValue,
    modelStats,
    cookieAccessToken,
    isScoringInitialized,
    isModelsInitializedValue,
    isScoringStatusFailedValue,
  ]);

  useEffect(() => {
    const modelChanged = scoresModelId !== modelId;
    if (
      (!isHistoricalDataInitialized || modelChanged) &&
      isModelsInitializedValue &&
      modelId &&
      entityId &&
      !currentQueryModelId &&
      cookieAccessToken &&
      !isScoringStatusFailedValue &&
      isScoringInitialized
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveHistoricalDataForModelAndEntity({
          accessToken: cookieAccessToken,
          modelId,
          entityId,
        })
      );
    }
  }, [
    dispatch,
    modelId,
    entityId,
    scoresModelId,
    currentQueryModelId,
    cookieAccessToken,
    isHistoricalDataInitialized,
    isModelsInitializedValue,
    isScoringStatusFailedValue,
    isScoringInitialized,
  ]);

  useEffect(() => {
    if (
      (!isPeerGroupHistoricalHashInitialized || scoresModelId !== modelId) &&
      isModelsInitializedValue &&
      cookieAccessToken &&
      modelId &&
      entityId &&
      !isScoringStatusFailedValue &&
      !isScoringStatusPendingValue
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveHistoricalGroupHashes({
          accessToken: cookieAccessToken,
          modelId,
          entityId,
        })
      );
    }
  }, [
    dispatch,
    modelId,
    entityId,
    scoresModelId,
    cookieAccessToken,
    isPeerGroupHistoricalHashInitialized,
    isModelsInitializedValue,
    isScoringStatusFailedValue,
    isScoringStatusPendingValue,
  ]);

  const onScrollToBasis = (attributeId: string): void => {
    if (basisRef?.current) {
      const basisContent = basisRef.current as HTMLElement;
      const top = basisContent.getBoundingClientRect().y;
      const scrollTop =
        (window.pageYOffset || document.documentElement.scrollTop) -
        (document.documentElement.clientTop || 0);
      setSelectedAttributeId(attributeId);
      setIsDataSourceChanged(!isDataSourceChanged);
      window.scrollTo({ left: 0, top: top + scrollTop, behavior: 'smooth' });
    }
  };

  if (!cookieAccessToken || !isReady || !isEntitiesStatusInitialized) {
    return <LinearProgress />;
  }

  return (
    <DashboardLayout
      title="User Profile"
      navbarBorder={true}
      navEls={
        <UserDetailNavbar entity={entity} accessToken={cookieAccessToken} />
      }
    >
      <UserDetailView entityProperties={entityProperties} />

      {categoriesSelected && modelId && entityId && modelStats && (
        <UserDetailRiskView
          entityId={entityId}
          modelId={modelId}
          modelInstance={modelStats.instance}
          onScrollToBasis={onScrollToBasis}
          accessToken={cookieAccessToken}
        />
      )}
      {entityId && <UserDetailTimeLineView entityId={entityId} />}
      <Box ref={basisRef}>
        <UserDetailBasisView
          entityId={entityId}
          isDataSourceChanged={isDataSourceChanged}
          attributeId={selectedAttributeId}
          accessToken={cookieAccessToken}
          unmaskToken={decodedUnmaskToken}
        />
      </Box>
    </DashboardLayout>
  );
};

export default Profile;
