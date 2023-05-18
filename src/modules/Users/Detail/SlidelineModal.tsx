/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { Checkbox, Box, Typography } from '@mui/material';
import {
  UIDefaultDialog,
  UIFlexCenterBox,
  UIFlexColumnBox,
  UIFlexWrapBox,
  UIModalButton,
  UIDefaultTextField,
  UISelect,
} from '@/components/UI';
import { modelList } from '@/_mock';
import { DefaultModalProps } from '@/types';

interface SlidelineModalProps extends DefaultModalProps {
  onUpdate: () => void;
}

export const SlidelineModal = ({
  open,
  onClose,
  onUpdate,
}: SlidelineModalProps): JSX.Element => {
  return (
    <UIDefaultDialog
      open={open}
      onClose={onClose}
      title="Slideline Settings"
      modalWidth="527px"
    >
      <UIFlexWrapBox sx={{ alignItems: 'center' }}>
        <Box
          sx={{
            fontSize: '14px',
            color: '#504F54',
            textAlign: 'right',
            width: '85px',
          }}
        >
          Risk Model
        </Box>
        <UISelect
          value={1}
          itemList={modelList.items}
          handleChange={() => {
            console.log('handleChange');
          }}
          width="212px"
          height="36px"
        />
        <UIFlexCenterBox sx={{ gap: 0, fontSize: '13px', color: '#39474E' }}>
          <Checkbox sx={{ width: '32px', height: '32px' }} />
          Apply to all models
        </UIFlexCenterBox>
      </UIFlexWrapBox>
      <UIFlexWrapBox sx={{ marginTop: '36px', alignItems: 'center' }}>
        <Box
          sx={{
            fontSize: '14px',
            color: '#504F54',
            textAlign: 'right',
            height: '76px',
            width: '85px',
          }}
        >
          Slideline until
        </Box>
        <UIFlexColumnBox
          sx={{ justifyContent: 'space-between', ml: '20px', height: '84px' }}
        >
          <UIDefaultTextField
            defaultValue={5}
            sx={{ width: '60px', height: '32px', paddingLeft: '8px' }}
            variant="standard"
          />
          <UIDefaultTextField
            defaultValue={30}
            sx={{ width: '60px', height: '32px', paddingLeft: '8px' }}
            variant="standard"
          />
        </UIFlexColumnBox>
        <UIFlexColumnBox
          sx={{
            fontSize: '13px',
            color: '#39474E',
            alignItems: 'flex-start',
            ml: '15px',
          }}
        >
          <Typography variant="h6">% increase in model score</Typography>
          <Typography variant="h6" sx={{ color: '#93A4AD' }}>
            or / and
          </Typography>
          <Typography variant="h6">days from today</Typography>
        </UIFlexColumnBox>
      </UIFlexWrapBox>
      <UIFlexCenterBox sx={{ mt: '42px', mb: '10px' }}>
        <UIModalButton
          onClick={() => {
            onUpdate();
            onClose();
          }}
        >
          Update
        </UIModalButton>
      </UIFlexCenterBox>
    </UIDefaultDialog>
  );
};
