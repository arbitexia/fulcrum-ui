/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { Typography, SelectChangeEvent, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import {
  UIContainer,
  UIFlexSpaceBox,
  UISelect,
  UIDefaultTextField,
} from '@/components/UI';
import { rankList, populationList } from '@/_mock';
import {
  getSelectedModelId,
  getLatestStat,
  setSelectedModelId,
} from '@/redux/slices';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { getActiveModelistSelector } from '@/redux/slices/model.slice';

export const HomeNavbar = ({
  accessToken = null,
}: {
  accessToken: string | null;
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const modelId = useAppSelector(getSelectedModelId);
  const modelsListSelected = useAppSelector(getActiveModelistSelector);

  const handleChange = (
    event: SelectChangeEvent<unknown>,
    operation: string
  ): void => {
    if (operation === 'changeModel' && accessToken) {
      const targetModelId = event.target.value as string;
      dispatch(setSelectedModelId({ modelId: targetModelId }));
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getLatestStat({
          modelId: targetModelId,
          accessToken,
          limit: 6,
        })
      );
    } else {
      console.log(`handleChange(${event.target.value}, ${operation})`);
    }
  };

  return (
    <UIContainer>
      <UIFlexSpaceBox sx={{ alignItems: 'flex-end' }}>
        <UIFlexSpaceBox sx={{ gap: 2 }}>
          <Typography variant="h4" sx={{ mr: 4, mt: 2 }}>
            Dashboard
          </Typography>
          {modelsListSelected &&
            modelsListSelected.items &&
            modelsListSelected.items.length > 0 && (
              <UISelect
                value={modelId}
                itemList={modelsListSelected.items}
                handleChange={(event) => handleChange(event, 'changeModel')}
                label={modelsListSelected.label}
                width="400px"
              />
            )}
          <UISelect
            value={1}
            itemList={rankList.items}
            handleChange={(event) => handleChange(event, 'changeRank')}
            label={rankList.label}
            disabled
          />
          <UISelect
            value={1}
            itemList={populationList.items}
            handleChange={(event) => handleChange(event, 'changePopulation')}
            label={populationList.label}
          />
        </UIFlexSpaceBox>
        <UIDefaultTextField
          id="input-with-icon-textfield"
          placeholder="Employee Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="standard"
        />
      </UIFlexSpaceBox>
    </UIContainer>
  );
};
