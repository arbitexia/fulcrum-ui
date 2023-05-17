/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { UIContainer } from '@/components/UI';
import { DashboardLayout } from '@/layouts';
import { BuildRiskHistoricalModal } from '@/modules/Models';
import { RiskIndicatorType } from '@/types';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  attributeByIdSelector,
  getDataSourcesConfigInitialized,
  getDataSourcesFields,
  getDataSourcesSelect,
  retrieveAttribute,
  retrieveDataSources,
  getAccessToken,
  getListsInitialized,
  retrieveLists,
  getListIds,
} from '@/redux/slices';
import attributeTypeToComponent, {
  riskIndicatorFunctionType,
} from '@/modules/Models/BuildRisk/RiskIndicatorByAttributeType';
import BuildRiskNavbar from '@/modules/Models/BuildRisk/BuildRiskNavBar';
import { riskValues } from '@/_mock/models.mock';
import { LinearProgress } from '@mui/material';

const Build = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { query, isReady } = router;
  const { id: attributeId = '' } = query as { id: string };
  const attribute: RiskIndicatorType | null =
    useAppSelector(attributeByIdSelector(attributeId)) || null;
  const isListsInitialized = useAppSelector(getListsInitialized);
  const lists = useAppSelector(getListIds);
  const [openHistory, setOpenHistory] = useState<boolean>(false);
  const [riskItem, setRiskItem] = useState<
    RiskIndicatorType | undefined | null
  >(attribute);
  const isDataSourceConfigInitialized = useAppSelector(
    getDataSourcesConfigInitialized
  );
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
    if (stateAccessToken && !isListsInitialized) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveLists({
          accessToken: stateAccessToken,
          limit: 25,
        })
      );
    }
  }, [dispatch, isListsInitialized, stateAccessToken]);

  const componentFn: riskIndicatorFunctionType | null =
    (riskItem &&
      riskItem.attributeType &&
      attributeTypeToComponent(riskItem.attributeType)) ||
    null;

  const canDisplayComponent =
    componentFn &&
    riskItem &&
    isDataSourceConfigInitialized &&
    stateResourceData &&
    stateFieldData;

  useEffect(() => {
    if (!attribute && isReady && attributeId && stateAccessToken) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveAttribute({
          accessToken: stateAccessToken,
          attributeId: attributeId,
        })
      );
    }
  }, [attribute, dispatch, isReady, attributeId, stateAccessToken]);

  useEffect(() => {
    setRiskItem(attribute);
  }, [attribute, setRiskItem]);

  if (
    !stateFieldData ||
    !stateResourceData ||
    !isDataSourceConfigInitialized ||
    !isListsInitialized
  ) {
    return <LinearProgress />;
  }

  return (
    <>
      {riskItem && (
        <DashboardLayout
          title="Build a Risk Indicator"
          navbarBorder={false}
          navEls={<BuildRiskNavbar item={riskItem} />}
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
            <BuildRiskHistoricalModal
              open={openHistory}
              onClose={() => setOpenHistory(false)}
            />
          </UIContainer>
        </DashboardLayout>
      )}
    </>
  );
};

export default Build;
