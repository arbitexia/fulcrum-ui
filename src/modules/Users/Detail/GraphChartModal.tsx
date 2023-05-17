/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { useState, useRef, useEffect } from 'react';
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
import { Box, Typography } from '@mui/material';
import {
  UIDefaultDialog,
  UIFlexSpaceBox,
  UIFlexCenterBox,
  UIScoreChip,
} from '@/components/UI';
import { GraphModalProps } from '@/types';
import { StyledLegendBox } from './ui';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  retrieveGraphData,
  graphChartDataSelector,
  getGraphDataSelector,
  getAccessToken,
} from '@/redux/slices';
import { GraphDataType } from '@/types';
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

type GraphTooltipDataType = {
  label: string;
  emails: number;
  average: number;
  deviation: number;
  zscore: number;
  left: number;
  top: number;
};

interface GraphTooltipProps {
  data: GraphTooltipDataType;
}

const GraphTooltip = ({
  data: graphTooltipData,
}: GraphTooltipProps): JSX.Element => {
  return (
    <Box
      sx={{
        width: '257px',
        height: '129px',
        padding: '3px 12px',
        position: 'absolute',
        background: '#FFFFFF',
        border: '1px solid #000000',
        top: graphTooltipData.top,
        left: graphTooltipData.left,
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
        {graphTooltipData.label}
      </Typography>
      <UIFlexSpaceBox>
        <Typography>Number of Emails Sent</Typography>
        <Typography>{graphTooltipData.emails}</Typography>
      </UIFlexSpaceBox>
      <UIFlexSpaceBox>
        <Typography>Weekly Average</Typography>
        <Typography>{graphTooltipData.average}</Typography>
      </UIFlexSpaceBox>
      <UIFlexSpaceBox>
        <Typography>Standard Deviation</Typography>
        <Typography>{graphTooltipData.deviation}</Typography>
      </UIFlexSpaceBox>
      <UIFlexSpaceBox>
        <Typography>Z-score</Typography>
        <Typography>{graphTooltipData.zscore}</Typography>
      </UIFlexSpaceBox>
    </Box>
  );
};

export const GraphChartModal = ({
  open,
  onClose,
  attribute,
}: GraphModalProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { query, isReady } = router;
  const { id: entityId = '' } = query as { id: string };
  const stateAccessToken = useAppSelector(getAccessToken);
  const graphChartData: ChartData<
    'line',
    (number | ScatterDataPoint | BubbleDataPoint | null)[]
  > = useAppSelector(graphChartDataSelector) || null;
  const graphData: GraphDataType[] =
    useAppSelector(getGraphDataSelector) || null;
  const [graphStateData, setGraphStateData] =
    useState<GraphDataType[]>(graphData);
  const [chartData, setChartData] =
    useState<
      ChartData<'line', (number | ScatterDataPoint | BubbleDataPoint | null)[]>
    >(graphChartData);

  useEffect(() => {
    if (isReady && entityId && stateAccessToken && attribute) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveGraphData({
          accessToken: stateAccessToken,
          entityId,
          attributeId: attribute,
        })
      );
    }
  }, [dispatch, isReady, entityId, stateAccessToken, attribute]);

  useEffect(() => {
    setChartData(graphChartData);
    setGraphStateData(graphData);
  }, [graphChartData, setChartData, graphData, setGraphStateData]);

  const [tooltipData, setTooltipData] = useState<GraphTooltipDataType | null>(
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
          const tooltipModel = context.tooltip;
          if (!chartRef || !chartRef.current) return;

          if (tooltipModel.opacity == 0) {
            setTooltipData(null);
            return;
          }

          const index = tooltipModel.dataPoints[0].dataIndex;

          const position = context.chart.canvas.getBoundingClientRect();
          const left =
            tooltipModel.caretX > position.width / 2
              ? tooltipModel.caretX - 257 + 83
              : tooltipModel.caretX + 83;
          const top =
            tooltipModel.caretY > position.height / 2
              ? tooltipModel.caretY - 129 + 83
              : tooltipModel.caretY + 83;
          const newData = {
            label:
              graphStateData[index] &&
              `${graphStateData[index].startDate} - ${graphStateData[index].endDate}`,
            emails:
              graphStateData[index] && parseInt(graphStateData[index].number),
            average:
              graphStateData[index] && parseInt(graphStateData[index].average),
            deviation:
              graphStateData[index] &&
              parseInt(graphStateData[index].standDeviation),
            zscore:
              graphStateData[index] && parseInt(graphStateData[index].zScore),
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
      title={`Number of ${attribute}`}
      modalWidth="1200px"
    >
      <Box sx={{ padding: '16px 60px' }}>
        <Line options={options} data={chartData} ref={chartRef} />
      </Box>
      {tooltipData ? <GraphTooltip data={tooltipData} /> : ''}
      <UIFlexCenterBox>
        <StyledLegendBox sx={{ width: '167px' }}>
          <UIScoreChip
            label=""
            bgColor="#2196F3"
            sx={{ margin: '0 14px', width: '24px', height: '24px' }}
          />
          Weekly Emails
        </StyledLegendBox>

        <StyledLegendBox sx={{ width: '167px' }}>
          <UIScoreChip
            label=""
            bgColor="#00AC65"
            sx={{ margin: '0 14px', width: '24px', height: '24px' }}
          />
          Average
        </StyledLegendBox>
        <StyledLegendBox sx={{ width: '167px' }}>
          <UIScoreChip
            label=""
            bgColor="#F57C00"
            sx={{ margin: '0 14px', width: '24px', height: '24px' }}
          />
          Outlier 2x
        </StyledLegendBox>
        <StyledLegendBox sx={{ width: '167px' }}>
          <UIScoreChip
            label=""
            bgColor="#C62828"
            sx={{ margin: '0 14px', width: '24px', height: '24px' }}
          />
          Outlier 3x
        </StyledLegendBox>
      </UIFlexCenterBox>
    </UIDefaultDialog>
  );
};
