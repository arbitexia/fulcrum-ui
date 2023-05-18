/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { useEffect } from 'react';
import { ChartData, ScatterDataPoint, BubbleDataPoint } from 'chart.js';

import { Typography, Box } from '@mui/material';
import {
  UIDefaultDialog,
  UIScoreChip,
  UIFlexColumnBox,
  UIFlexWrapBox,
} from '@/components/UI';
import { StyledLegendBox, StyledLegendWrapper } from './ui';
import { useAppDispatch, useAppSelector } from '@/hooks';
import PeerChart from './PeerChart';
import {
  getPeerGroupHash,
  getPeerGroupHashCallFailedForModelId,
  retrievePeerAttributeData,
} from '@/redux/slices/scoring.slice';
import { PeerChartModalProps, PeerDataType } from '@/types/graph.type';
import {
  getChartDataSets,
  getPeerChartData,
  getPeerGroupId,
} from '@/redux/slices/stat.slice';
import { BarChartDataSet } from '@/types';

export const PeerChartModal = ({
  open,
  onClose,
  modelId,
  entityId,
  modelInstance,
  attribute,
  categoryIndex,
  accessToken = null,
}: PeerChartModalProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const peerGroupHashCallFailed = useAppSelector(
    getPeerGroupHashCallFailedForModelId(modelId)
  );
  const peerHash = useAppSelector(getPeerGroupHash);
  const peerGroupId: string | null = useAppSelector(getPeerGroupId(modelId));
  const peerChartData: ChartData<
    'bar',
    (number | ScatterDataPoint | BubbleDataPoint | BarChartDataSet | null)[]
  > =
    useAppSelector(getPeerChartData(modelId, entityId, categoryIndex)) || null;

  const chartDataSets: PeerDataType[] | null = useAppSelector(
    getChartDataSets(modelId, entityId, categoryIndex)
  );

  useEffect(() => {
    if (
      open &&
      entityId &&
      accessToken &&
      attribute &&
      modelId &&
      peerHash !== null &&
      modelInstance &&
      !peerGroupHashCallFailed
    ) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrievePeerAttributeData({
          accessToken,
          modelId,
          modelInstance,
          attributeName: attribute,
          peerHash,
          entityId,
        })
      );
    }
  }, [
    dispatch,
    open,
    accessToken,
    entityId,
    attribute,
    modelId,
    peerHash,
    modelInstance,
    peerGroupHashCallFailed,
  ]);

  return (
    <UIDefaultDialog
      open={open}
      onClose={onClose}
      title={`Peer Comparison - Number of ${attribute}`}
      modalWidth="1200px"
    >
      {peerGroupId && (
        <Typography fontSize={14}>
          <b>Peer Group</b> - {peerGroupId}
        </Typography>
      )}
      <UIFlexWrapBox sx={{ flexWrap: 'nowrap', minHeight: '500px' }}>
        <Box sx={{ padding: '16px 60px' }}>
          {peerChartData && chartDataSets && (
            <PeerChart
              chartData={peerChartData}
              chartDataSets={chartDataSets}
            />
          )}
        </Box>
        <StyledLegendWrapper>
          <UIFlexColumnBox sx={{ gap: '96px' }}>
            <StyledLegendBox sx={{ width: '187px' }}>
              <UIScoreChip
                label=""
                bgColor="#C62828"
                sx={{ marginRight: '14px', width: '24px', height: '24px' }}
              />
              Peer Max Score
            </StyledLegendBox>
            <StyledLegendBox sx={{ width: '187px' }}>
              <UIScoreChip
                label=""
                bgColor="#EDA200"
                sx={{ marginRight: '14px', width: '24px', height: '24px' }}
              />
              Person’s Score
            </StyledLegendBox>
            <StyledLegendBox sx={{ width: '187px' }}>
              <UIScoreChip
                label=""
                bgColor="#75AC00"
                sx={{ marginRight: '14px', width: '24px', height: '24px' }}
              />
              Peer Average Score
            </StyledLegendBox>
            {/*<StyledLegendBox sx={{ width: '187px' }}>*/}
            {/*  <UIScoreChip*/}
            {/*    label=""*/}
            {/*    bgColor="#0050BE"*/}
            {/*    sx={{ marginRight: '14px', width: '24px', height: '24px' }}*/}
            {/*  />*/}
            {/*  Peer Minimum Score*/}
            {/*</StyledLegendBox>*/}
          </UIFlexColumnBox>
        </StyledLegendWrapper>
      </UIFlexWrapBox>
    </UIDefaultDialog>
  );
};
