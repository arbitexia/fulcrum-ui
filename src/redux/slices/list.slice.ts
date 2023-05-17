/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from '@/redux/store';
import {
  ReduxJson,
  ResponseStatus,
  RetrieveListsParams,
  List,
  RetrieveListParams,
  NewListParams,
  DeleteListParams,
} from '@/types';
import { listApi } from '@/redux/apis';
import { AxiosError } from 'axios';
import { checkAuthToken } from '@/libs/auth-token';

const initialState: ReduxJson.ListsState = {
  loading: false,
  status: null,
  listsInitialized: false,
  selectedListId: null,
  listsById: {},
  newList: null,
};

export const retrieveLists = createAsyncThunk<
  List[],
  RetrieveListsParams,
  { dispatch: AppDispatch; state: RootState }
>('list/retrieveLists', async (params: RetrieveListsParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await checkAuthToken();
    return await listApi.loadLists(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const retrieveList = createAsyncThunk<
  List,
  RetrieveListParams,
  { dispatch: AppDispatch; state: RootState }
>('list/retrieveList', async (params: RetrieveListParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await checkAuthToken();
    return await listApi.loadList(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const newList = createAsyncThunk<
  void,
  NewListParams,
  { dispatch: AppDispatch; state: RootState }
>('list/newList', async (params: NewListParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await checkAuthToken();
    await listApi.newList(params);
    return;
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const deleteList = createAsyncThunk<
  string,
  DeleteListParams,
  { dispatch: AppDispatch; state: RootState }
>('list/deleteList', async (params: DeleteListParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await checkAuthToken();
    return await listApi.deleteList(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

const createNewListObject = (): List => {
  return {
    listId: null,
    description: '',
    status: '',
    owner: '',
    listValues: '',
  };
};

type listFunctionInputType = {
  inputList: List;
  value: string;
};

type listBuilderFunctionType = (arg0: listFunctionInputType) => List;

const listFunctionsByOperator: {
  [operation: string]: listBuilderFunctionType;
} = {
  updateValueListId: ({ inputList, value }) => {
    return {
      ...inputList,
      listId: value as string,
    };
  },
  updateValueListDescription: ({ inputList, value }) => {
    return {
      ...inputList,
      description: value as string,
    };
  },
  updateListValues: ({ inputList, value }) => {
    const stringValue: string = value as string;
    const listValues = stringValue.split('\n').join(',');
    return {
      ...inputList,
      listValues,
    };
  },
};

const listsSlice = createSlice({
  name: `list`,
  initialState,
  reducers: {
    addNewList: (state) => {
      const newListCreated: List = createNewListObject();
      return {
        ...state,
        newList: newListCreated,
      };
    },
    setSelectedListId: (state, param) => {
      const { payload } = param;
      const { id } = payload;
      return {
        ...state,
        selectedListId: id,
      };
    },
    listValueChanger: (state, param) => {
      const { payload } = param;
      const {
        operation,
        id,
        value,
      }: {
        operation: string;
        id: string;
        value: string;
      } = payload;
      if (id == null && state.newList) {
        const newOperatedList: List = listFunctionsByOperator[operation]({
          inputList: state.newList,
          value,
        });
        return {
          ...state,
          newList: newOperatedList,
        };
      } else if (id != null) {
        const newOperatedList: List = listFunctionsByOperator[operation]({
          inputList: state.listsById[id],
          value,
        });
        return {
          ...state,
          selectedListId: id,
          listsById: { ...state.listsById, [id]: newOperatedList },
        };
      }
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveLists.pending, (state) => {
        state.loading = true;
        state.listsInitialized = false;
        state.selectedListId = null;
        state.listsById = {};
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveLists.fulfilled,
        (state, { payload }: PayloadAction<List[]>) => {
          state.loading = true;
          state.listsInitialized = true;
          state.selectedListId = null;
          const listsById: { [id: string]: List } = {};
          payload.forEach((list) => {
            if (list.listId) {
              const id: string = list.listId;
              listsById[id] = list;
            }
          });
          state.listsById = listsById;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveLists.rejected, (state) => {
        state.loading = false;
        state.listsInitialized = true;
        state.selectedListId = null;
        state.listsById = {};
        state.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveList.pending, (state) => {
        state.loading = true;
        state.listsInitialized = false;
        state.selectedListId = null;
        state.listsById = {};
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveList.fulfilled,
        (state, { payload }: PayloadAction<List>) => {
          state.loading = true;
          state.listsInitialized = true;
          if (payload.listId) {
            state.selectedListId = payload.listId;
            state.listsById[payload.listId] = payload;
          } else {
            state.selectedListId = null;
          }
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveList.rejected, (state) => {
        state.loading = false;
        state.listsInitialized = true;
        state.selectedListId = null;
        state.listsById = {};
        state.status = ResponseStatus.FAILED;
      })
      .addCase(newList.pending, (state) => {
        state.loading = true;
        state.listsInitialized = false;
        state.selectedListId = null;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(newList.fulfilled, (state, _action: PayloadAction<void>) => {
        state.loading = true;
        state.listsInitialized = false;
        state.selectedListId = null;
        state.newList = null;
        state.status = ResponseStatus.SUCCESS;
      })
      .addCase(newList.rejected, (state) => {
        state.loading = false;
        state.listsInitialized = true;
        state.selectedListId = null;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(deleteList.pending, (state) => {
        state.loading = true;
        state.listsInitialized = false;
        state.selectedListId = null;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        deleteList.fulfilled,
        (state, { payload }: PayloadAction<string>) => {
          const listId = payload as string;
          state.loading = true;
          state.listsInitialized = false;
          state.selectedListId = null;
          const { [listId]: _deletedList, ...newLists } = state.listsById;
          state.listsById = newLists;
          state.newList = null;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(deleteList.rejected, (state) => {
        state.loading = false;
        state.listsInitialized = true;
        state.selectedListId = null;
        state.status = ResponseStatus.FAILED;
      });
  },
});

export const getListsInitialized = (state: RootState): boolean =>
  state.lists.listsInitialized;

export const listsSelector = (state: RootState): List[] =>
  Object.values(state.lists.listsById);

export const getNewList = (state: RootState): List | null =>
  state.lists.newList;

export const getSelectedListById =
  (id: string | null) =>
  (state: RootState): List | undefined => {
    if (id != null) {
      return state.lists.listsById[id];
    }
  };
export const getSelectedListNameById =
  (id: string | null) =>
  (state: RootState): string | undefined => {
    if (id != null && id in state.lists.listsById) {
      return state.lists.listsById[id].listId;
    }
  };

export const getSelectedListId = (state: RootState): string | null =>
  state.lists.selectedListId;

export const getListIds = (state: RootState): { id: string; label: string }[] =>
  Object.keys(state.lists.listsById).map((key) => ({ id: key, label: key }));

export const { addNewList, listValueChanger, setSelectedListId } =
  listsSlice.actions;
export default listsSlice.reducer;
