/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '@/redux/store';
import { PaletteMode } from '@mui/material';
import { ReduxJson } from '@/types';

export enum ThemeMode {
  LIGHT = `light`,
  DARK = `dark`,
}

const initialState: ReduxJson.AppState = {
  theme: {
    mode: `light`,
    loading: false,
  },
};

const appSlice = createSlice({
  name: `app`,
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<PaletteMode>) => {
      const { payload } = action;
      state.theme.mode = payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      const { payload } = action;
      state.theme.loading = payload;
    },
  },
});

const { setThemeMode, setLoading } = appSlice.actions;

export const toggleThemeMode = (): AppThunk => (dispatch, getState) => {
  const { mode } = getState().app.theme;
  let themeMode = ThemeMode.LIGHT;
  if (mode === ThemeMode.LIGHT) {
    themeMode = ThemeMode.DARK;
  }

  dispatch(setThemeMode(themeMode));
};

export const setUILoading =
  (loading: boolean): AppThunk =>
  (dispatch) => {
    dispatch(setLoading(loading));
  };

export const appSelector = (state: RootState): ReduxJson.AppState => state.app;
export default appSlice.reducer;
