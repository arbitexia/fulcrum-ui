/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from '@/redux/store';
import { ReduxJson, ResponseStatus } from '@/types';
import { graphApi } from '@/redux/apis';
import { AxiosError } from 'axios';
import { BubbleDataPoint, ChartData, ScatterDataPoint } from 'chart.js';
import { PeerDataType, GraphDataType, GetGraphParams } from '@/types';
import { BarChartDataSets, BarChartDataSet } from '@/types/scoring.type';
import { checkAuthToken } from '@/libs/auth-token';

const initialState: ReduxJson.GraphState = {
  loading: true,
  status: null,
  peerData: [],
  graphData: [],
};

export const retrievePeerData = createAsyncThunk<
  PeerDataType[],
  GetGraphParams,
  { dispatch: AppDispatch; state: RootState }
>('graph/getPeer', async (params: GetGraphParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await checkAuthToken();
    return await graphApi.loadPeerData(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const retrieveGraphData = createAsyncThunk<
  GraphDataType[],
  GetGraphParams,
  { dispatch: AppDispatch; state: RootState }
>('graph/getGraph', async (params: GetGraphParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await checkAuthToken();
    return await graphApi.loadGraphData(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

const graphSlice = createSlice({
  name: `graph`,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(retrievePeerData.pending, (state) => {
        state.loading = true;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrievePeerData.fulfilled,
        (state, { payload }: PayloadAction<PeerDataType[]>) => {
          state.loading = false;
          state.status = ResponseStatus.SUCCESS;
          state.peerData = payload;
        }
      )
      .addCase(retrievePeerData.rejected, (state) => {
        state.loading = false;
        state.status = ResponseStatus.FAILED;
        state.peerData = [];
      })
      .addCase(retrieveGraphData.pending, (state) => {
        state.loading = true;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveGraphData.fulfilled,
        (state, { payload }: PayloadAction<GraphDataType[]>) => {
          state.loading = false;
          state.status = ResponseStatus.SUCCESS;
          state.graphData = payload;
        }
      )
      .addCase(retrieveGraphData.rejected, (state) => {
        state.loading = false;
        state.status = ResponseStatus.FAILED;
        state.graphData = [];
      });
  },
});

export const peerChartLabelsSelector = (state: RootState): string[] => {
  const peerData = state?.graph?.peerData ?? [];
  return peerData.map((entity: PeerDataType) => entity.startDate);
};

const peerChartDataSetsSelector = (state: RootState): BarChartDataSets => {
  const peerData = state?.graph?.peerData ?? [];

  const barchartGroupDictionary: { [name: string]: number[] } = {};
  const backGroundColors: { [name: string]: string } = {};
  peerData.forEach((entity: PeerDataType) => {
    const { minimum, max, average, individual } = entity;
    if (!('Peer Minimum Score' in barchartGroupDictionary)) {
      barchartGroupDictionary['Peer Minimum Score'] = [parseInt(minimum)];
      backGroundColors['Peer Minimum Score'] = '#EDA200';
    } else
      barchartGroupDictionary['Peer Minimum Score'].push(parseInt(minimum));
    if (!('Peer Average Score' in barchartGroupDictionary)) {
      barchartGroupDictionary['Peer Average Score'] = [parseInt(average)];
      backGroundColors['Peer Average Score'] = '#75AC00';
    } else
      barchartGroupDictionary['Peer Average Score'].push(parseInt(average));
    if (!('Individual’s Score' in barchartGroupDictionary)) {
      barchartGroupDictionary["Individual's Score"] = [parseInt(individual)];
      backGroundColors["Individual's Score"] = '#0050BE';
    } else
      barchartGroupDictionary["Individual's Score"].push(parseInt(individual));
    if (!('Peer Max Score' in barchartGroupDictionary)) {
      barchartGroupDictionary['Peer Max Score'] = [parseInt(max)];
      backGroundColors['Peer Max Score'] = '#C62828';
    } else barchartGroupDictionary['Peer Max Score'].push(parseInt(max));
  });
  return Object.entries(barchartGroupDictionary).map(([label, data]) => {
    const backgroundColor = backGroundColors[label];
    const dataSet: BarChartDataSet = {
      label,
      data,
      borderColor: backgroundColor,
      backgroundColor,
    };
    return dataSet;
  });
};

export const peerChartDataSelector = (
  state: RootState
): ChartData<
  'line',
  (number | ScatterDataPoint | BubbleDataPoint | null)[]
> => ({
  labels: peerChartLabelsSelector(state),
  datasets: peerChartDataSetsSelector(state),
});

export const getPeerDataSelector: (state: RootState) => PeerDataType[] = (
  state: RootState
) => {
  return state?.graph.peerData ?? [];
};

export const graphChartLabelsSelector = (state: RootState): string[] => {
  const graphData = state?.graph?.graphData ?? [];
  return graphData.map((entity: GraphDataType) => entity.startDate);
};

const graphChartDataSetsSelector = (state: RootState): BarChartDataSets => {
  const graphData = state?.graph?.graphData ?? [];

  const barchartGroupDictionary: { [name: string]: number[] } = {};
  const backGroundColors: { [name: string]: string } = {};
  graphData.forEach((entity: GraphDataType) => {
    const { number, average, outlier2, outlier3 } = entity;
    if (!('Weekly' in barchartGroupDictionary)) {
      barchartGroupDictionary['Weekly'] = [parseInt(number)];
      backGroundColors['Weekly'] = '#2196F3';
    } else barchartGroupDictionary['Weekly'].push(parseInt(number));
    if (!('Average' in barchartGroupDictionary)) {
      barchartGroupDictionary['Average'] = [parseInt(average)];
      backGroundColors['Average'] = '#00AC65';
    } else barchartGroupDictionary['Average'].push(parseInt(average));
    if (!('Outlier2' in barchartGroupDictionary)) {
      barchartGroupDictionary['Outlier2'] = [parseInt(outlier2)];
      backGroundColors['Outlier2'] = '#F57C00';
    } else barchartGroupDictionary['Outlier2'].push(parseInt(outlier2));
    if (!('Outlier3' in barchartGroupDictionary)) {
      barchartGroupDictionary['Outlier3'] = [parseInt(outlier3)];
      backGroundColors['Outlier3'] = '#C62828';
    } else barchartGroupDictionary['Outlier3'].push(parseInt(outlier3));
  });
  return Object.entries(barchartGroupDictionary).map(([label, data]) => {
    const backgroundColor = backGroundColors[label];
    const dataSet: BarChartDataSet = {
      label,
      data,
      borderColor: backgroundColor,
      backgroundColor,
    };
    return dataSet;
  });
};

export const graphChartDataSelector = (
  state: RootState
): ChartData<
  'line',
  (number | ScatterDataPoint | BubbleDataPoint | null)[]
> => ({
  labels: graphChartLabelsSelector(state),
  datasets: graphChartDataSetsSelector(state),
});

export const getGraphDataSelector: (state: RootState) => GraphDataType[] = (
  state: RootState
) => {
  return state?.graph.graphData ?? [];
};

export default graphSlice.reducer;
