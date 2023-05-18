/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { TextField, styled } from '@mui/material';

export const UIAuthTextField = styled(TextField)({
  width: 408,
  marginTop: '12px',
  '.MuiTextField-root': {
    '&:focus-visible': {
      outline: 'none',
    },
  },
  '.MuiOutlinedInput-input': {
    borderRadius: '6px',
    color: '#39474E',
    fontSize: 16,
    lineHeight: 20,
    padding: '12.5px 14px',
    border: 'none',
    outline: 'none',
    '&:focus-visible': {
      border: 'none',
    },
  },

  '.MuiInputLabel-root': {
    color: '#39474E',

    '&.Mui-focused': {
      color: '#39474E',
    },
  },

  '.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #D0D8DC !important',
  },
});

export const UIDefaultTextField = styled(TextField)({
  width: '250px',
  height: '36px',
  background: '#FFFFFF',
  border: '1px solid #D0D8DC',
  borderRadius: '6px',
  justifyContent: 'center',
  input: {
    padding: '0 8px',
    fontWeight: '400',
    fontSize: '13px',
    lineHeight: '20px',
    color: '#0050BE',
    '&::placeholder': {
      opacity: 1,
      color: 'grey',
      fontStyle: 'italic',
    },
    overflowX: 'clip',
    overflowY: 'clip',
  },
  borderBottom: '1px solid #D0D8DC',
  '& .MuiInputAdornment-root': { marginLeft: '5px' },
  '&:hover': { borderBottom: '1px solid #D0D8DC' },
  div: { '::before, ::after': { borderBottom: 'none !important' } },
  overflowX: 'scroll',
  overflowY: 'hidden',
});

interface UITextAreaProps {
  border?: string;
}

export const UITextArea = styled(TextField)<UITextAreaProps>(({ border }) => ({
  outline: 'none',
  resize: 'none',
  margin: 0,
  minWidth: '250px',
  borderRadius: '6px',
  '& .MuiInputBase-root': {
    borderRadius: '6px',
  },
  '& .MuiOutlinedInput-root.Mui-focused': {
    '& > fieldset': {
      border: border || '1px solid #CCCCCC',
    },
  },
  fieldset: {
    border: border || '1px solid #CCCCCC',
  },
  textarea: {
    padding: 0,
    fontSize: '14px',
    lineHeight: '24px',
    color: '#0050BE',
    '&::placeholder': {
      opacity: 1,
      color: 'grey',
      fontStyle: 'italic',
    },
  },
}));
