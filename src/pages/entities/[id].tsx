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
  getAccessToken,
  isScoringInitializedSelector,
  getIsEntitiesInitialized,
  isModelsInitialized,
  setSelectedModelId,
  retrieveModels,
  retrieveAttributes,
  getSelectedStats,
  getStatsInitialized,
  getLatestStat,
  getIsCommentsInitialized,
  getIsEntityStatusInitialized,
  getEntityComments,
  getEntity,
  isScoringStatusFailed,
  isStatsStatusPending,
  isEntityStatusPending,
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
import { Box } from '@mui/material';
import {
  getScoringCurrentModelId,
  retrieveScoresForEntity,
} from '@/redux/slices/scoring.slice';

const Profile = (): ReactElement => {
  const router = useRouter();
  const basisRef = useRef(null);
  const dispatch = useAppDispatch();
  const { query, isReady } = router;
  const { id: entityId = '', modelId: queryModelId = null } = query as {
    id: string;
    modelId: string;
  };
  const entity: Entity | null =
    useAppSelector(entityByIdSelector(entityId)) || null;

  const entitiesInitialized = useAppSelector(getIsEntitiesInitialized);
  const isModelsInitializedValue = useAppSelector(isModelsInitialized);
  const modelId = useAppSelector(getSelectedModelId);
  const scoresModelId = useAppSelector(getScoringCurrentModelId);
  const isStatsInitialized = useAppSelector(getStatsInitialized);
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
  const isEntitiesCommentsInitialized = useAppSelector(
    getIsCommentsInitialized
  );
  const isEntitiesStatusInitialized = useAppSelector(
    getIsEntityStatusInitialized
  );
  const isStatStatusPendingValue = useAppSelector(isStatsStatusPending);
  const isEntityStatusPendingValue = useAppSelector(isEntityStatusPending);
  const isScoringStatusFailedValue = useAppSelector(isScoringStatusFailed);
  const stateAccessToken = useAppSelector(getAccessToken);
  const isScoringInitialized = useAppSelector(isScoringInitializedSelector);
  const categoriesSelected = useAppSelector(
    scoredCategoriesTreeListSelector(entityId)
  );
  const isCommentsInitialized = useAppSelector(getIsCommentsInitialized);
  const [selectedAttributeId, setSelectedAttributeId] = useState('');
  const [isDataSourceChanged, setIsDataSourceChanged] = useState(false);
  const [currentQueryModelId, setCurrentQueryModelId] = useState<string | null>(
    queryModelId
  );

  useEffect(() => {
    if (isReady && isModelsInitializedValue && currentQueryModelId) {
      dispatch(setSelectedModelId({ modelId: currentQueryModelId }));
      setCurrentQueryModelId(null);
    }
  }, [dispatch, isModelsInitializedValue, currentQueryModelId, isReady]);

  useEffect(() => {
    if (!isDataSourceConfigInitialized && stateAccessToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveDataSources({ accessToken: stateAccessToken }));
    }
  }, [isDataSourceConfigInitialized, dispatch, stateAccessToken]);

  useEffect(() => {
    if (!isEntitiesConfigInitialized && stateAccessToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveEntitiesConfig({ accessToken: stateAccessToken }));
    }
  }, [isEntitiesConfigInitialized, dispatch, stateAccessToken]);

  useEffect(() => {
    if (
      isReady &&
      !entitiesInitialized &&
      stateAccessToken &&
      entityId &&
      !isEntityStatusPendingValue
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getEntity({
          accessToken: stateAccessToken,
          entityId,
        })
      );
    }
  }, [
    dispatch,
    isReady,
    entitiesInitialized,
    stateAccessToken,
    entityId,
    isEntityStatusPendingValue,
  ]);

  useEffect(() => {
    if (
      isReady &&
      !isEntitiesStatusInitialized &&
      stateAccessToken &&
      entityId
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(getEntityStatus({ accessToken: stateAccessToken, entityId }));
    }
  }, [
    isEntitiesStatusInitialized,
    dispatch,
    stateAccessToken,
    entityId,
    isReady,
  ]);

  useEffect(() => {
    if (!isCommentsInitialized && stateAccessToken && entityId) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getEntityComments({
          accessToken: stateAccessToken,
          entityId,
        })
      );
    }
  }, [isCommentsInitialized, stateAccessToken, entityId, dispatch]);

  useEffect(() => {
    if (
      isReady &&
      !isEntitiesCommentsInitialized &&
      stateAccessToken &&
      entityId
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(getEntityComments({ accessToken: stateAccessToken, entityId }));
    }
  }, [
    isEntitiesCommentsInitialized,
    dispatch,
    stateAccessToken,
    entityId,
    isReady,
  ]);

  useEffect(() => {
    if (!isModelsInitializedValue && stateAccessToken) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveModels({ accessToken: stateAccessToken, limit: 3000 })
      );
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveAttributes({ accessToken: stateAccessToken, limit: 3000 })
      );
    }
  }, [isModelsInitializedValue, dispatch, stateAccessToken]);

  useEffect(() => {
    const statsModelId = modelStats?.modelId ?? null;
    if (
      (!isStatsInitialized || statsModelId !== modelId) &&
      stateAccessToken &&
      modelId &&
      !isStatStatusPendingValue
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getLatestStat({ modelId, accessToken: stateAccessToken })
      );
    }
  }, [
    isStatsInitialized,
    modelStats,
    stateAccessToken,
    modelId,
    isStatStatusPendingValue,
    dispatch,
  ]);

  useEffect(() => {
    const modelChanged = scoresModelId !== modelId;
    if (
      (!isScoringInitialized || modelChanged) &&
      isModelsInitializedValue &&
      modelId &&
      entityId &&
      !currentQueryModelId &&
      modelStats &&
      stateAccessToken &&
      !isScoringStatusFailedValue
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveScoresForEntity({
          accessToken: stateAccessToken,
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
    modelStats,
    stateAccessToken,
    isScoringInitialized,
    isModelsInitializedValue,
    isScoringStatusFailedValue,
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

  return (
    <DashboardLayout
      title="User Profile"
      navbarBorder={true}
      navEls={<UserDetailNavbar entity={entity} />}
    >
      <UserDetailView entityProperties={entityProperties} />
      {categoriesSelected && (
        <UserDetailRiskView
          entityId={entityId}
          onScrollToBasis={onScrollToBasis}
        />
      )}
      <UserDetailTimeLineView />
      <Box ref={basisRef}>
        <UserDetailBasisView
          entityId={entityId}
          isDataSourceChanged={isDataSourceChanged}
          attributeId={selectedAttributeId}
        />
      </Box>
    </DashboardLayout>
  );
};

export default Profile;
