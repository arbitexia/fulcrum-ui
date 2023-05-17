/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { Box } from '@mui/material';
import {
  UIDefaultDialog,
  UISelect,
  UIFlexWrapBox,
  UIFlexCenterBox,
  UIModalButton,
} from '@/components/UI';
import { DefaultModalProps } from '@/types';
import {
  filterList,
  peerList,
  frequencyList,
  resultRefreshList,
  modelResultList,
  modelAnalystList,
  individualList,
} from '@/_mock';

export const ModelsConfigModal = ({
  open,
  onClose,
}: DefaultModalProps): JSX.Element => {
  const handleChange = (): void => {
    console.log('handle');
  };
  return (
    <UIDefaultDialog
      open={open}
      onClose={onClose}
      title="Model Configuration Parameters"
      modalWidth="668px"
    >
      <UIFlexWrapBox sx={{ gap: 3, flexDirection: 'column' }}>
        <UIFlexWrapBox sx={{ alignItems: 'center' }}>
          <Box sx={{ width: '125px', fontSize: '13px', color: '#504F54' }}>
            Filters
          </Box>
          <UISelect
            value={1}
            itemList={filterList}
            handleChange={handleChange}
            width="209px"
          />
        </UIFlexWrapBox>
        <UIFlexWrapBox sx={{ alignItems: 'center' }}>
          <Box sx={{ width: '125px', fontSize: '13px', color: '#504F54' }}>
            Peer Comparisons
          </Box>
          <UISelect
            value={1}
            itemList={peerList}
            handleChange={handleChange}
            width="209px"
          />
        </UIFlexWrapBox>
        <UIFlexWrapBox sx={{ alignItems: 'center' }}>
          <Box sx={{ width: '125px', fontSize: '13px', color: '#504F54' }}>
            Scoring Frequency
          </Box>
          <UISelect
            value={1}
            itemList={frequencyList}
            handleChange={handleChange}
            width="162px"
          />
        </UIFlexWrapBox>
        <UIFlexWrapBox sx={{ alignItems: 'center' }}>
          <Box sx={{ fontSize: '13px', color: '#504F54' }}>
            Dashboard Result Refresh Frequency
          </Box>
          <UISelect
            value={1}
            itemList={resultRefreshList}
            handleChange={handleChange}
            width="220px"
          />
        </UIFlexWrapBox>
        <UIFlexWrapBox sx={{ alignItems: 'center' }}>
          <Box sx={{ fontSize: '13px', color: '#504F54' }}>
            Model Results Displayed on Dashboard
          </Box>
          <UISelect
            value={1}
            itemList={modelResultList}
            handleChange={handleChange}
            width="100px"
          />
        </UIFlexWrapBox>
        <UIFlexWrapBox sx={{ alignItems: 'center' }}>
          <Box sx={{ fontSize: '13px', color: '#504F54' }}>
            Model Shared with Other Analysts
          </Box>
          <UISelect
            value={1}
            itemList={modelAnalystList}
            handleChange={handleChange}
            width="100px"
          />
        </UIFlexWrapBox>
        <UIFlexWrapBox sx={{ alignItems: 'center' }}>
          <Box sx={{ fontSize: '13px', color: '#504F54' }}>
            Basis Report Results Automated for top individuals
          </Box>
          <UISelect
            value={1}
            itemList={individualList}
            handleChange={handleChange}
            width="100px"
          />
        </UIFlexWrapBox>
      </UIFlexWrapBox>
      <UIFlexCenterBox sx={{ mt: '36px', mb: '10px' }}>
        <UIModalButton>Save</UIModalButton>
      </UIFlexCenterBox>
    </UIDefaultDialog>
  );
};
