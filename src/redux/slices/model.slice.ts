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
  AttributesType,
  ReduxJson,
  ResponseStatus,
  RiskIndicatorType,
} from '@/types';
import { modelApi } from '@/redux/apis';
import { AxiosError } from 'axios';
import {
  DeleteModelParams,
  FullAttributesType,
  FullModel,
  FullRiskIndicator,
  Model,
  NewModelParams,
  RetrieveModelParams,
  RetrieveModelsParams,
  RiskIndicatorModelType,
} from '@/types/models.type';
import { UISelectInterface } from '@/types/common.type';
import { keyComparator } from '@/libs/sort-utils';
import { checkAuthToken } from '@/libs/auth-token';

const initialState: ReduxJson.ModelsState = {
  loading: true,
  initialized: false,
  status: null,
  models: {},
  selectedModelId: null,
  newModel: null,
};

export const retrieveModels = createAsyncThunk<
  Model[],
  RetrieveModelsParams,
  { dispatch: AppDispatch; state: RootState }
>('model/retrieveModels', async (params: RetrieveModelsParams, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await checkAuthToken();
    return await modelApi.loadModelsData(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const retrieveModel = createAsyncThunk<
  Model,
  RetrieveModelParams,
  { dispatch: AppDispatch; state: RootState }
>('model/retrieveModel', async (params: RetrieveModelParams, thunkAPI) => {
  try {
    return await modelApi.loadModelData(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const saveModel = createAsyncThunk<
  string,
  NewModelParams,
  { dispatch: AppDispatch; state: RootState }
>('model/newModel', async (params: NewModelParams, thunkAPI) => {
  try {
    return await modelApi.createModel(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const modifyModel = createAsyncThunk<
  Model,
  NewModelParams,
  { dispatch: AppDispatch; state: RootState }
>('model/modifyModel', async (params: NewModelParams, thunkAPI) => {
  try {
    return await modelApi.modifyModel(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const deleteModel = createAsyncThunk<
  string,
  DeleteModelParams,
  { dispatch: AppDispatch; state: RootState }
>('model/deleteModel', async (params: DeleteModelParams, thunkAPI) => {
  try {
    return await modelApi.deleteModel(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

type modelBuilderFunctionType = {
  inputModel: Model;
  value: number[] | string[] | string | number | undefined;
  categoryListIndex?: number | undefined;
  riskIndicatorListIndex?: number | undefined;
};

type riskIndicatorBuilderFunctionType = (
  arg0: modelBuilderFunctionType
) => Model;

const modelFunctionsByOperator: {
  [operationType: string]: riskIndicatorBuilderFunctionType;
} = {
  changeModelName: ({ inputModel, value }) => {
    return {
      ...inputModel,
      name: value as string,
    };
  },
  changeModelDescription: ({ inputModel, value }) => {
    return {
      ...inputModel,
      description: value as string,
    };
  },
  appendModelCategory: ({ inputModel }) => {
    const attributesList: AttributesType[] = inputModel.attributes
      ? [...inputModel.attributes]
      : [];
    const newAttribute: AttributesType = {
      attributeType: 'category',
      name: '',
      description: '',
      owner: '',
      attributes: [
        {
          attributeId: '',
          weight: 1.0,
        },
      ],
      weight: 1.0,
    };
    if (attributesList.length === 0) {
      attributesList.push(newAttribute as AttributesType);
    }
    attributesList.push(newAttribute as AttributesType);

    return {
      ...inputModel,
      attributes: attributesList as AttributesType[],
    };
  },
  changeModelCategoryNameAtIndex: ({
    inputModel,
    categoryListIndex,
    value,
  }) => {
    const actualIndex = categoryListIndex ?? -1;
    const attributesList: AttributesType[] = inputModel.attributes
      ? [...inputModel.attributes]
      : [];
    const matchItem: AttributesType =
      actualIndex >= 0 &&
      attributesList.length > 0 &&
      actualIndex < attributesList.length
        ? attributesList[actualIndex]
        : {
            attributeType: 'category',
            name: value as string,
            description: '',
            owner: '',
            attributes: [
              {
                attributeId: '',
                weight: 1.0,
              },
            ],
            weight: 1.0,
          };

    const newAttribute: AttributesType = {
      ...matchItem,
      name: value as string,
    };

    if (
      actualIndex >= 0 &&
      attributesList.length > 0 &&
      actualIndex < attributesList.length
    ) {
      attributesList[actualIndex] = newAttribute as AttributesType;
    } else if (attributesList.length === 0) {
      attributesList.push(newAttribute);
    }

    return {
      ...inputModel,
      attributes: attributesList as AttributesType[],
    };
  },
  changeModelCategoryWeightAtIndex: ({
    inputModel,
    categoryListIndex,
    value,
  }) => {
    const actualIndex = categoryListIndex ?? -1;
    const attributesList: AttributesType[] = inputModel.attributes
      ? [...inputModel.attributes]
      : [];
    const matchItem: AttributesType =
      actualIndex >= 0 &&
      attributesList.length > 0 &&
      actualIndex < attributesList.length
        ? attributesList[actualIndex]
        : {
            attributeType: 'category',
            name: '',
            description: '',
            owner: '',
            attributes: [
              {
                attributeId: '',
                weight: 1.0,
              },
            ],
            weight: 1.0,
          };

    const newAttribute: AttributesType = {
      ...matchItem,
      weight: value as number,
    };

    if (
      actualIndex >= 0 &&
      attributesList.length > 0 &&
      actualIndex < attributesList.length
    ) {
      attributesList[actualIndex] = newAttribute as AttributesType;
    } else if (attributesList.length === 0) {
      attributesList.push(newAttribute);
    }
    return {
      ...inputModel,
      attributes: attributesList as AttributesType[],
    };
  },
  removeModelCategoryAtIndex: ({ inputModel, categoryListIndex }) => {
    const actualIndex = categoryListIndex ?? -1;
    if (
      actualIndex >= 0 &&
      inputModel.attributes &&
      inputModel.attributes.length > 0 &&
      actualIndex < inputModel.attributes.length
    ) {
      const attributesList: AttributesType[] =
        inputModel.attributes && inputModel.attributes.length > 0
          ? [...inputModel.attributes]
          : [];
      if (
        actualIndex >= 0 &&
        attributesList &&
        attributesList.length > 0 &&
        actualIndex < attributesList.length
      ) {
        attributesList.splice(actualIndex, 1);
      }
      return {
        ...inputModel,
        attributes: attributesList as AttributesType[],
      };
    } else {
      return inputModel;
    }
  },
  appendRiskIndicatorToCategory: ({ inputModel, categoryListIndex }) => {
    const actualIndex = categoryListIndex ?? -1;
    const attributesList: AttributesType[] = inputModel.attributes
      ? [...inputModel.attributes]
      : [];
    const modifiedAttribute =
      actualIndex >= 0 && attributesList.length > 0
        ? attributesList[actualIndex]
        : {
            attributeType: 'category',
            name: '',
            description: '',
            owner: '',
            attributes: [],
            weight: 1.0,
          };
    const newRiskIndicator: RiskIndicatorModelType = {
      attributeId: '',
      weight: 1.0,
    };

    const newAttributeList =
      modifiedAttribute && modifiedAttribute.attributes
        ? [...modifiedAttribute.attributes]
        : [];
    if (newAttributeList.length > 0) {
      newAttributeList.push(newRiskIndicator);
    } else {
      newAttributeList.push(newRiskIndicator);
      newAttributeList.push(newRiskIndicator);
    }
    const newAttribute = {
      ...modifiedAttribute,
      attributes: newAttributeList,
    };

    if (actualIndex < attributesList.length) {
      attributesList[actualIndex] = newAttribute;
    } else {
      attributesList.push(newAttribute);
    }

    return {
      ...inputModel,
      attributes: attributesList,
    };
  },
  changeRiskIndicatorIdInCategory: ({
    inputModel,
    categoryListIndex,
    riskIndicatorListIndex,
    value,
  }) => {
    const actualIndex = categoryListIndex ?? -1;
    const attributesList: AttributesType[] = inputModel.attributes
      ? [...inputModel.attributes]
      : [];
    const modifiedAttribute =
      actualIndex >= 0 && attributesList.length > 0
        ? attributesList[actualIndex]
        : {
            attributeType: 'category',
            name: '',
            description: '',
            owner: '',
            attributes: [],
            weight: 0.0,
          };
    const riskIndicators = modifiedAttribute.attributes
      ? [...modifiedAttribute.attributes]
      : [];
    const riskIndicatorActualIndex = riskIndicatorListIndex ?? -1;
    const riskIndicator: RiskIndicatorModelType =
      riskIndicatorActualIndex >= 0 &&
      riskIndicators &&
      riskIndicators.length > 0 &&
      riskIndicatorActualIndex < riskIndicators.length
        ? riskIndicators[riskIndicatorActualIndex]
        : {
            attributeId: '',
            weight: 0.0,
          };
    const newRiskIndicator: RiskIndicatorModelType = {
      ...riskIndicator,
      attributeId: value as string,
    };

    if (
      riskIndicatorActualIndex >= 0 &&
      riskIndicators &&
      riskIndicators.length > 0 &&
      riskIndicatorActualIndex < riskIndicators.length
    ) {
      riskIndicators[riskIndicatorActualIndex] = newRiskIndicator;
    } else if (riskIndicators.length === 0) {
      riskIndicators.push(newRiskIndicator);
    }
    const newAttribute = {
      ...modifiedAttribute,
      attributes: riskIndicators,
    };
    if (
      actualIndex >= 0 &&
      attributesList &&
      attributesList.length > 0 &&
      actualIndex < attributesList.length
    ) {
      attributesList[actualIndex] = newAttribute;
    } else if (attributesList.length === 0) {
      attributesList.push(newAttribute);
    }
    return {
      ...inputModel,
      attributes: attributesList,
    };
  },
  changeRiskIndicatorWeightInCategory: ({
    inputModel,
    categoryListIndex,
    riskIndicatorListIndex,
    value,
  }) => {
    const actualIndex = categoryListIndex ?? -1;
    const riskIndicatorActualIndex = riskIndicatorListIndex ?? -1;
    const attributesList: AttributesType[] = inputModel.attributes
      ? [...inputModel.attributes]
      : [];
    const modifiedAttribute =
      actualIndex >= 0 &&
      attributesList.length > 0 &&
      actualIndex < attributesList.length
        ? attributesList[actualIndex]
        : {
            attributeType: 'category',
            name: '',
            description: '',
            owner: '',
            attributes: [],
            weight: 1.0,
          };
    const riskIndicators = modifiedAttribute.attributes
      ? [...modifiedAttribute.attributes]
      : [];
    const riskIndicator: RiskIndicatorModelType =
      riskIndicatorActualIndex >= 0 &&
      riskIndicators &&
      riskIndicators.length > 0 &&
      riskIndicatorActualIndex < riskIndicators.length
        ? riskIndicators[riskIndicatorActualIndex]
        : {
            attributeId: '',
            weight: 1.0,
          };
    const newRiskIndicator: RiskIndicatorModelType = {
      ...riskIndicator,
      weight: value as number,
    };

    if (
      riskIndicatorActualIndex >= 0 &&
      riskIndicators &&
      riskIndicators.length > 0 &&
      riskIndicatorActualIndex < riskIndicators.length
    ) {
      riskIndicators[riskIndicatorActualIndex] = newRiskIndicator;
    } else if (riskIndicators.length === 0) {
      riskIndicators.push(newRiskIndicator);
    }
    const newAttribute = {
      ...modifiedAttribute,
      attributes: riskIndicators,
    };
    if (
      actualIndex >= 0 &&
      attributesList &&
      attributesList.length > 0 &&
      actualIndex < attributesList.length
    ) {
      attributesList[actualIndex] = newAttribute;
    } else if (attributesList.length === 0) {
      attributesList.push(newAttribute);
    }
    return {
      ...inputModel,
      attributes: attributesList,
    };
  },
  removeRiskIndicatorAtIndex: ({
    inputModel,
    categoryListIndex,
    riskIndicatorListIndex,
  }) => {
    const actualIndex = categoryListIndex ?? -1;
    const actualRiskIndicatorIndex = riskIndicatorListIndex ?? -1;
    if (
      actualIndex >= 0 &&
      inputModel.attributes &&
      inputModel.attributes.length > 0 &&
      actualIndex < inputModel.attributes.length
    ) {
      const attributesList: AttributesType[] = inputModel.attributes
        ? [...inputModel.attributes]
        : [];
      const modifiedAttribute =
        actualIndex >= 0 && attributesList && attributesList.length > 0
          ? attributesList[actualIndex]
          : {
              attributeType: 'category',
              name: '',
              description: '',
              owner: '',
              attributes: [],
              weight: 0.0,
            };
      const riskIndicators = modifiedAttribute.attributes
        ? [...modifiedAttribute.attributes]
        : [];
      if (
        actualRiskIndicatorIndex >= 0 &&
        riskIndicators &&
        riskIndicators.length > 0 &&
        actualRiskIndicatorIndex < riskIndicators.length
      ) {
        riskIndicators.splice(actualRiskIndicatorIndex, 1);
      }
      attributesList[actualIndex] = {
        ...modifiedAttribute,
        attributes: riskIndicators,
      };
      return {
        ...inputModel,
        attributes: attributesList as AttributesType[],
      };
    } else {
      return inputModel;
    }
  },
};

const createNewRiskIndicatorObject: () => RiskIndicatorModelType = () => {
  const riskIndicator: RiskIndicatorModelType = {
    attributeId: '',
    weight: 1.0,
  };
  return riskIndicator;
};

const createNewCategoryObject: () => AttributesType = () => {
  const newAttribute: AttributesType = {
    attributeType: 'category',
    name: '',
    description: '',
    weight: 1.0,
    attributes: [createNewRiskIndicatorObject()],
  };
  return newAttribute;
};

const createNewModelObject: () => Model = () => {
  const newModel: Model = {
    id: 'NEW',
    name: '',
    description: '',
    owner: '',
    attributes: [createNewCategoryObject()],
  };
  return newModel;
};

const modelsSlice = createSlice({
  name: `models`,
  initialState,
  reducers: {
    addNewModel: (state) => {
      const newModel: Model = createNewModelObject();
      return {
        ...state,
        newModel: newModel,
      };
    },
    modelValueChangeHandler: (state, param) => {
      const { payload } = param;
      const {
        operation,
        id,
        value,
        categoryListIndex,
        riskIndicatorListIndex,
      }: {
        operation: string;
        id: string;
        value: string;
        categoryListIndex: number;
        riskIndicatorListIndex: number;
      } = payload;
      if (id === 'NEW' && state.newModel) {
        const newModel = modelFunctionsByOperator[operation]({
          inputModel: state.newModel,
          value,
          categoryListIndex,
          riskIndicatorListIndex,
        });
        return {
          ...state,
          newModel: newModel,
        };
      } else if (id !== 'NEW') {
        const newModel = modelFunctionsByOperator[operation]({
          inputModel: state.models[id],
          value,
          categoryListIndex,
          riskIndicatorListIndex,
        });
        return {
          ...state,
          selectedModelId: id,
          models: { ...state.models, [id]: newModel },
        };
      }
      return state;
    },
    setSelectedModelId: (state, param) => {
      const { payload } = param;
      const { modelId } = payload;
      if (modelId) {
        return {
          ...state,
          selectedModelId: modelId,
        };
      }
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveModels.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveModels.fulfilled,
        (state, { payload }: PayloadAction<Model[]>) => {
          state.loading = false;
          state.initialized = true;
          const modelsByModelId: { [id: string]: Model } = {};
          let firstModelId: string | null = null;
          payload.map((model) => {
            const { id } = model;
            if (id) {
              modelsByModelId[id] = model;
            }
          });
          payload.sort(keyComparator<Model>(payload, 'name'));
          if (payload.length > 0) {
            const activeModels = payload.filter((model: Model) => model.active);
            if (activeModels.length > 0) {
              firstModelId = activeModels[0].id;
            }
          }
          state.models = modelsByModelId;
          state.selectedModelId = firstModelId;
          state.newModel = null;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveModels.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.models = {};
        state.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveModel.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveModel.fulfilled,
        (state, { payload }: PayloadAction<Model>) => {
          state.loading = false;
          state.initialized = true;
          const { id } = payload;
          if (id) {
            state.models = { [id]: payload };
          }
          state.selectedModelId = id;
          state.newModel = null;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveModel.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.models = {};
        state.selectedModelId = null;
        state.newModel = null;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(saveModel.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        saveModel.fulfilled,
        (state, { payload }: PayloadAction<string>) => {
          state.loading = false;
          state.initialized = true;
          const id = payload as string;
          if (id && state.newModel) {
            state.models = {
              ...state.models,
              [id]: { ...state.newModel, id: id },
            };
            state.newModel = null;
          }
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(saveModel.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(modifyModel.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        modifyModel.fulfilled,
        (state, { payload }: PayloadAction<Model>) => {
          state.loading = false;
          state.initialized = true;
          const model: Model = payload;
          const id = model.id;
          if (id && model) {
            state.models = {
              ...state.models,
              [id]: { ...model },
            };
          }
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(modifyModel.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
      })
      .addCase(deleteModel.pending, (state) => {
        state.loading = true;
        state.initialized = false;
        state.status = ResponseStatus.PENDING;
      })
      .addCase(
        deleteModel.fulfilled,
        (state, { payload }: PayloadAction<string>) => {
          const modelId = payload as string;
          state.loading = false;
          state.initialized = true;
          const { [modelId]: _deletedModel, ...newModels } = state.models;
          state.models = newModels;
          state.newModel = null;
          state.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(deleteModel.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.status = ResponseStatus.FAILED;
      });
  },
});

export const modelsSelector = (state: RootState): Model[] => {
  const models =
    (state?.models?.models && Object.values(state?.models?.models)) ?? [];
  models.sort(keyComparator<Model>(models, 'name'));
  return models;
};

export const modelIdsToNamesSelector = (
  state: RootState
): UISelectInterface[] => {
  if (state?.models?.models) {
    const modelKeys = Object.keys(state.models.models);
    const modelUIList: UISelectInterface[] = modelKeys.map(
      (modelId: string) => {
        const model: Model = state.models.models[modelId];
        const name = model.name ?? '';
        return { id: modelId, name };
      }
    );
    modelUIList.sort(keyComparator<UISelectInterface>(modelUIList, 'name'));
    return modelUIList;
  }
  return [];
};

export const activeModelIdsToNamesSelector = (
  state: RootState
): UISelectInterface[] => {
  if (state?.models?.models) {
    const models: Model[] = Object.values(state.models.models);
    const activeModels: Model[] = models.filter(
      (model: Model) => model.active === true
    );
    const modelUIList: UISelectInterface[] = activeModels.map(
      (model: Model) => {
        const modelId = model.id ?? '';
        const name = model.name ?? '';
        return { id: modelId, name };
      }
    );
    modelUIList.sort(keyComparator<UISelectInterface>(modelUIList, 'name'));
    return modelUIList;
  }
  return [];
};

export const getModelListSelector = (
  state: RootState
): { label: string; items: UISelectInterface[] } => {
  return {
    label: 'Model Name',
    items: modelIdsToNamesSelector(state),
  };
};

export const getActiveModelistSelector = (
  state: RootState
): { label: string; items: UISelectInterface[] } => {
  return {
    label: 'Model Name',
    items: activeModelIdsToNamesSelector(state),
  };
};

export const modelByIdSelector =
  (modelId: string): ((state: RootState) => Model | undefined) =>
  (state: RootState) =>
    state.models?.models[modelId] ?? undefined;

export const modelNameByIdSelctor =
  (modelId: string): ((state: RootState) => string | undefined) =>
  (state: RootState) =>
    state.models?.models[modelId]?.name ?? undefined;

export const newModelSelector: (state: RootState) => Model | null = (
  state: RootState
) => {
  return state.models.newModel;
};

export const modelAttributeIdsSelector =
  (modelId: string): ((state: RootState) => RiskIndicatorType[]) =>
  (state: RootState) => {
    const model = state.models?.models[modelId] || null;
    if (model) {
      return model.attributes.attributes.map(
        (attribute: RiskIndicatorModelType) => attribute.attributeId
      );
    }
    return [];
  };

export const modelAttributesByIdSelector =
  (modelId: string): ((state: RootState) => RiskIndicatorType[]) =>
  (state: RootState) => {
    const model = state.models.models[modelId] || {};
    const attributes = state.attributes.attributes || {};
    if (model && attributes) {
      const { attributes: categories } = model;
      const riskIndicatorsForModel: Set<RiskIndicatorType> = new Set([]);
      if (categories) {
        categories.forEach((category: AttributesType) => {
          const { attributes: riskIndicators } = category;
          riskIndicators.forEach(
            (riskIndicatorInModel: RiskIndicatorModelType) => {
              const { attributeId } = riskIndicatorInModel;
              if (attributeId in attributes) {
                riskIndicatorsForModel.add(attributes[attributeId]);
              }
            }
          );
        });
      }
      return Array.from(riskIndicatorsForModel);
    }
    return [];
  };

export const modelCategoriesByIdSelector =
  (modelId: string): ((state: RootState) => AttributesType[]) =>
  (state: RootState) =>
    state.models.models[modelId]?.attributes ?? null;

export const newModelCategoriesSelector: (
  state: RootState
) => AttributesType[] = (state: RootState) =>
  state.models.newModel?.attributes ?? null;

export const modelsTreeSelector: (state: RootState) => FullModel[] = (
  state: RootState
) => {
  const models: Model[] = Object.values(state.models.models);
  const attributes: { [attributeId: string]: RiskIndicatorType } =
    state.attributes.attributes ?? {};
  const attributesLength = Object.keys(attributes).length;
  if (models && attributes && attributesLength > 0) {
    const fullModels: FullModel[] = models.map((model: Model): FullModel => {
      const categories: AttributesType[] = model.attributes;
      const fullAttributes: FullAttributesType[] = categories.map(
        (category: AttributesType) => {
          const riskIndicatorModelTypes: RiskIndicatorModelType[] =
            category.attributes;
          const riskIndicators: FullRiskIndicator[] =
            riskIndicatorModelTypes.map(
              (riskIndicatorModel: RiskIndicatorModelType) => {
                const { attributeId, weight } = riskIndicatorModel;
                const riskIndicator: RiskIndicatorType =
                  attributes[attributeId];
                return { ...riskIndicator, weight };
              }
            );
          return { ...category, attributes: riskIndicators };
        }
      );
      return { ...model, attributes: fullAttributes };
    });
    return fullModels;
  }
  return [];
};

export const modelTreeByIdSelector =
  (modelId: string): ((state: RootState) => FullModel | null) =>
  (state: RootState) => {
    const model: Model = state.models.models[modelId] ?? null;
    const attributes: { [attributeId: string]: RiskIndicatorType } =
      state.attributes.attributes ?? {};
    const attributesLength = Object.keys(attributes).length;
    if (model && attributes && attributesLength > 0) {
      const categories: AttributesType[] = model.attributes;
      const fullAttributes: FullAttributesType[] = categories.map(
        (category: AttributesType) => {
          const riskIndicatorModelTypes: RiskIndicatorModelType[] =
            category.attributes;
          const riskIndicators: (FullRiskIndicator | null)[] =
            riskIndicatorModelTypes.map(
              (riskIndicatorModel: RiskIndicatorModelType) => {
                const { attributeId, weight } = riskIndicatorModel;
                const riskIndicator: RiskIndicatorType =
                  attributes[attributeId];
                if (riskIndicator) {
                  return { ...riskIndicator, weight };
                }
                return null;
              }
            );
          const populatedRiskIndicator: FullRiskIndicator[] = [];
          riskIndicators.forEach((riskIndicator) => {
            if (riskIndicator != null) {
              populatedRiskIndicator.push(riskIndicator);
            }
          });
          return { ...category, attributes: populatedRiskIndicator };
        }
      );
      return { ...model, attributes: fullAttributes };
    }
    return null;
  };

export const modelFullAttributesSelector: (
  state: RootState
) => FullAttributesType[] = (state: RootState) => {
  const modelId = state.models?.selectedModelId ?? null;
  const model: FullModel | null = modelTreeByIdSelector(modelId)(state);
  if (model) {
    return model?.attributes;
  }
  return [];
};

export const modelAttributesSelector: (
  state: RootState
) => RiskIndicatorType[] = (state: RootState) => {
  const attributes = state.attributes?.attributes ?? {};
  const modelId = state.models?.selectedModelId ?? null;
  const model = modelId ? state.models?.models[modelId] ?? null : null;
  if (model && attributes) {
    const { attributes: categories } = model;
    const riskIndicatorsForModel: Set<RiskIndicatorType> = new Set([]);
    if (categories) {
      categories.forEach((category: AttributesType) => {
        const { attributes: riskIndicators } = category;
        if (riskIndicators) {
          riskIndicators.forEach((attribute: RiskIndicatorModelType) => {
            const { attributeId } = attribute;
            if (attributeId in attributes) {
              riskIndicatorsForModel.add(attributes[attributeId]);
            }
          });
        }
      });
    }
    return Array.from(riskIndicatorsForModel);
  }
  return [];
};

export const newModelAttributesSelector: (
  state: RootState
) => RiskIndicatorType[] = (state: RootState) => {
  const attributes = state.attributes?.attributes || {};
  const model = state.models?.newModel || {};
  if (model && attributes) {
    const { attributes: categories } = model;
    const riskIndicatorsForModel: Set<RiskIndicatorType> = new Set([]);
    if (categories) {
      categories.map((category: AttributesType) => {
        const { attributes: riskIndicators } = category;
        riskIndicators.forEach((attribute: RiskIndicatorModelType) => {
          const { attributeId } = attribute;
          if (attributeId in attributes) {
            riskIndicatorsForModel.add(attributes[attributeId]);
          }
        });
      });
    }
    return Array.from(riskIndicatorsForModel);
  }
  return [];
};

export const newModelRiskIndicatorTypesSelector: (
  state: RootState
) => RiskIndicatorModelType[] = (state: RootState) => {
  const model = state.models?.newModel || {};
  if (model) {
    const { attributes: categories } = model;
    const riskIndicatorsForModel: Set<RiskIndicatorModelType> = new Set([]);
    if (categories) {
      categories.map((category: AttributesType) => {
        const { attributes: riskIndicators } = category;
        if (riskIndicators) {
          riskIndicators.forEach((attribute: RiskIndicatorModelType) =>
            riskIndicatorsForModel.add(attribute)
          );
        }
      });
    }
    return Array.from(riskIndicatorsForModel);
  }
  return [];
};

export const newRiskIndicatorModelListById: (state: RootState) => {
  [id: string]: RiskIndicatorModelType;
} = (state: RootState) => {
  const model = state.models?.newModel || {};
  if (model) {
    const { attributes: categories } = model;
    const riskIndicatorsById: { [id: string]: RiskIndicatorModelType } = {};
    if (categories) {
      categories.map((category: AttributesType) => {
        const { attributes: riskIndicators } = category;
        if (riskIndicators) {
          riskIndicators.forEach((attribute: RiskIndicatorModelType) => {
            const { attributeId } = attribute;
            riskIndicatorsById[attributeId] = attribute;
          });
        }
      });
    }
  }
  return {};
};

export const newRiskIndicatorModelList: (
  state: RootState
) => RiskIndicatorModelType[] = (state: RootState) => {
  const model = state.models?.newModel || {};
  if (model) {
    const { attributes: categories } = model;
    const modelRiskIndicatorsSet: Set<RiskIndicatorModelType> =
      new Set<RiskIndicatorModelType>([]);
    if (categories) {
      categories.map((category: AttributesType) => {
        const { attributes: riskIndicators } = category;
        if (riskIndicators) {
          riskIndicators.forEach((attribute: RiskIndicatorModelType) =>
            modelRiskIndicatorsSet.add(attribute)
          );
        }
      });
    }
    return Array.from(modelRiskIndicatorsSet);
  }
  return [];
};

export const selectInitialAttribute: () => AttributesType = () => ({
  attributeType: 'category',
  name: '',
  description: '',
  owner: '',
  attributes: [],
  weight: 0.0,
});

export const selectInitialModelRiskIndicator: () => RiskIndicatorModelType =
  () => ({
    attributeId: '',
    weight: 0.0,
  });

export const getSelectedModelId = (state: RootState): string =>
  state.models.selectedModelId;

export const isModelsInitialized = (state: RootState): boolean =>
  state.models.initialized;

export const { addNewModel, modelValueChangeHandler, setSelectedModelId } =
  modelsSlice.actions;
export default modelsSlice.reducer;
