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
import { filterApi } from '@/redux/apis';
import { AxiosError } from 'axios';
import {
  Filter,
  RetrieveFiltersParams,
  RetrieveFilterParams,
  NewFilterParams,
  FilterAttributeType,
} from '@/types/models.type';
import { genRefreshToken } from '@/libs/auth-token';

const initialState: ReduxJson.FiltersState = {
  loading: true,
  status: null,
  filters: {},
  currentFilterId: null,
  newFilter: null,
};

export const retrieveFilters = createAsyncThunk<
  Filter[],
  RetrieveFiltersParams,
  { dispatch: AppDispatch; state: RootState }
>(
  'filters/retrieveFilters',
  async (params: RetrieveFiltersParams, thunkAPI) => {
    try {
      // TODO - define the api auth token
      return await filterApi.loadFiltersData(params);
    } catch (error) {
      const err = error as AxiosError;
      await genRefreshToken(err);
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const retrieveFilter = createAsyncThunk<
  Filter,
  RetrieveFilterParams,
  { dispatch: AppDispatch; state: RootState }
>('filters/retrieveFilter', async (params: RetrieveFilterParams, thunkAPI) => {
  try {
    return await filterApi.loadFilterData(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const saveFilter = createAsyncThunk<
  string,
  NewFilterParams,
  { dispatch: AppDispatch; state: RootState }
>('filters/newFilter', async (params: NewFilterParams, thunkAPI) => {
  try {
    return await filterApi.createFilter(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

type filterBuilderFunctionInputType = {
  inputFilter: Filter;
  value: number[] | string[] | string | number | undefined;
  listIndex?: number | undefined;
};

type filterBuilderFunctionType = (
  arg0: filterBuilderFunctionInputType
) => Filter;

const filterFunctionsByOperator: {
  [operationType: string]: filterBuilderFunctionType;
} = {
  changeFilterName: ({ inputFilter, value }) => {
    return {
      ...inputFilter,
      name: value as string,
    };
  },
  changeFilterDescription: ({ inputFilter, value }) => {
    return {
      ...inputFilter,
      description: value as string,
    };
  },
  changeFilterAttributeField: ({ inputFilter, value, listIndex }) => {
    const actualIndex = listIndex ?? -1;
    if (
      actualIndex >= 0 &&
      inputFilter.attributes &&
      inputFilter.attributes.length > 0 &&
      actualIndex < inputFilter.attributes.length
    ) {
      const attributesList = inputFilter.attributes;
      attributesList[actualIndex].field = value as number;
      return {
        ...inputFilter,
        attributes: attributesList as FilterAttributeType[],
      };
    } else return inputFilter;
  },
  changeFilterAttributeOption: ({ inputFilter, value, listIndex }) => {
    const actualIndex = listIndex ?? -1;
    if (
      actualIndex >= 0 &&
      inputFilter.attributes &&
      inputFilter.attributes.length > 0 &&
      actualIndex < inputFilter.attributes.length
    ) {
      const attributesList = inputFilter.attributes;
      attributesList[actualIndex].option = value as number;
      return {
        ...inputFilter,
        attributes: attributesList as FilterAttributeType[],
      };
    } else return inputFilter;
  },
  changeFilterAttributeValue: ({ inputFilter, value, listIndex }) => {
    const actualIndex = listIndex ?? -1;
    if (
      actualIndex >= 0 &&
      inputFilter.attributes &&
      inputFilter.attributes.length > 0 &&
      actualIndex < inputFilter.attributes.length
    ) {
      const attributesList = inputFilter.attributes;
      attributesList[actualIndex].value = value as string;
      return {
        ...inputFilter,
        attributes: attributesList as FilterAttributeType[],
      };
    } else return inputFilter;
  },
  appendFilterAttribute: ({ inputFilter }) => {
    const attributesList: FilterAttributeType[] = inputFilter.attributes
      ? [...inputFilter.attributes]
      : [];
    const newAttribute: FilterAttributeType = {
      id: attributesList.length,
      field: 1,
      option: 1,
      value: '',
    };

    attributesList.push(newAttribute as FilterAttributeType);

    return {
      ...inputFilter,
      attributes: attributesList as FilterAttributeType[],
    };
  },
  removeAttributeAtIndex: ({ inputFilter, listIndex }) => {
    const actualIndex = listIndex ?? -1;
    if (
      actualIndex >= 0 &&
      inputFilter.attributes &&
      inputFilter.attributes.length > 0 &&
      actualIndex < inputFilter.attributes.length
    ) {
      const attributesList: FilterAttributeType[] = inputFilter.attributes
        ? [...inputFilter.attributes]
        : [];
      attributesList.splice(actualIndex, 1);
      return {
        ...inputFilter,
        attributes: attributesList as FilterAttributeType[],
      };
    } else {
      return inputFilter;
    }
  },
};

const createNewFilterAttributeObject: () => FilterAttributeType = () => {
  const newAttribute: FilterAttributeType = {
    id: 0,
    field: 1,
    option: 1,
    value: '',
  };
  return newAttribute;
};

const createNewFilterObject: () => Filter = () => {
  const newFilter: Filter = {
    id: 'NEW',
    name: '',
    description: '',
    owner: '',
    attributes: [createNewFilterAttributeObject()],
  };
  return newFilter;
};

const filtersSlice = createSlice({
  name: `filters`,
  initialState,
  reducers: {
    addNewFilter: (state, _param) => {
      const newFilter: Filter = createNewFilterObject();
      state.newFilter = newFilter;
      return state;
    },
    filterValueChangeHandler: (state, param) => {
      const { payload } = param;
      const {
        operation,
        value,
        listIndex,
      }: {
        operation: string;
        value: string;
        listIndex: number;
      } = payload;
      if (state.newFilter) {
        const newFilter = filterFunctionsByOperator[operation]({
          inputFilter: state.newFilter,
          value,
          listIndex,
        });
        state.newFilter = newFilter;
        return state;
      }
      return state;
    },
    setSelectedFilterId: (state, param) => {
      const { payload } = param;
      const { filterId } = payload;
      state.newFilter = state.filters[filterId];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveFilters.pending, (state) => {
        state.loading = true;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveFilters.fulfilled,
        (state, { payload }: PayloadAction<Filter[]>) => {
          state.loading = true;
          const filtersByFilterId: { [id: string]: Filter } = {};
          let firstFilterId: string | null = null;
          payload.map((filter) => {
            const { filterId } = filter;
            if (filterId) {
              if (firstFilterId == null) {
                firstFilterId = filter.filterId;
              }
              filtersByFilterId[filterId] = filter;
            }
          });

          state.filters = filtersByFilterId;
          state.currentFilterId = firstFilterId;
          state.newFilter = null;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveFilters.rejected, (state) => {
        state.loading = false;
        state.filters = {};
        state.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveFilter.pending, (state) => {
        state.loading = true;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveFilter.fulfilled,
        (state, { payload }: PayloadAction<Filter>) => {
          state.loading = false;
          const { id } = payload;
          if (id) {
            state.filters = { [id]: payload };
          }
          state.currentFilterId = id;
          state.newFilter = null;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveFilter.rejected, (state) => {
        state.loading = false;
        state.filters = {};
        state.currentFilterId = null;
        state.newFilter = null;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(saveFilter.pending, (state) => {
        state.loading = true;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        saveFilter.fulfilled,
        (state, { payload }: PayloadAction<string>) => {
          state.loading = false;
          const id = payload as string;
          if (id && state.newFilter) {
            state.filters = {
              ...state.filters,
              [id]: { ...state.newFilter, id: id },
            };
            state.newFilter = null;
          }
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(saveFilter.rejected, (state) => {
        state.loading = false;
        state.status = ResponseStatus.FAILED;
      });
  },
});

export const filtersSelector = (state: RootState): Filter[] =>
  Object.values(state.filters?.filters);

export const currentFilterSelector = (state: RootState): Filter | undefined =>
  state.filters.newFilter;

export const filtersByIdSelector = (
  state: RootState
): { [id: string]: Filter } => state.filters?.filters ?? null;

export const filterByIdSelector =
  (filterId: string): ((state: RootState) => Filter | undefined) =>
  (state: RootState) =>
    state.filters?.filters && state.filters?.filters[filterId];

export const getCurrentFilterIdSelector =
  (filterId: string): ((state: RootState) => Filter | undefined) =>
  (state: RootState) => {
    if (filterId === 'NEW') {
      return state.filters.newFilter;
    }
    return state.filters?.filters && state.filters?.filters[filterId];
  };

export const { addNewFilter, filterValueChangeHandler, setSelectedFilterId } =
  filtersSlice.actions;
export default filtersSlice.reducer;
