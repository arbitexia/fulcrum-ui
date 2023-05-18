/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { ButtonProps } from '@mui/material';

export interface UIDefaultDialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode | React.ReactNode[];
  buttonText?: string;
  title?: string;
  btnColor?: string;
  showBtn?: boolean;
  onBtnClick?: () => void;
  modalWidth?: string;
  modalHeight?: string;
  showSecondaryBtn?: boolean;
  secondaryBtnClick?: () => void;
  secondaryBtnText?: string;
  secondaryBtnColor?: string;
  btnDisabled?: boolean;
  secondaryBtnDisabled?: boolean;
  btnLoader?: boolean;
}

export interface UISideDialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode | React.ReactNode[];
  offset: number;
  width: number;
}

export interface StyledSideDialogProps {
  offset: number;
  width: number;
}

export interface StyledModalButtonProps extends ButtonProps {
  btnColor?: string;
}

export interface UIDefaultDialogWidthProps {
  width?: string;
  height?: string;
}
export interface UIConfirmationModalProps {
  open: boolean;
  handleClose: () => void;
  modalText: string;
  handleSubmit: () => void;
  buttonText: string;
  title: string;
}
