/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import {
  UIDefaultDialog,
  UIFlexCenterBox,
  UIFlexWrapBox,
  UIModalButton,
} from '@/components/UI';
import { DefaultModalProps } from '@/types';
import UIAutocomplete from '@/components/UI/UIAutocomplete';
import { noop } from 'lodash';
import { EditValueItemProps } from '@/types/common.type';

interface EditValueModalProps extends DefaultModalProps {
  lists: { id: string; label: string }[];
  itemProps: EditValueItemProps;
}

export const EditValueModal = ({
  open,
  onClose,
  lists,
  itemProps,
}: EditValueModalProps): JSX.Element => {
  const { values, handleChange } = itemProps;
  const [textValue, setTextValue] = useState<string>(
    values ? values.join(',') : ''
  );
  const [valuesLists, setValuesLists] = useState<string[]>(values ?? []);
  return (
    <UIDefaultDialog
      open={open}
      onClose={onClose}
      title="Edit value"
      modalWidth="668px"
    >
      <UIFlexWrapBox sx={{ gap: 3, flexDirection: 'column' }}>
        <UIFlexWrapBox sx={{ alignItems: 'center' }}>
          <Box>
            <Typography sx={{ fontSize: '13px', color: '#504F54', mb: 1.5 }}>
              Add values
            </Typography>
            <UIAutocomplete
              matchItemValues={valuesLists}
              textValue={textValue}
              lists={lists}
              setValuesLists={setValuesLists}
              handleChange={noop}
              setTextValue={setTextValue}
              separators={[',', '\n']}
              listPrefix="@"
              onDoubleClick={noop}
              textArea={true}
              readOnly={false}
            />
          </Box>
        </UIFlexWrapBox>
      </UIFlexWrapBox>
      <UIFlexCenterBox>
        <UIModalButton
          sx={{ fontWeight: 400 }}
          onClick={() => {
            handleChange(valuesLists);
            onClose();
          }}
        >
          Save
        </UIModalButton>
      </UIFlexCenterBox>
    </UIDefaultDialog>
  );
};
