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

interface ErrorModalProps extends DefaultModalProps {
  id: string | number;
  typeUrl: string;
  title: string;
}
const typeUrlToName: {
  [typeUrl: string]: (id: string) => (state: RootState) => string | undefined;
} = {
  model: modelNameByIdSelctor,
  risk: attributeNameByIdSelector,
  list: getSelectedListNameById,
};

export const ErrorModal = ({
  open,
  onClose,
  id,
  typeUrl,
  title,
}: ErrorModalProps): JSX.Element => {
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
            Could not delete {type} {name}.
          </>
        </UIFlexWrapBox>
        <UIFlexWrapBox sx={{ gap: 5, alignItems: 'center' }}>
          <>Currently it is being used in a model.</>
        </UIFlexWrapBox>
      </UIFlexWrapBox>
      <UIFlexCenterBox sx={{ mt: '36px', mb: '10px' }}>
        <UIModalButton onClick={onClose}>Cancel</UIModalButton>
      </UIFlexCenterBox>
    </UIDefaultDialog>
  );
};
