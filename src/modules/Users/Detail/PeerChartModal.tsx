/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { useEffect, useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  InteractionMode,
  Chart,
  TooltipModel,
  ChartData,
  ScatterDataPoint,
  BubbleDataPoint,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Typography, Box } from '@mui/material';
import {
  UIDefaultDialog,
  UIFlexCenterBox,
  UIScoreChip,
  UIFlexSpaceBox,
} from '@/components/UI';
import { GraphModalProps } from '@/types';
import { StyledLegendBox } from './ui';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  retrievePeerData,
  peerChartDataSelector,
  getPeerDataSelector,
  getAccessToken,
} from '@/redux/slices';
import { PeerDataType } from '@/types';
import { useRouter } from 'next/router';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type PeerTooltipDataType = {
  label: string;
  rank: string;
  score: number;
  average: number;
  max: number;
  min: number;
  left: number;
  top: number;
};

interface PeerTooltipProps {
  data: PeerTooltipDataType;
}

const PeerTooltip = ({
  data: peerToolTipData,
}: PeerTooltipProps): JSX.Element => {
  return (
    <Box
      sx={{
        width: '204px',
        height: '168px',
        padding: '8px 12px',
        position: 'absolute',
        background: '#FFFFFF',
        border: '1px solid #000000',
        top: peerToolTipData.top,
        left: peerToolTipData.left,
      }}
    >
      <Typography
        sx={{
          fontWeight: '700',
          fontSize: '14px',
          lineHeight: '24px',
          color: '#39474E',
        }}
      >
        {peerToolTipData.label}
        <br />
        {peerToolTipData.rank}
      </Typography>
      <UIFlexSpaceBox>
        <Typography>Risk Score</Typography>
        <Typography>{peerToolTipData.score}</Typography>
      </UIFlexSpaceBox>
      <UIFlexSpaceBox>
        <Typography>Peer Average Score</Typography>
        <Typography>{peerToolTipData.average}</Typography>
      </UIFlexSpaceBox>
      <UIFlexSpaceBox>
        <Typography>Peer Max Score</Typography>
        <Typography>{peerToolTipData.max}</Typography>
      </UIFlexSpaceBox>
      <UIFlexSpaceBox>
        <Typography>Peer Min Score</Typography>
        <Typography>{peerToolTipData.min}</Typography>
      </UIFlexSpaceBox>
    </Box>
  );
};

export const PeerChartModal = ({
  open,
  onClose,
  attribute,
}: GraphModalProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { query, isReady } = router;
  const { id: entityId = '' } = query as { id: string };
  const stateAccessToken = useAppSelector(getAccessToken);
  const peerChartData: ChartData<
    'line',
    (number | ScatterDataPoint | BubbleDataPoint | null)[]
  > = useAppSelector(peerChartDataSelector) || null;
  const peerData: PeerDataType[] = useAppSelector(getPeerDataSelector) || null;
  const [peerStateData, setPeerStateData] = useState<PeerDataType[]>(peerData);
  const [chartData, setChartData] =
    useState<
      ChartData<'line', (number | ScatterDataPoint | BubbleDataPoint | null)[]>
    >(peerChartData);

  useEffect(() => {
    if (isReady && entityId && stateAccessToken && attribute) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrievePeerData({
          accessToken: stateAccessToken,
          entityId,
          attributeId: attribute,
        })
      );
    }
  }, [dispatch, isReady, entityId, stateAccessToken, attribute]);

  useEffect(() => {
    setChartData(peerChartData);
    setPeerStateData(peerData);
  }, [peerChartData, setChartData, peerData, setPeerStateData]);

  const [tooltipData, setTooltipData] = useState<PeerTooltipDataType | null>(
    null
  );
  const chartRef = useRef(null);
  const options = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as InteractionMode,
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: false,
        external: (context: {
          chart: Chart;
          tooltip: TooltipModel<'line'>;
        }) => {
          if (!chartRef || !chartRef.current) return;
          const tooltipModel = context.tooltip;
          const index = tooltipModel.dataPoints[0].dataIndex;

          if (tooltipModel.opacity == 0) {
            setTooltipData(null);
            return;
          }

          const position = context.chart.canvas.getBoundingClientRect();
          const left =
            tooltipModel.caretX > position.width / 2
              ? tooltipModel.caretX - 204 + 83
              : tooltipModel.caretX + 83;
          const top =
            tooltipModel.caretY > position.height / 2
              ? tooltipModel.caretY - 168 + 83
              : tooltipModel.caretY + 83;
          const newData = {
            label:
              (chartData.labels && `${chartData.labels[index]}`) ?? 'MASKED',
            rank: '1 of 140(tier 3)',
            score: peerStateData[index]
              ? parseInt(peerStateData[index].individual)
              : 0,
            average: peerStateData[index]
              ? parseInt(peerStateData[index].average)
              : 0,
            max: peerStateData[index] ? parseInt(peerStateData[index].max) : 0,
            min: peerStateData[index]
              ? parseInt(peerStateData[index].minimum)
              : 0,
            left,
            top,
          };
          if (tooltipData?.top != top) setTooltipData(newData);
        },
      },
    },
  };
  return (
    <UIDefaultDialog
      open={open}
      onClose={onClose}
      title={`Peer Comparison - Number of ${attribute}`}
      modalWidth="1200px"
    >
      <Typography fontSize={14}>
        <b>Peer Group</b> - Business Area - San Jose
      </Typography>
      <Box sx={{ padding: '16px 60px' }}>
        <Line options={options} data={chartData} ref={chartRef} />
      </Box>
      {tooltipData ? <PeerTooltip data={tooltipData} /> : ''}
      <UIFlexCenterBox sx={{ gap: '73px' }}>
        <StyledLegendBox sx={{ width: '187px' }}>
          <UIScoreChip
            label=""
            bgColor="#EDA200"
            sx={{ marginRight: '14px', width: '24px', height: '24px' }}
          />
          Peer Minimum Score
        </StyledLegendBox>
        <StyledLegendBox sx={{ width: '187px' }}>
          <UIScoreChip
            label=""
            bgColor="#75AC00"
            sx={{ marginRight: '14px', width: '24px', height: '24px' }}
          />
          Peer Average Score
        </StyledLegendBox>
        <StyledLegendBox sx={{ width: '187px' }}>
          <UIScoreChip
            label=""
            bgColor="#0050BE"
            sx={{ marginRight: '14px', width: '24px', height: '24px' }}
          />
          Individual’s Score
        </StyledLegendBox>
        <StyledLegendBox sx={{ width: '187px' }}>
          <UIScoreChip
            label=""
            bgColor="#C62828"
            sx={{ marginRight: '14px', width: '24px', height: '24px' }}
          />
          Peer Max Score
        </StyledLegendBox>
      </UIFlexCenterBox>
    </UIDefaultDialog>
  );
};
