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
  UIFlexWrapBox,
  UIDefaultButton,
} from '@/components/UI';
import { Box, InputLabel, LinearProgress, Typography } from '@mui/material';
import { Model } from '@/types';
import { useAppDispatch } from '@/hooks';
import { modelValueChangeHandler, saveModel } from '@/redux/slices';
import { NewModelParams } from '@/types/models.type';
import { noop } from 'lodash';
import { useRouter } from 'next/router';

const BuildModelNavbar = ({
  model,
  accessToken = null,
}: {
  model: Model | null;
  accessToken: string | null;
}): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  if (!model) {
    return <LinearProgress />;
  }

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
    const author = (model && model.owner) ?? '';
    const modelJson = JSON.stringify(newModel);
    if (accessToken) {
      dispatchSave({
        accessToken,
        modelJson,
        author,
        modelId: modelId === 'NEW' ? '' : modelId,
        lastUpdateDate: Date.now(),
        active: true,
      }).then(() => router.push('/configuration/model').then(noop));
    }
  };

  const id = (model && model.id) || null;

  return (
    <UIContainer
      disableGutters
      sx={{ paddingTop: '27px', paddingLeft: '36px' }}
    >
      <Typography variant="h4" sx={{ mr: 4 }}>
        Build a Model
      </Typography>
      <UIFlexWrapBox sx={{ alignItems: 'flex-end', mt: 2, gap: 4 }}>
        <Box>
          <InputLabel variant="standard" htmlFor="model-input-helper">
            <Typography
              sx={{
                mb: 1,
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
            defaultValue={model.name || ''}
            sx={{ width: '432px' }}
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
                mb: 1,
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
            defaultValue={model.description || ''}
            id="desc-input-helper"
            variant="standard"
            sx={{ width: '576px', input: { color: '#2E2C34' } }}
            onChange={(event) =>
              handleInputChange(event, {
                operation: 'changeModelDescription',
                targetId: id,
              })
            }
          />
        </Box>
        <UIDefaultButton
          sx={{ fontWeight: 400 }}
          onClick={accessToken ? handleSave : noop}
        >
          Save
        </UIDefaultButton>
      </UIFlexWrapBox>
    </UIContainer>
  );
};

export default BuildModelNavbar;
