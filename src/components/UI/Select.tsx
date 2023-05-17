/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import {
  Box,
  InputLabel,
  Typography,
  Select,
  MenuItem,
  styled,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { ReactNode } from 'react';

export interface UISelectBoxProps {
  textColor?: string;
  width?: string;
  height?: string;
}

export const UISelectBox = styled(Select, {
  shouldForwardProp: (prop) => prop !== 'textColor',
})<UISelectBoxProps>(({ textColor, width, height }) => ({
  minWidth: width ? width : '250px',
  height: height ? height : '32px',
  fontWeight: 400,
  fontSize: '13px',
  lineHeight: '20px',
  color: textColor || '#0050BE',
  background: '#FFFFFF',
  border: '1px solid #D0D8DC',
  borderRadius: '6px',
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #D0D8DC',
  },
  '& fieldset': {
    display: 'none',
  },
}));

interface UISelectItemProps {
  textColor?: string;
}

export const UISelectItem = styled(MenuItem, {
  shouldForwardProp: (prop) => prop !== 'textColor',
})<UISelectItemProps>(({ textColor }) => ({
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '32px',
  color: textColor || '#39474E',
}));

interface UISelectProps {
  id?: string;
  labelId?: string;
  itemList: { id: number | string; name: string }[];
  handleChange: (event: SelectChangeEvent<unknown>, child?: ReactNode) => void;
  value?: number | number[] | string | string[];
  defaultValue?: number | number[] | string | string[];
  placeholder?: React.ReactNode | string | number | number[] | string[];
  color?: string;
  width?: string;
  height?: string;
  label?: string;
  multiple?: boolean;
  disabled?: boolean;
}

export const UISelect = ({
  id,
  labelId,
  itemList,
  handleChange,
  value,
  defaultValue,
  placeholder,
  label,
  color,
  width,
  disabled = false,
  height,
  multiple = false,
}: UISelectProps): JSX.Element => {
  return (
    <Box>
      {label && (
        <InputLabel
          variant="standard"
          htmlFor="demo-simple-select-helper"
          id={labelId}
        >
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ marginLeft: '5px' }}
          >
            {label}
          </Typography>
        </InputLabel>
      )}
      <UISelectBox
        id={id}
        labelId={label && labelId}
        value={value}
        defaultValue={defaultValue}
        label={label}
        onChange={handleChange}
        textColor={color}
        width={width}
        height={height}
        displayEmpty
        renderValue={value !== -1 ? undefined : () => placeholder}
        disabled={disabled}
        multiple={multiple}
      >
        {itemList.map((item, index) => {
          return (
            <UISelectItem key={index} value={item.id} textColor="#0050BE">
              {item.name}
            </UISelectItem>
          );
        })}
      </UISelectBox>
    </Box>
  );
};
