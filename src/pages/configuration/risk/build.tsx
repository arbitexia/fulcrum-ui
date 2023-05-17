/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useState, useEffect } from 'react';
import { UIContainer } from '@/components/UI';
import { DashboardLayout } from '@/layouts';
import { BuildRiskAcrossNavbar } from '@/modules/Models';
import {
  getAccessToken,
  getDataSourcesConfigInitialized,
  getDataSourcesFields,
  getDataSourcesSelect,
  newAttributeSelector,
  retrieveDataSources,
  getListsInitialized,
  retrieveLists,
  getListIds,
} from '@/redux/slices';
import { useAppDispatch, useAppSelector } from '@/hooks';
import attributeTypeToComponent, {
  riskIndicatorFunctionType,
} from '@/modules/Models/BuildRisk/RiskIndicatorByAttributeType';
import { riskValues } from '@/_mock/models.mock';
import { addNewRiskIndicator } from '@/redux/slices/attributes.slice';
import { AppDispatch } from '@/redux/store';
import { useRouter } from 'next/router';
import { CircularProgress, LinearProgress } from '@mui/material';

const Build = (): JSX.Element => {
  const router = useRouter();
  const dispatch: AppDispatch = useAppDispatch();
  const { isReady } = router;
  const riskItemSelected = useAppSelector(newAttributeSelector);
  const [riskItem, setRiskItem] = useState(riskItemSelected);
  const isDataSourceConfigInitialized = useAppSelector(
    getDataSourcesConfigInitialized
  );
  const isListsInitialized = useAppSelector(getListsInitialized);
  const lists = useAppSelector(getListIds);
  const stateResourceData = useAppSelector(getDataSourcesSelect);
  const stateFieldData = useAppSelector(getDataSourcesFields);
  const stateAccessToken = useAppSelector(getAccessToken);

  useEffect(() => {
    if (!isDataSourceConfigInitialized && stateAccessToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveDataSources({ accessToken: stateAccessToken }));
    }
  }, [isDataSourceConfigInitialized, dispatch, stateAccessToken]);

  useEffect(() => {
    if (!riskItemSelected && isReady) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        addNewRiskIndicator()
      );
    }
  }, [riskItemSelected, dispatch, isReady]);

  useEffect(() => {
    setRiskItem(riskItemSelected);
  }, [riskItemSelected]);

  useEffect(() => {
    if (isReady && stateAccessToken && !isListsInitialized) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveLists({
          accessToken: stateAccessToken,
          limit: 25,
        })
      );
    }
  }, [dispatch, stateAccessToken, isListsInitialized, isReady]);

  if (
    !stateResourceData ||
    !stateFieldData ||
    !isDataSourceConfigInitialized ||
    !isListsInitialized
  ) {
    return <LinearProgress />;
  }

  if (!riskItem) {
    return (
      <DashboardLayout
        title="Build a Risk Indicator"
        navbarBorder={false}
        navEls={<BuildRiskAcrossNavbar item={riskItem} />}
      >
        <CircularProgress />
      </DashboardLayout>
    );
  }

  const componentFn: riskIndicatorFunctionType | null =
    (riskItem &&
      riskItem.attributeType &&
      attributeTypeToComponent(riskItem?.attributeType ?? 'value')) ||
    null;

  const canDisplayComponent =
    componentFn &&
    riskItem &&
    isDataSourceConfigInitialized &&
    stateResourceData &&
    stateFieldData;

  return (
    riskItem && (
      <DashboardLayout
        title="Build a Risk Indicator"
        navbarBorder={false}
        navEls={<BuildRiskAcrossNavbar item={riskItem} />}
      >
        <UIContainer
          sx={{ background: '#FFFFFF', minHeight: 'calc(100vh - 136px)' }}
        >
          {canDisplayComponent &&
            componentFn(
              riskItem,
              stateResourceData,
              stateFieldData,
              riskValues,
              lists,
              false
            )}
        </UIContainer>
      </DashboardLayout>
    )
  );
};

export default Build;
