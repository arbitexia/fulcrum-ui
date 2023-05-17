/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

import { UIContainer } from '@/components/UI';
import { DashboardLayout } from '@/layouts';
import { BuildModelNavbar } from '@/modules/Models';
import { AttributesType, Model, RiskIndicatorType } from '@/types';
import { BuildModelCategory, BuildModelWeightModal } from '@/modules/Models';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  addNewModel,
  modelAttributesSelector,
  modelCategoriesByIdSelector,
  newModelAttributesSelector,
  newModelCategoriesSelector,
  retrieveModel,
  newModelSelector,
  retrieveAttributes,
  selectInitialAttribute,
  modelValueChangeHandler,
  modelByIdSelector,
  getDataSourcesConfigInitialized,
  retrieveDataSources,
  getAccessToken,
  getListsInitialized,
  retrieveLists,
  isModelsInitialized,
  getIsAttributesInitialized,
} from '@/redux/slices';
import { RiskIndicatorModelType } from '@/types/models.type';
import { attributesByIdSelector } from '@/redux/slices/attributes.slice';
import { selectInitialModelRiskIndicator } from '@/redux/slices/model.slice';

const weightOperationsByItemType: { [itemType: string]: string } = {
  riskIndicator: 'changeRiskIndicatorWeightInCategory',
  category: 'changeModelCategoryWeightAtIndex',
};

const Build = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { query, isReady } = router;
  const { modelId } = query as { modelId: string };
  const attributes: RiskIndicatorType[] = useAppSelector(
    modelAttributesSelector
  );
  const newModelAttributes: RiskIndicatorType[] = useAppSelector(
    newModelAttributesSelector
  );

  const riskIndicators: { [id: string]: RiskIndicatorType } = useAppSelector(
    attributesByIdSelector
  );

  const categories: AttributesType[] = useAppSelector(
    modelCategoriesByIdSelector(modelId)
  );

  const initialAttribute: AttributesType = useAppSelector(
    selectInitialAttribute
  );
  const initialRiskIndicatorModel: RiskIndicatorModelType = useAppSelector(
    selectInitialModelRiskIndicator
  );
  const newModelCategories: AttributesType[] = useAppSelector(
    newModelCategoriesSelector
  );
  const currentModel = useAppSelector(modelByIdSelector(modelId));
  const newModel = useAppSelector(newModelSelector);

  const isDataSourceConfigInitialized = useAppSelector(
    getDataSourcesConfigInitialized
  );
  const isListsInitialized = useAppSelector(getListsInitialized);
  const stateAccessToken = useAppSelector(getAccessToken);
  const isModelInitialized = useAppSelector(isModelsInitialized);
  const isAttributesInitialized = useAppSelector(getIsAttributesInitialized);
  const [model, setModel] = useState<Model | null>(null);
  const [categoryList, setCategoryList] = useState<AttributesType[] | null>(
    null
  );
  const [attributeList, setAttributeList] =
    useState<RiskIndicatorType[]>(attributes);

  const [modelWeightAttributes, setModelWeightAttributes] = useState<
    RiskIndicatorModelType[] | AttributesType[]
  >([]);
  const [itemType, setItemType] = useState<string>('category');
  const [categoryIndex, setCategoryIndex] = useState<number>(-1);

  const [riskAttributes, setRiskAttributes] = useState<{
    [id: string]: RiskIndicatorType;
  }>(riskIndicators);
  const [openWeightChange, setOpenWeightChange] = useState<boolean>(false);

  useEffect(() => {
    if (!isDataSourceConfigInitialized && stateAccessToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveDataSources({ accessToken: stateAccessToken }));
    }
  }, [isDataSourceConfigInitialized, dispatch, stateAccessToken]);

  useEffect(() => {
    if (!isAttributesInitialized && isReady && stateAccessToken) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveAttributes({
          accessToken: stateAccessToken,
          limit: 100,
        })
      );
    }
  }, [isAttributesInitialized, isReady, dispatch, stateAccessToken]);

  useEffect(() => {
    if (isAttributesInitialized) {
      if (!categoryList && isReady && modelId && stateAccessToken) {
        dispatch(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          retrieveModel({
            accessToken: stateAccessToken,
            modelId: modelId as string,
          })
        );
      } else if (!categoryList && isReady && !modelId) {
        dispatch(addNewModel());
      }
    }
  }, [
    categoryList,
    isReady,
    modelId,
    dispatch,
    stateAccessToken,
    isModelInitialized,
    isAttributesInitialized,
  ]);

  useEffect(() => {
    const newCategoryList = modelId ? categories : newModelCategories;
    setCategoryList(newCategoryList);
    setModelWeightAttributes(newCategoryList);
    setItemType('category');
  }, [categories, categoryList, newModelCategories, modelId]);

  useEffect(() => {
    if (
      (!attributeList || attributeList.length !== attributes.length) &&
      modelId
    ) {
      setAttributeList(attributes);
    } else if (
      (!attributeList || attributeList.length !== newModelAttributes.length) &&
      !modelId
    ) {
      setAttributeList(newModelAttributes);
    }
  }, [attributes, attributeList, newModelAttributes, modelId]);

  useEffect(() => {
    if (modelId && currentModel) {
      setModel(currentModel);
    } else if (!modelId && newModel) {
      setModel(newModel);
    }
  }, [currentModel, newModel, setModel, modelId]);

  useEffect(() => {
    if (
      !riskAttributes ||
      (Object.keys(riskAttributes).length !==
        Object.keys(riskIndicators).length &&
        isReady)
    ) {
      setRiskAttributes(riskIndicators);
    }
  }, [setRiskAttributes, riskAttributes, riskIndicators, isReady]);

  useEffect(() => {
    if (stateAccessToken && !isListsInitialized) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveLists({
          accessToken: stateAccessToken,
          limit: 25,
        })
      );
    }
  }, [dispatch, isListsInitialized, stateAccessToken]);

  const onSaveWeights: ({
    saveWeightsModelId,
    saveWeightsItemType,
    saveWeightsCategoryIndex,
    riskIndicatorIndex,
    value,
  }: {
    saveWeightsModelId: string;
    saveWeightsItemType: string;
    saveWeightsCategoryIndex: number;
    riskIndicatorIndex?: number;
    value: number;
  }) => void = ({
    saveWeightsModelId,
    saveWeightsItemType,
    saveWeightsCategoryIndex,
    riskIndicatorIndex,
    value,
  }) => {
    const operation = weightOperationsByItemType[saveWeightsItemType];
    dispatch(
      modelValueChangeHandler({
        operation,
        id: saveWeightsModelId,
        value: value,
        categoryListIndex: saveWeightsCategoryIndex,
        riskIndicatorListIndex: riskIndicatorIndex,
      })
    );
  };

  return (
    <DashboardLayout
      title="Model and Scoring Configuration"
      navbarBorder={false}
      navEls={<BuildModelNavbar model={model} />}
    >
      <UIContainer
        sx={{ background: '#FFFFFF', minHeight: 'calc(100vh - 136px)' }}
      >
        {!isReady && <CircularProgress />}
        {isReady &&
          model &&
          model.id &&
          categoryList &&
          categoryList.length > 0 &&
          categoryList.map((attribute, index) => {
            const categoryRiskIndicators = attribute.attributes;
            return (
              <Box key={index}>
                {model && model.id && (
                  <BuildModelCategory
                    modelId={model.id}
                    riskIndicatorsById={riskAttributes}
                    modelCategory={attribute}
                    index={index}
                    categoryRiskIndicators={categoryRiskIndicators}
                    setOpenWeightChange={(
                      weightChangeCategoryIndex?: number,
                      riskIndicatorIndex?: number
                    ) => {
                      if (
                        riskIndicatorIndex != undefined &&
                        weightChangeCategoryIndex != undefined &&
                        riskIndicatorIndex >= 0 &&
                        weightChangeCategoryIndex >= 0
                      ) {
                        const newRiskIndicators: RiskIndicatorModelType[] =
                          newModelCategories &&
                          newModelCategories.length > 0 &&
                          weightChangeCategoryIndex <
                            newModelCategories.length &&
                          newModelCategories[weightChangeCategoryIndex] &&
                          newModelCategories[weightChangeCategoryIndex]
                            .attributes &&
                          newModelCategories[weightChangeCategoryIndex]
                            .attributes.length > 0
                            ? newModelCategories[weightChangeCategoryIndex]
                                .attributes
                            : [initialRiskIndicatorModel];
                        const selectedRiskIndicators: RiskIndicatorModelType[] =
                          categories &&
                          categories.length > 0 &&
                          weightChangeCategoryIndex < categories.length &&
                          categories[weightChangeCategoryIndex] &&
                          categories[weightChangeCategoryIndex].attributes &&
                          categories[weightChangeCategoryIndex].attributes
                            .length > 0
                            ? categories[weightChangeCategoryIndex].attributes
                            : newRiskIndicators;
                        setModelWeightAttributes(selectedRiskIndicators);
                        setItemType('riskIndicator');
                        setCategoryIndex(weightChangeCategoryIndex);
                      } else if (
                        riskIndicatorIndex == undefined &&
                        weightChangeCategoryIndex != undefined &&
                        weightChangeCategoryIndex >= 0
                      ) {
                        const newCategories: AttributesType[] =
                          newModelCategories && newModelCategories.length > 0
                            ? newModelCategories
                            : [initialAttribute];
                        const selectedCategories: AttributesType[] =
                          categories && categories.length > 0
                            ? categories
                            : newCategories;
                        setModelWeightAttributes(selectedCategories);
                        setItemType('category');
                      }
                      setOpenWeightChange(true);
                    }}
                  />
                )}
              </Box>
            );
          })}
        {isReady &&
          (!categoryList || categoryList.length === 0) &&
          model &&
          model.id && (
            <BuildModelCategory
              modelId={model.id}
              riskIndicatorsById={riskAttributes}
              modelCategory={null}
              index={0}
              categoryRiskIndicators={[]}
              setOpenWeightChange={(
                weightChangeCategoryIndex?: number,
                riskIndicatorIndex?: number
              ) => {
                if (
                  riskIndicatorIndex != undefined &&
                  weightChangeCategoryIndex != undefined &&
                  riskIndicatorIndex >= 0 &&
                  weightChangeCategoryIndex >= 0
                ) {
                  const selectedRiskIndicators: RiskIndicatorModelType[] = [
                    initialRiskIndicatorModel,
                  ];
                  setModelWeightAttributes(selectedRiskIndicators);
                  setItemType('riskIndicator');
                  setCategoryIndex(weightChangeCategoryIndex);
                } else if (
                  riskIndicatorIndex == undefined &&
                  weightChangeCategoryIndex != undefined &&
                  weightChangeCategoryIndex >= 0
                ) {
                  const selectedCategories: AttributesType[] = [
                    initialAttribute,
                  ];
                  setModelWeightAttributes(selectedCategories);
                  setItemType('category');
                }
                setOpenWeightChange(true);
              }}
            />
          )}
        {isReady && modelWeightAttributes && (
          <BuildModelWeightModal
            open={openWeightChange}
            onClose={() => {
              setModelWeightAttributes([]);
              setItemType('category');
              setOpenWeightChange(false);
            }}
            modelId={modelId ?? 'NEW'}
            itemList={modelWeightAttributes}
            itemType={itemType}
            categoryIndex={categoryIndex}
            riskIndicatorsById={riskIndicators}
            onWeightChange={({
              weightChangeModelId,
              weightChangeCategoryIndex,
              riskIndicatorIndex,
              value,
            }) => {
              onSaveWeights({
                saveWeightsModelId: weightChangeModelId,
                saveWeightsItemType: itemType,
                saveWeightsCategoryIndex: weightChangeCategoryIndex,
                riskIndicatorIndex,
                value,
              });
            }}
          />
        )}
      </UIContainer>
    </DashboardLayout>
  );
};

export default Build;
