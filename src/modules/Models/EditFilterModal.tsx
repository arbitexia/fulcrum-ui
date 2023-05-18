/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Box, SelectChangeEvent, Typography } from '@mui/material';
import {
  UIDefaultDialog,
  UIFlexWrapBox,
  UIModalButton,
  UIDefaultTextField,
} from '@/components/UI';
import { EditFilterRow } from './EditFilterRow';
import { DefaultModalProps, Filter, NewFilterParams } from '@/types';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  currentFilterSelector,
  filterValueChangeHandler,
  saveFilter,
} from '@/redux/slices/filters.slice';

interface EditListModalProps extends DefaultModalProps {
  id: number | string | null;
  accessToken: string | null;
}

export const EditFilterModal = ({
  open,
  onClose,
  accessToken = null,
}: EditListModalProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(currentFilterSelector);
  const [currentFilter, setCurrentFilter] = useState<Filter | undefined>(
    filter
  );
  const id = filter?.id ?? 'NEW';
  useEffect(() => {
    if (
      !filter?.attributes ||
      (filter?.attributes && filter?.attributes?.length < 1)
    ) {
      dispatch(
        filterValueChangeHandler({
          operation: 'appendFilterAttribute',
        })
      );
    } else setCurrentFilter(filter);
  }, [dispatch, filter]);
  const handleSelectChange = (
    event: SelectChangeEvent<unknown>,
    {
      operation,
      listIndex,
    }: {
      operation: string;
      listIndex?: number | undefined;
    }
  ): void => {
    const value = (event.target.value as number) ?? null;

    if (operation && value != null) {
      dispatch(
        filterValueChangeHandler({
          operation,
          value,
          listIndex,
        })
      );
    }
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    {
      operation,
      listIndex,
    }: {
      operation: string;
      listIndex?: number | undefined;
    }
  ): void => {
    const value = event.currentTarget.value ?? null;

    if (operation && value != null) {
      dispatch(
        filterValueChangeHandler({
          operation,
          value,
          listIndex,
        })
      );
    }
  };
  const handleActionClick = (listIndex: number): void => {
    if (id && listIndex == 0) {
      dispatch(
        filterValueChangeHandler({
          operation: 'appendFilterAttribute',
        })
      );
    } else if (id && listIndex != 0) {
      dispatch(
        filterValueChangeHandler({
          operation: 'removeAttributeAtIndex',
          listIndex,
        })
      );
    }
  };

  const dispatchSave = (args: NewFilterParams): Promise<unknown> => {
    return new Promise<void>((resolve) => {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        saveFilter(args)
      );
      resolve();
    });
  };

  const handleSave: () => void = () => {
    if (currentFilter && accessToken) {
      const filterId = (currentFilter && currentFilter?.id) ?? 'NEW';
      const newFilter =
        filterId && filterId === 'NEW'
          ? { ...currentFilter, id: null }
          : currentFilter;
      const filterJson = JSON.stringify(newFilter);
      dispatchSave({
        accessToken: accessToken,
        filterId: filterId === 'NEW' ? '' : filterId,
        filterJson,
        author: 'Diego Martinez',
        name: currentFilter?.name ?? '',
        lastUpdateDate: Date.now(),
      }).then(() => onClose());
    } else {
      onClose();
    }
  };

  return (
    <UIDefaultDialog
      open={open}
      onClose={onClose}
      title="Edit Filter"
      modalWidth="1210px"
    >
      <UIFlexWrapBox sx={{ p: 2, gap: 3, flexDirection: 'column' }}>
        <UIFlexWrapBox sx={{ gap: 5, alignItems: 'flex-end' }}>
          <Box>
            <Typography sx={{ fontSize: '13px', color: '#504F54', mb: 1.5 }}>
              Filter Name
            </Typography>
            <UIDefaultTextField
              defaultValue={currentFilter?.name}
              variant="standard"
              sx={{ width: '288px' }}
              onChange={(e) =>
                handleInputChange(e, { operation: 'changeFilterName' })
              }
            />
          </Box>

          <Box sx={{ fontSize: '13px', color: '#504F54' }}>
            <Typography sx={{ fontSize: '13px', color: '#504F54', mb: 1.5 }}>
              Description
            </Typography>
            <UIDefaultTextField
              defaultValue={currentFilter?.description}
              variant="standard"
              sx={{ width: '583px' }}
              onChange={(e) =>
                handleInputChange(e, { operation: 'changeFilterDescription' })
              }
            />
          </Box>
          <UIModalButton onClick={handleSave}>Save</UIModalButton>
        </UIFlexWrapBox>
        {currentFilter?.attributes && currentFilter?.attributes.length > 0
          ? currentFilter?.attributes.map((attribute, index) => (
              <EditFilterRow
                key={index}
                index={index}
                attribute={attribute}
                handleActionClick={handleActionClick}
                handleSelectChange={handleSelectChange}
                handleInputChange={handleInputChange}
              />
            ))
          : ''}
      </UIFlexWrapBox>
    </UIDefaultDialog>
  );
};
