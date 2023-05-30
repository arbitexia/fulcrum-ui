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
import {
  BuildRiskAcrossNavbar,
  BuildRiskHistoricalModal,
} from '@/modules/Models';
import {
  getDataSourcesConfigInitialized,
  getDataSourcesFields,
  getDataSourcesSelect,
  newAttributeSelector,
  retrieveDataSources,
  getListsInitialized,
  retrieveLists,
  getListIds,
  getStatsInitialized,
  isStatsStatusPending,
  newAttributeDatasourceIdSelector,
  newAttributeDatasource2IdSelector,
  newAttributeRiskField2IdSelector,
  newAttributeAttributeTypeSelector,
} from '@/redux/slices';
import { useAppDispatch, useAppSelector } from '@/hooks';
import attributeTypeToComponent, {
  riskIndicatorFunctionType,
} from '@/modules/Models/BuildRisk/RiskIndicatorByAttributeType';
import { riskValues } from '@/_mock/models.mock';
import {
  addNewRiskIndicator,
  newAttributeRiskFieldIdSelector,
} from '@/redux/slices/attributes.slice';
import { AppDispatch } from '@/redux/store';
import { useRouter } from 'next/router';
import { CircularProgress, LinearProgress } from '@mui/material';
import config from '@/config';
import { noop } from 'lodash';
import { getDataSourceStats } from '@/redux/slices/stat.slice';
import { EditValueModal } from '@/modules/Models/BuildRisk/EditValueModal';
import { EditValueItemProps } from '@/types/common.type';
import { readCookie } from '@/libs/cookie-utils';

const baseAuthenticationUrl: string = config.URLS.AUTHENTICATION || '';

const Build = (): JSX.Element => {
  const router = useRouter();
  const dispatch: AppDispatch = useAppDispatch();
  const { isReady } = router as { isReady: boolean };
  const riskItemSelected = useAppSelector(newAttributeSelector);
  const [openHistory, setOpenHistory] = useState<boolean>(false);
  const [openHistory2, setOpenHistory2] = useState<boolean>(false);
  const [openEditValueModal, setOpenEditValueModal] = useState<boolean>(false);
  const [editModalValueProps, setEditModalValueProps] =
    useState<EditValueItemProps>({
      values: [],
      handleChange: noop,
    });
  const [riskItem, setRiskItem] = useState(riskItemSelected);
  const isDataSourceConfigInitialized = useAppSelector(
    getDataSourcesConfigInitialized
  );
  const lists = useAppSelector(getListIds);
  const attributeType = useAppSelector(newAttributeAttributeTypeSelector);
  const riskItemDataSourceId = useAppSelector(newAttributeDatasourceIdSelector);
  const riskItemRiskFieldId = useAppSelector(newAttributeRiskFieldIdSelector);
  const riskItemDataSourceId2 = useAppSelector(
    newAttributeDatasource2IdSelector
  );
  const riskItemRiskFieldId2 = useAppSelector(newAttributeRiskField2IdSelector);
  const isListsInitialized = useAppSelector(getListsInitialized);
  const stateResourceData = useAppSelector(getDataSourcesSelect);
  const stateFieldData = useAppSelector(getDataSourcesFields);
  const defaultDataSourceId =
    stateResourceData && stateResourceData.length > 0
      ? stateResourceData[0].id
      : null;

  const defaultRiskFieldId =
    defaultDataSourceId &&
    stateFieldData &&
    stateFieldData[defaultDataSourceId].length > 0
      ? stateFieldData[defaultDataSourceId][0].id
      : null;
  const dataSourceId = riskItemDataSourceId || defaultDataSourceId;
  const riskFieldId = riskItemRiskFieldId || defaultRiskFieldId;
  const dataSourceId2 = riskItemDataSourceId2 || defaultDataSourceId;
  const riskFieldId2 = riskItemRiskFieldId2 || defaultRiskFieldId;
  const statsInitialized = useAppSelector(getStatsInitialized);
  const statsPending = useAppSelector(isStatsStatusPending);
  const cookieAccessToken = readCookie('accessToken');

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
    if (!isDataSourceConfigInitialized && cookieAccessToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveDataSources({ accessToken: cookieAccessToken }));
    }
  }, [isDataSourceConfigInitialized, dispatch, cookieAccessToken]);

  useEffect(() => {
    if (!riskItemSelected && dataSourceId && riskFieldId && isReady) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        addNewRiskIndicator({ dataSourceId, riskFieldId })
      );
    }
  }, [riskItemSelected, dispatch, isReady, dataSourceId, riskFieldId]);
  useEffect(() => {
    setRiskItem(riskItemSelected);
  }, [riskItemSelected]);

  useEffect(() => {
    if (isReady && cookieAccessToken && !isListsInitialized) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveLists({
          accessToken: cookieAccessToken,
          limit: 25,
        })
      );
    }
  }, [dispatch, cookieAccessToken, isListsInitialized, isReady]);

  useEffect(() => {
    if (
      cookieAccessToken &&
      dataSourceId &&
      !statsInitialized &&
      !statsPending
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getDataSourceStats({
          accessToken: cookieAccessToken,
          sourceId: dataSourceId,
        })
      );
    }
  }, [
    dispatch,
    cookieAccessToken,
    dataSourceId,
    statsInitialized,
    statsPending,
  ]);

  const dataSourceStatsChangeFunction = (sourceId: string): void => {
    if (cookieAccessToken && sourceId) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getDataSourceStats({
          accessToken: cookieAccessToken,
          sourceId,
        })
      );
    }
  };

  const toggleHistoryModal = (): void =>
    setOpenHistory((prevOpenHistory) => !prevOpenHistory);
  const toggleHistoryModal2 = (): void =>
    setOpenHistory2((prevOpenHistory) => !prevOpenHistory);

  const setEditModalValuePropsPromise = (
    args: EditValueItemProps
  ): Promise<unknown> => {
    return new Promise<void>((resolve) => {
      setEditModalValueProps(args);
      resolve();
    });
  };

  const openEditModalValueProps = (args: EditValueItemProps): void => {
    setEditModalValuePropsPromise(args).then(() => setOpenEditValueModal(true));
  };

  const closeEditModalValue = (): void => {
    setOpenEditValueModal(false);
  };

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
    stateFieldData &&
    statsInitialized &&
    dataSourceStatsChangeFunction;

  if (
    !stateResourceData ||
    !stateFieldData ||
    !isDataSourceConfigInitialized ||
    !isListsInitialized ||
    !cookieAccessToken ||
    !statsInitialized ||
    !toggleHistoryModal ||
    !toggleHistoryModal2 ||
    !dataSourceStatsChangeFunction
  ) {
    return <LinearProgress />;
  }

  if (!riskItem) {
    return (
      <DashboardLayout
        title="Build a Risk Indicator"
        navbarBorder={false}
        navEls={
          <BuildRiskAcrossNavbar
            item={riskItem}
            accessToken={cookieAccessToken}
          />
        }
      >
        <CircularProgress />
      </DashboardLayout>
    );
  }

  const canDisplaySecondModalSimilarity =
    attributeType === 'similarity' ? dataSourceId && riskFieldId2 : false;
  const canDisplaySecondModalDiscrepancy =
    attributeType === 'discrepancy' ? dataSourceId2 && riskFieldId2 : false;
  const canDisplaySecondModal =
    (canDisplaySecondModalSimilarity || canDisplaySecondModalDiscrepancy) &&
    statsInitialized;
  const secondModalDataSourceId =
    attributeType === 'discrepancy' ? dataSourceId2 : dataSourceId;

  return (
    riskItem && (
      <DashboardLayout
        title="Build a Risk Indicator"
        navbarBorder={false}
        navEls={
          <BuildRiskAcrossNavbar
            item={riskItem}
            accessToken={cookieAccessToken}
          />
        }
      >
        <UIContainer
          disableGutters
          sx={{
            background: '#FFFFFF',
            minHeight: 'calc(100vh - 136px)',
            marginTop: '15px',
            paddingLeft: '36px',
          }}
        >
          {canDisplayComponent &&
            componentFn(
              riskItem,
              stateResourceData,
              stateFieldData,
              riskValues,
              lists,
              toggleHistoryModal,
              toggleHistoryModal2,
              openEditModalValueProps,
              dataSourceStatsChangeFunction,
              false
            )}
          {dataSourceId && riskFieldId && statsInitialized && (
            <BuildRiskHistoricalModal
              open={openHistory}
              dataSourceId={dataSourceId}
              riskFieldId={riskFieldId}
              onClose={() => setOpenHistory(false)}
            />
          )}
          {canDisplaySecondModal && (
            <BuildRiskHistoricalModal
              open={openHistory2}
              dataSourceId={secondModalDataSourceId || ''}
              riskFieldId={riskFieldId2 || ''}
              onClose={() => setOpenHistory2(false)}
            />
          )}
          {lists !== null && (
            <EditValueModal
              open={openEditValueModal}
              onClose={closeEditModalValue}
              lists={lists}
              itemProps={editModalValueProps}
            />
          )}
        </UIContainer>
      </DashboardLayout>
    )
  );
};

export default Build;
