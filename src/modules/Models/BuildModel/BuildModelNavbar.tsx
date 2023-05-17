/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { ChangeEvent } from 'react';
import {
  UIContainer,
  UIDefaultTextField,
  UIModalButton,
  UIFlexWrapBox,
} from '@/components/UI';
import { Box, InputLabel, Typography } from '@mui/material';
import { Model } from '@/types';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  getAccessToken,
  modelValueChangeHandler,
  saveModel,
} from '@/redux/slices';
import { NewModelParams } from '@/types/models.type';
import { noop } from 'lodash';
import { useRouter } from 'next/router';

const BuildModelNavbar = ({ model }: { model: Model | null }): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = (model && model.id) || null;
  const stateAccessToken = useAppSelector(getAccessToken);

  const handleInputChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    {
      operation,
      targetId,
    }: {
      operation: string;
      targetId: string | null;
    }
  ): void => {
    const value = event.currentTarget.value ?? null;

    if (operation && targetId && value != null) {
      dispatch(modelValueChangeHandler({ operation, id: targetId, value }));
    }
  };

  const dispatchSave = (args: NewModelParams): Promise<unknown> => {
    return new Promise<void>((resolve) => {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        saveModel(args)
      );
      resolve();
    });
  };

  const handleSave: () => void = () => {
    const modelId = (model && model?.id) ?? 'NEW';
    const newModel =
      modelId && modelId === 'NEW' ? { ...model, id: null } : model;
    const modelJson = JSON.stringify(newModel);
    if (stateAccessToken) {
      dispatchSave({
        accessToken: stateAccessToken,
        modelJson,
        author: 'Diego Martinez',
        modelId: modelId === 'NEW' ? '' : modelId,
        lastUpdateDate: Date.now(),
      }).then(() => router.push('/configuration/model').then(noop));
    }
  };

  return (
    <UIContainer>
      <Typography variant="h4" sx={{ mr: 4 }}>
        Build a Model
      </Typography>
      <UIFlexWrapBox sx={{ alignItems: 'flex-end', mt: 2 }}>
        <Box>
          <InputLabel variant="standard" htmlFor="model-input-helper">
            <Typography
              sx={{
                fontWeight: '400',
                fontSize: '13px',
                lineHeight: '20px',
                color: '#504F54',
              }}
            >
              Model Name
            </Typography>
          </InputLabel>
          <UIDefaultTextField
            value={model?.name ?? ''}
            id="model-input-helper"
            variant="standard"
            onChange={(event) =>
              handleInputChange(event, {
                operation: 'changeModelName',
                targetId: id,
              })
            }
          />
        </Box>
        <Box>
          <InputLabel variant="standard" htmlFor="desc-input-helper">
            <Typography
              sx={{
                fontWeight: '400',
                fontSize: '13px',
                lineHeight: '20px',
                color: '#504F54',
              }}
            >
              Description
            </Typography>
          </InputLabel>
          <UIDefaultTextField
            value={model?.description ?? ''}
            id="desc-input-helper"
            variant="standard"
            sx={{ width: '600px', input: { color: '#2E2C34' } }}
            onChange={(event) =>
              handleInputChange(event, {
                operation: 'changeModelDescription',
                targetId: id,
              })
            }
          />
        </Box>
        <UIModalButton
          sx={{ fontWeight: 400 }}
          onClick={stateAccessToken ? handleSave : noop}
        >
          Save
        </UIModalButton>
      </UIFlexWrapBox>
    </UIContainer>
  );
};

export default BuildModelNavbar;
