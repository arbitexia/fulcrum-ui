/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from '@/redux/store';
import { ReduxJson, ResponseStatus, UserJson } from '@/types';
import { userApi } from '@/redux/apis';
import { AxiosError } from 'axios';
import { checkAuthToken } from '@/libs/auth-token';

const initialState: ReduxJson.UserState = {
  users: {
    loading: false,
    data: null,
    status: null,
  },
  user: null,
  accessToken: '',
};

export const retrieveUsers = createAsyncThunk<
  UserJson.User[],
  UserJson.RetrieveUserParams,
  { dispatch: AppDispatch; state: RootState }
>('users/retrieveUsers', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await checkAuthToken();
    return await userApi.loadUsers(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

const userSlice = createSlice({
  name: `users`,
  initialState,
  reducers: {
    getUserById: (state, action: PayloadAction<string>) => {
      const { payload } = action;
      const user = state.users.data?.find(
        (candidateUser) => candidateUser.id === payload
      );
      state.user = user ? user : null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveUsers.pending, (state) => {
        state.users.loading = true;
        state.users.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveUsers.fulfilled,
        (state, { payload }: PayloadAction<UserJson.User[]>) => {
          state.users.loading = false;
          state.users.data = payload;
          state.users.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveUsers.rejected, (state) => {
        state.users.loading = false;
        state.users.status = ResponseStatus.FAILED;
      });
  },
});

export const userSelector = (state: RootState): ReduxJson.UserState =>
  state.users;

export default userSlice.reducer;
