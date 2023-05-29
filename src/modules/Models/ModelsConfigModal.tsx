/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import {
  UIDefaultDialog,
  UISelect,
  UIFlexWrapBox,
  UIFlexCenterBox,
  UIModalButton,
} from '@/components/UI';
import { DefaultModalProps, Model } from '@/types';
// import {
//   peerList,
//   frequencyList,
//   resultRefreshList,
//   modelResultList,
//   modelAnalystList,
//   individualList,
// } from '@/_mock';
import { UISelectInterface } from '@/types/common.type';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  getAllFiltersForUISelector,
  modelByIdSelector,
  modelValueChangeHandler,
  modifyModel,
} from '@/redux/slices';
import { ModelFeatureFilter, NewModelParams } from '@/types/models.type';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { resetModelsState } from '@/redux/slices/model.slice';

interface ModelsConfigModalProps extends DefaultModalProps {
  accessToken: string;
  modelId: string;
}

export const ModelsConfigModal = ({
  open,
  onClose,
  accessToken,
  modelId,
}: ModelsConfigModalProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const filterList: UISelectInterface[] = useAppSelector(
    getAllFiltersForUISelector
  );
  const model: Model | undefined = useAppSelector(modelByIdSelector(modelId));
  const defaultFilterIdValue = filterList[0]?.id ?? '';
  const modelFeatureFilters: ModelFeatureFilter[] = model?.featureFilter ?? [];
  const firstFeatureFilter: ModelFeatureFilter | null =
    modelFeatureFilters[0] ?? null;
  const filterValue: string =
    firstFeatureFilter?.filterId ?? defaultFilterIdValue;
  const handleSelectChange = (
    event: SelectChangeEvent<unknown>,
    {
      operation,
      targetId,
      categoryListIndex,
      riskIndicatorListIndex,
    }: {
      operation: string;
      targetId: string | null;
      categoryListIndex?: number | undefined;
      riskIndicatorListIndex?: number | undefined;
    }
  ): void => {
    const value = event.target.value || null;

    if (operation && targetId && value) {
      dispatch(
        modelValueChangeHandler({
          operation,
          id: targetId,
          value,
          categoryListIndex,
          riskIndicatorListIndex,
        })
      );
    }
  };

  const dispatchModify = (args: NewModelParams): Promise<unknown> => {
    return new Promise<void>((resolve) => {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        modifyModel(args)
      );
      resolve();
    });
  };

  const handleSave: (saveModel: Model) => void = (saveModel: Model) => {
    const saveModelId = (saveModel && saveModel?.id) ?? 'NEW';
    const oldActiveFlag = saveModel.active ?? false;
    const newModel = { ...saveModel, active: oldActiveFlag };
    const author = (saveModel && saveModel.owner) ?? '';
    const modelJson = JSON.stringify(newModel);
    if (accessToken) {
      dispatchModify({
        accessToken,
        modelJson,
        author,
        modelId: saveModelId === 'NEW' ? '' : saveModelId,
        lastUpdateDate: Date.now(),
        active: oldActiveFlag,
      }).then(() => onClose());
    }
  };

  const dispatchReset = (): Promise<unknown> => {
    return new Promise<void>((resolve) => {
      dispatch(resetModelsState());
      resolve();
    });
  };

  const closeFn = (): void => {
    dispatchReset().then(onClose);
  };

  if (!modelId || !model) {
    return <CircularProgress />;
  }

  return (
    <UIDefaultDialog
      open={open}
      onClose={closeFn}
      title="Model Configuration Parameters"
      modalWidth="668px"
    >
      <UIFlexWrapBox sx={{ gap: 3, flexDirection: 'column' }}>
        <UIFlexWrapBox sx={{ alignItems: 'center' }}>
          <Box sx={{ width: '125px', fontSize: '13px', color: '#504F54' }}>
            Filters
          </Box>
          <UISelect
            value={filterValue}
            itemList={filterList}
            handleChange={(event) =>
              handleSelectChange(event, {
                operation: 'setFeatureFilter',
                targetId: modelId,
              })
            }
            width="209px"
          />
        </UIFlexWrapBox>
        {/*  <UIFlexWrapBox sx={{ alignItems: 'center' }}>*/}
        {/*    <Box sx={{ width: '125px', fontSize: '13px', color: '#504F54' }}>*/}
        {/*      Peer Comparisons*/}
        {/*    </Box>*/}
        {/*    <UISelect*/}
        {/*      value={1}*/}
        {/*      itemList={peerList}*/}
        {/*      handleChange={handleChange}*/}
        {/*      width="209px"*/}
        {/*    />*/}
        {/*  </UIFlexWrapBox>*/}
        {/*  <UIFlexWrapBox sx={{ alignItems: 'center' }}>*/}
        {/*    <Box sx={{ width: '125px', fontSize: '13px', color: '#504F54' }}>*/}
        {/*      Scoring Frequency*/}
        {/*    </Box>*/}
        {/*    <UISelect*/}
        {/*      value={1}*/}
        {/*      itemList={frequencyList}*/}
        {/*      handleChange={handleChange}*/}
        {/*      width="162px"*/}
        {/*    />*/}
        {/*  </UIFlexWrapBox>*/}
        {/*  <UIFlexWrapBox sx={{ alignItems: 'center' }}>*/}
        {/*    <Box sx={{ fontSize: '13px', color: '#504F54' }}>*/}
        {/*      Dashboard Result Refresh Frequency*/}
        {/*    </Box>*/}
        {/*    <UISelect*/}
        {/*      value={1}*/}
        {/*      itemList={resultRefreshList}*/}
        {/*      handleChange={handleChange}*/}
        {/*      width="220px"*/}
        {/*    />*/}
        {/*  </UIFlexWrapBox>*/}
        {/*  <UIFlexWrapBox sx={{ alignItems: 'center' }}>*/}
        {/*    <Box sx={{ fontSize: '13px', color: '#504F54' }}>*/}
        {/*      Model Results Displayed on Dashboard*/}
        {/*    </Box>*/}
        {/*    <UISelect*/}
        {/*      value={1}*/}
        {/*      itemList={modelResultList}*/}
        {/*      handleChange={handleChange}*/}
        {/*      width="100px"*/}
        {/*    />*/}
        {/*  </UIFlexWrapBox>*/}
        {/*  <UIFlexWrapBox sx={{ alignItems: 'center' }}>*/}
        {/*    <Box sx={{ fontSize: '13px', color: '#504F54' }}>*/}
        {/*      Model Shared with Other Analysts*/}
        {/*    </Box>*/}
        {/*    <UISelect*/}
        {/*      value={1}*/}
        {/*      itemList={modelAnalystList}*/}
        {/*      handleChange={handleChange}*/}
        {/*      width="100px"*/}
        {/*    />*/}
        {/*  </UIFlexWrapBox>*/}
        {/*  <UIFlexWrapBox sx={{ alignItems: 'center' }}>*/}
        {/*    <Box sx={{ fontSize: '13px', color: '#504F54' }}>*/}
        {/*      Basis Report Results Automated for top individuals*/}
        {/*    </Box>*/}
        {/*    <UISelect*/}
        {/*      value={1}*/}
        {/*      itemList={individualList}*/}
        {/*      handleChange={handleChange}*/}
        {/*      width="100px"*/}
        {/*    />*/}
        {/*  </UIFlexWrapBox>*/}
      </UIFlexWrapBox>
      <UIFlexCenterBox sx={{ mt: '36px', mb: '10px' }}>
        <UIModalButton onClick={() => handleSave(model)}>Save</UIModalButton>
      </UIFlexCenterBox>
    </UIDefaultDialog>
  );
};
