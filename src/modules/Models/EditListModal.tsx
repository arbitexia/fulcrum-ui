/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { ChangeEvent, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import {
  UIDefaultDialog,
  UIFlexWrapBox,
  UIFlexCenterBox,
  UIModalButton,
  UITextArea,
  UIDefaultTextField,
} from '@/components/UI';
import {
  DefaultModalProps,
  List,
  NewListParams,
  RetrieveListsParams,
} from '@/types';

import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  addNewList,
  getNewList,
  getSelectedListById,
  getSelectedListId,
  listValueChanger,
  newList,
  retrieveLists,
  setSelectedListId,
} from '@/redux/slices';
import { noop } from 'lodash';
import { formatListId } from '@/libs/string-utils';

interface EditListModalProps extends DefaultModalProps {
  id: number | string | null;
  accessToken: string | null;
}

export const EditListModal = ({
  open,
  onClose,
  id,
  accessToken,
}: EditListModalProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const newListSelected: List | null = useAppSelector(getNewList);
  const selectedListId: string | null = useAppSelector(getSelectedListId);
  const existingListSelected: List | undefined = useAppSelector(
    getSelectedListById(id as string | null)
  );
  const currentList: List | null =
    id && existingListSelected ? existingListSelected : newListSelected;

  const listModalTitle: string = id ? 'Edit List' : 'Create List';

  useEffect(() => {
    if (dispatch) {
      if (id == null && !newListSelected) {
        dispatch(addNewList());
      } else if (id !== null && selectedListId == null) {
        dispatch(setSelectedListId({ id }));
      }
    }
  }, [id, newListSelected, existingListSelected, dispatch, selectedListId]);

  const dispatchSave = (args: NewListParams): Promise<unknown> => {
    return new Promise<void>((resolve) => {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        newList(args)
      );
      resolve();
    });
  };

  const dispatchRefresh = (args: RetrieveListsParams): Promise<unknown> => {
    return new Promise<void>((resolve) => {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveLists(args)
      );
      resolve();
    });
  };

  const removeBlankRows = (value: string): string => {
    const lines = value.split(',');
    const nonBlankLines = lines.filter((line) => line.trim() !== '');
    return nonBlankLines.join(',');
  };

  const handleSave: () => void = () => {
    if (currentList && accessToken) {
      const listId = currentList.listId;
      const description = currentList.description;
      const listValues = removeBlankRows(currentList.listValues);
      if (listId && listValues) {
        const newListId = formatListId(listId);
        dispatchSave({
          accessToken,
          listId: newListId,
          listValues,
          description: description || '',
          owner: 'Diego Martinez',
          lastUpdateDate: new Date().getTime(),
        }).then(() => {
          dispatchRefresh({
            accessToken,
            limit: 25,
          }).then(onClose);
        });
      } else {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    operation: string
  ): void => {
    if (currentList) {
      dispatch(
        listValueChanger({
          id,
          operation,
          value: event.target.value,
        })
      );
    }
  };
  return (
    <UIDefaultDialog
      open={open}
      onClose={onClose}
      title={listModalTitle}
      modalWidth="668px"
    >
      <UIFlexWrapBox sx={{ gap: 3, flexDirection: 'column' }}>
        <UIFlexWrapBox sx={{ gap: 5, alignItems: 'center' }}>
          <Box>
            <Typography sx={{ fontSize: '13px', color: '#504F54', mb: 1.5 }}>
              Value List Name
            </Typography>
            <UIDefaultTextField
              defaultValue={currentList?.listId || ''}
              onChange={(event) => handleChange(event, 'updateValueListId')}
              variant="standard"
              sx={{ width: '209px' }}
            />
          </Box>

          <Box sx={{ fontSize: '13px', color: '#504F54' }}>
            <Typography sx={{ fontSize: '13px', color: '#504F54', mb: 1.5 }}>
              Description
            </Typography>
            <UIDefaultTextField
              defaultValue={currentList?.description || ''}
              variant="standard"
              onChange={(event) =>
                handleChange(event, 'updateValueListDescription')
              }
              sx={{ width: '341px' }}
            />
          </Box>
        </UIFlexWrapBox>
        <UIFlexWrapBox sx={{ alignItems: 'center' }}>
          <Box>
            <Typography sx={{ fontSize: '13px', color: '#504F54', mb: 1.5 }}>
              Add List Values
            </Typography>
            <UITextArea
              multiline
              rows={10}
              onChange={(event) => handleChange(event, 'updateListValues')}
              value={
                currentList && currentList.listValues
                  ? currentList.listValues.split(',').join('\n')
                  : ''
              }
            />
          </Box>
        </UIFlexWrapBox>
      </UIFlexWrapBox>
      <UIFlexCenterBox sx={{ mt: '36px', mb: '10px' }}>
        <UIModalButton onClick={accessToken ? handleSave : noop}>
          Save
        </UIModalButton>
      </UIFlexCenterBox>
    </UIDefaultDialog>
  );
};
