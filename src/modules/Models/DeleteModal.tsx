/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import {
  UIDefaultDialog,
  UIFlexWrapBox,
  UIFlexCenterBox,
  UIModalButton,
} from '@/components/UI';
import { DefaultModalProps } from '@/types';
import { useAppSelector } from '@/hooks';
import { RootState } from '@/redux/store';
import {
  attributeNameByIdSelector,
  getSelectedListNameById,
  modelNameByIdSelctor,
} from '@/redux/slices';
import { noop } from 'lodash';

interface DeleteModalProps extends DefaultModalProps {
  id: string | number;
  typeUrl: string;
  onConfirm: () => void;
  title: string;
}
const typeUrlToName: {
  [typeUrl: string]: (id: string) => (state: RootState) => string | undefined;
} = {
  model: modelNameByIdSelctor,
  risk: attributeNameByIdSelector,
  list: getSelectedListNameById,
};

export const DeleteConfirmModal = ({
  open,
  onClose,
  id,
  typeUrl,
  onConfirm,
  title,
}: DeleteModalProps): JSX.Element => {
  const name = useAppSelector(
    typeUrl in typeUrlToName ? typeUrlToName[typeUrl](id as string) : noop
  );
  const typeURLToType: { [typeUrl: string]: string } = {
    model: 'model',
    risk: 'risk indicator',
    list: 'list',
    filter: 'filter',
  };
  const type: string = typeURLToType[typeUrl];
  return (
    <UIDefaultDialog
      open={open}
      onClose={onClose}
      title={title}
      modalWidth="668px"
    >
      <UIFlexWrapBox sx={{ gap: 3, flexDirection: 'row' }}>
        <UIFlexWrapBox sx={{ gap: 5, alignItems: 'center' }}>
          <>
            Would you like to delete {type} {name}?
          </>
        </UIFlexWrapBox>
      </UIFlexWrapBox>
      <UIFlexCenterBox sx={{ mt: '36px', mb: '10px' }}>
        <UIModalButton onClick={onConfirm}>Delete</UIModalButton>
        <UIModalButton onClick={onClose}>Cancel</UIModalButton>
      </UIFlexCenterBox>
    </UIDefaultDialog>
  );
};
