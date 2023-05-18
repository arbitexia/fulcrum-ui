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
  dataSourceByAttributeIdSelector,
  getDataSourcesConfigInitialized,
  getDataSourcesFields,
  getDataSourcesSelect,
  retrieveAttribute,
  retrieveDataSources,
  getListsInitialized,
  retrieveLists,
  getListIds,
  getStatsInitialized,
  isStatsStatusPending,
  riskFieldByAttributeIdSelector,
  dataSource2ByAttributeIdSelector,
  riskField2ByAttributeIdSelector,
} from '@/redux/slices';
import attributeTypeToComponent, {
  riskIndicatorFunctionType,
} from '@/modules/Models/BuildRisk/RiskIndicatorByAttributeType';
import BuildRiskNavbar from '@/modules/Models/BuildRisk/BuildRiskNavBar';
import { riskValues } from '@/_mock/models.mock';
import { LinearProgress } from '@mui/material';
import { useCookies } from 'react-cookie';
import config from '@/config';
import { noop } from 'lodash';
import { getDataSourceStats } from '@/redux/slices/stat.slice';
import { EditValueItemProps } from '@/types/common.type';
import { EditValueModal } from '@/modules/Models/BuildRisk/EditValueModal';

const baseAuthenticationUrl: string = config.URLS.AUTHENTICATION || '';

const Build = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { query, isReady } = router as {
    query: { id?: string };
    isReady: boolean;
  };
  const { id: attributeId = '' } = query as { id: string };
  const [cookies] = useCookies(['accessToken']);
  const attribute: RiskIndicatorType | null =
    useAppSelector(attributeByIdSelector(attributeId)) || null;
  const isListsInitialized = useAppSelector(getListsInitialized);
  const lists = useAppSelector(getListIds);
  const [openHistory, setOpenHistory] = useState<boolean>(false);
  const [openHistory2, setOpenHistory2] = useState<boolean>(false);
  const [openEditValueModal, setOpenEditValueModal] = useState<boolean>(false);
  const [editModalValueProps, setEditModalValueProps] =
    useState<EditValueItemProps>({
      values: [],
      handleChange: noop,
    });
  const [riskItem, setRiskItem] = useState<
    RiskIndicatorType | undefined | null
  >(attribute);
  const isDataSourceConfigInitialized = useAppSelector(
    getDataSourcesConfigInitialized
  );
  const stateResourceData = useAppSelector(getDataSourcesSelect);
  const stateFieldData = useAppSelector(getDataSourcesFields);
  const dataSourceId = useAppSelector(
    dataSourceByAttributeIdSelector(attributeId)
  );
  const riskFieldId = useAppSelector(
    riskFieldByAttributeIdSelector(attributeId)
  );
  const dataSourceId2 = useAppSelector(
    dataSource2ByAttributeIdSelector(attributeId)
  );
  const riskFieldId2 = useAppSelector(
    riskField2ByAttributeIdSelector(attributeId)
  );
  const statsInitialized = useAppSelector(getStatsInitialized);
  const statsPending = useAppSelector(isStatsStatusPending);
  const { accessToken: cookieAccessToken = null } = cookies as {
    accessToken?: string | null;
  };

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
    if (cookieAccessToken && !isListsInitialized) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveLists({
          accessToken: cookieAccessToken,
          limit: 25,
        })
      );
    }
  }, [dispatch, isListsInitialized, cookieAccessToken]);

  useEffect(() => {
    if (
      isReady &&
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
    isReady,
    cookieAccessToken,
    dataSourceId,
    statsInitialized,
    statsPending,
  ]);

  useEffect(() => {
    if (!attribute && isReady && attributeId && cookieAccessToken) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveAttribute({
          accessToken: cookieAccessToken,
          attributeId: attributeId,
        })
      );
    }
  }, [attribute, dispatch, isReady, attributeId, cookieAccessToken]);

  useEffect(() => {
    setRiskItem(attribute);
  }, [attribute, setRiskItem]);

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
      attributeTypeToComponent(riskItem.attributeType)) ||
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
    !stateFieldData ||
    !stateResourceData ||
    !isDataSourceConfigInitialized ||
    !isListsInitialized ||
    !cookieAccessToken ||
    !statsInitialized ||
    !dataSourceStatsChangeFunction
  ) {
    return <LinearProgress />;
  }

  return (
    <>
      {riskItem && (
        <DashboardLayout
          title="Build a Risk Indicator"
          navbarBorder={false}
          navEls={
            <BuildRiskNavbar item={riskItem} accessToken={cookieAccessToken} />
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
            {dataSourceId2 && riskFieldId2 && statsInitialized && (
              <BuildRiskHistoricalModal
                open={openHistory2}
                dataSourceId={dataSourceId2}
                riskFieldId={riskFieldId2}
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
      )}
    </>
  );
};

export default Build;
