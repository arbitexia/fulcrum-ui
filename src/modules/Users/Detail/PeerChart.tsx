/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  InteractionMode,
  Chart,
  TooltipModel,
  ChartOptions,
  Plugin,
  ChartData,
  ScatterDataPoint,
  BubbleDataPoint,
} from 'chart.js';
import { Chart as ReactChart } from 'react-chartjs-2';
import { Typography, Box } from '@mui/material';
import { UIFlexSpaceBox } from '@/components/UI';
import { BarChartDataSet, PeerDataType } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
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

type ChartPosition = {
  x: number;
  y: number;
  width?: number;
};

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
        <Typography>Peer Max Score</Typography>
        <Typography>{peerToolTipData.max}</Typography>
      </UIFlexSpaceBox>
      <UIFlexSpaceBox>
        <Typography>Risk Score</Typography>
        <Typography sx={{ fontWeight: 'bold' }}>
          {peerToolTipData.score}
        </Typography>
      </UIFlexSpaceBox>
      <UIFlexSpaceBox>
        <Typography>Peer Average Score</Typography>
        <Typography>{peerToolTipData.average}</Typography>
      </UIFlexSpaceBox>
      {/*<UIFlexSpaceBox>*/}
      {/*  <Typography>Peer Min Score</Typography>*/}
      {/*  <Typography>{peerToolTipData.min}</Typography>*/}
      {/*</UIFlexSpaceBox>*/}
    </Box>
  );
};

const PeerChart = ({
  chartData,
  chartDataSets,
}: {
  chartData: ChartData<
    'bar',
    (number | ScatterDataPoint | BubbleDataPoint | BarChartDataSet | null)[],
    unknown
  >;
  chartDataSets: PeerDataType[];
}): JSX.Element => {
  const [tooltipData, setTooltipData] = useState<PeerTooltipDataType | null>(
    null
  );

  const chartRef = useRef(null);
  const options: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Score',
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
        position: 'right',
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
          const index = tooltipModel.dataPoints[0].dataIndex;
          if (!chartRef || !chartRef.current) return;

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
            rank: `${chartDataSets[index].rank ?? 0} of 140 (ties ${
              chartDataSets[index].ties ?? 0
            })`,
            score: chartDataSets[index] ? chartDataSets[index].individual : 0,
            average: chartDataSets[index] ? chartDataSets[index].average : 0,
            max: chartDataSets[index] ? chartDataSets[index].max : 0,
            min: 0, // chartDataSets[index] ? chartDataSets[index].minimum : 0,
            left,
            top,
          };
          if (tooltipData?.top != top) setTooltipData(newData);
        },
      },
    },
  };
  const plugins: Plugin[] = [
    {
      id: 'redrawPeerGraph',
      beforeDatasetsDraw: (chart: Chart) => {
        const datasetMetas = chart.getSortedVisibleDatasetMetas();
        const ctx = chart.ctx;
        ctx.save();
        if (!datasetMetas) {
          return false;
        }
        datasetMetas[0]?.data?.forEach((data, index) => {
          const {
            x: x1,
            y: y1,
            width,
          }: ChartPosition = data.getProps(['x', 'y']) as ChartPosition;
          const { x: x2, y: y2 }: ChartPosition = datasetMetas[1].data[
            index
          ].getProps(['x', 'y']) as ChartPosition;
          const { y: y3 }: ChartPosition = datasetMetas[2].data[index].getProps(
            ['x', 'y']
          ) as ChartPosition;
          // const { y: y4 }: ChartPosition = datasetMetas[3].data[index].getProps(
          //   ['x', 'y']
          // ) as ChartPosition;
          ctx.strokeStyle = '#B5E0F8';
          ctx.lineWidth = 1;
          ctx.strokeRect(x1, y1, 1, y3 - y1);
          ctx.fillStyle = '#BFBFBF';
          ctx.fillRect(
            x2 - (width ?? 0) / 2 - 1,
            y2 ?? 0,
            (width ?? 0) + 2,
            y3 - y2
          );
        });
        datasetMetas.forEach((meta) => {
          meta.data.forEach((data) => {
            const { x, y, width }: ChartPosition = data.getProps([
              'x',
              'y',
              'width',
            ]) as ChartPosition;
            ctx.strokeStyle = data.options.backgroundColor as string;
            ctx.lineWidth = 2;
            ctx.strokeRect(x - (width ?? 0) / 2, y, width ?? 0, 2);
          });
        });
        ctx.restore();
        return false;
      },
    },
  ];
  return (
    <Box sx={{ padding: '20px 20px', minWidth: '900px' }}>
      <ReactChart
        type="bar"
        options={options}
        data={chartData}
        ref={chartRef}
        plugins={plugins}
      />
      {tooltipData ? <PeerTooltip data={tooltipData} /> : ''}
    </Box>
  );
};

export default PeerChart;
