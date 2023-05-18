/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { Close } from '@mui/icons-material';
import {
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import {
  StyledModalButton,
  StyledModalDialogTitle,
  StyledDialogBox,
  StyledOutlinedModalButton,
  StyledSideDialog,
} from './ui';
import {
  UIDefaultDialogProps,
  UIConfirmationModalProps,
  UISideDialogProps,
} from './types';

export const UIDefaultDialog = ({
  open,
  onClose,
  children,
  buttonText,
  title,
  btnColor,
  showBtn,
  btnLoader,
  onBtnClick,
  modalWidth,
  modalHeight,
  showSecondaryBtn,
  secondaryBtnClick,
  secondaryBtnText,
  secondaryBtnColor,
  secondaryBtnDisabled,
  btnDisabled,
}: UIDefaultDialogProps): JSX.Element => {
  return (
    <StyledDialogBox
      onClose={onClose}
      open={open}
      width={modalWidth}
      height={modalHeight}
      fullWidth
    >
      {title ? (
        <StyledModalDialogTitle variant="h5">
          {title}
          {onClose ? (
            <IconButton disableRipple onClick={onClose}>
              <Close />
            </IconButton>
          ) : null}
        </StyledModalDialogTitle>
      ) : (
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {title}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 15,
              top: 15,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
      )}
      <Box sx={{ px: 3, py: 2.5 }}>
        <DialogContent sx={{ p: 0 }}>{children}</DialogContent>

        {showBtn ? (
          <DialogActions>
            {showSecondaryBtn ? (
              <StyledOutlinedModalButton
                disabled={secondaryBtnDisabled}
                variant="outlined"
                autoFocus
                onClick={secondaryBtnClick}
                btnColor={secondaryBtnColor}
                disableRipple
                disableTouchRipple
                disableFocusRipple
              >
                <Typography>{secondaryBtnText}</Typography>
              </StyledOutlinedModalButton>
            ) : null}

            <StyledModalButton
              disabled={btnDisabled}
              autoFocus
              onClick={onBtnClick}
              btnColor={btnColor}
            >
              {btnLoader ? (
                <CircularProgress color="success" size={24} />
              ) : (
                <Typography>{buttonText}</Typography>
              )}
            </StyledModalButton>
          </DialogActions>
        ) : null}
      </Box>
    </StyledDialogBox>
  );
};

export const UIConfirmationModal = ({
  open,
  handleClose,
  modalText,
  handleSubmit,
  buttonText,
  title,
}: UIConfirmationModalProps): JSX.Element => {
  return (
    <UIDefaultDialog
      open={open}
      onClose={() => handleClose()}
      title={title}
      showBtn={true}
      buttonText={buttonText}
      onBtnClick={() => handleSubmit()}
    >
      <Typography>{modalText}</Typography>
    </UIDefaultDialog>
  );
};

export const UISideDialog = ({
  open,
  onClose,
  offset,
  width,
  children,
}: UISideDialogProps): JSX.Element => {
  return (
    <StyledSideDialog
      open={open}
      onClose={onClose}
      offset={offset}
      width={width}
      BackdropProps={{ invisible: true }}
    >
      {children}
    </StyledSideDialog>
  );
};
