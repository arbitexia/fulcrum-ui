/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { Button, Dialog, DialogTitle } from '@mui/material';
import { styled } from '@mui/system';
import {
  StyledModalButtonProps,
  UIDefaultDialogWidthProps,
  StyledSideDialogProps,
} from './types';

export const StyledSideDialog = styled(Dialog)<StyledSideDialogProps>(
  ({ offset, width }) => ({
    '& .MuiDialog-paper': {
      position: 'absolute',
      margin: 0,
      background: '#FFFFFF',
      border: '1px solid #E5E1E9',
      boxShadow: 'none',
      top: offset,
      right: 0,
      height: `calc(100% - ${offset}px)`,
      width: width,
    },
  })
);

export const StyledDialogBox = styled(Dialog)<UIDefaultDialogWidthProps>(
  ({ width, height }) => ({
    '& .MuiDialog-paper': {
      background: '#FFFFFF',
      border: '1px solid #000000',
      borderRadius: '0px',
      maxWidth: width,
      maxHeight: height,
    },
    '& .MuiDialogActions-root': {
      padding: '1rem 0px 0px 0px',
    },
  })
);

export const StyledModalDialogTitle = styled(DialogTitle)({
  margin: '0px',
  padding: '9px 0px 9px 24px',
  display: 'flex',
  background: '#ECEFF1',
  height: '48px',
  justifyContent: 'space-between',
  alignItems: 'center',
  letterSpacing: '0.15px',
  fontWeight: '400',
  fontSize: '16px',
  lineHeight: '32px',
  color: '#39474E',

  svg: {
    color: '#889AAE',
  },
});

export const StyledModalButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'btnColor',
})<StyledModalButtonProps>(({ btnColor }) => ({
  background: btnColor ? btnColor : '#28B446',
  boxShadow: '0px 2px 4px 0px #192A5933',
  width: '130px',
  height: '36px',
  borderRadius: '8px',
  p: {
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.25px',
    textTransform: 'capitalize',
    color: '#ffffff',
  },

  '&:hover': {
    background: btnColor ? btnColor : '#28B446',
  },
  '&:disabled': {
    background: 'rgba(40, 180, 70, 0.3)',
    color: 'rgba(0, 0, 0, 0.4)',
    boxShadow: 'none',
  },
}));

export const StyledOutlinedModalButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'btnColor',
})<StyledModalButtonProps>(({ btnColor }) => ({
  border: `1px solid ${btnColor ? btnColor : '#28B446'}`,
  boxShadow: '0px 2px 4px 0px #192A5933',
  width: '130px',
  height: '36px',
  borderRadius: '8px',
  p: {
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.25px',
    textTransform: 'capitalize',
    color: btnColor ? btnColor : '#28B446',
  },

  '&:hover': {
    border: `1px solid ${btnColor ? btnColor : '#28B446'}`,
    background: 'transparent',
  },
  '&:disabled': {
    border: `1px solid rgba(230, 20, 20, 0.3)`,
    boxShadow: 'none',
    p: {
      color: 'rgba(180, 20, 20, 0.5)',
    },
  },
}));
