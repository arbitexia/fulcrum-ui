/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { ReactNode } from 'react';
import { Close } from '@mui/icons-material';
import { styled, Chip, ChipProps, IconProps } from '@mui/material';

interface Props extends ChipProps {
  bgColor: string;
  textColor?: string;
  hideDeleteIcon?: boolean;
}

interface StyledIconProps extends IconProps {
  textColor?: string;
}

export const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'textColor',
})<Props>(({ bgColor, textColor }) => ({
  borderRadius: '5px',
  marginRight: '10px',
  color: textColor || '#fff',
  background: bgColor || '#fff',
}));

export const StyledIcon = styled(Close, {
  shouldForwardProp: (prop) => prop !== 'textColor',
})<StyledIconProps>(({ textColor }) => ({
  fontSize: `12px !important`,
  '&&': {
    color: `${textColor || '#fff'} !important`,
    '&:hover': { color: `${textColor} !important` },
  },
}));

export const UIChip = ({
  bgColor,
  textColor,
  hideDeleteIcon = false,
  ...rest
}: Props): ReactNode => {
  return (
    <StyledChip
      bgColor={bgColor}
      textColor={textColor}
      deleteIcon={<StyledIcon textColor={textColor} />}
      {...(!hideDeleteIcon && { onDelete: () => console.log('handle delete') })}
      {...rest}
    />
  );
};

export interface UIChipProps {
  condition?: boolean;
  bgColor?: string;
  textColor?: string;
}

export const UIStatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'condition',
})<UIChipProps>(({ condition }) => ({
  borderRadius: 0,
  width: '70px',
  height: '24px',
  color: condition ? '#FF5722' : '#4CAF50',
  backgroundColor: condition ? '#FBE9E7' : '#E8F5E9',
  '& .MuiChip-label': {
    fontSize: '12px',
    padding: 0,
  },
}));

export const UIScoreChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'textColor',
})<UIChipProps>(({ bgColor, textColor }) => ({
  backgroundColor: bgColor,
  color: textColor || '#FFFFFF',
  borderRadius: '50%',
  width: '32px',
  height: '32px',
  '& .MuiChip-label': {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '32px',
    padding: 0,
  },
}));

export const UINameChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'condition',
})<UIChipProps>(({ condition }) => ({
  background: condition ? '#F4F4F4' : '#E7E7E7',
  borderRadius: '6px',
  width: '120px',
  height: '32px',
  color: '#75777D',
  fontWeight: 400,
  '& .MuiChip-label': {
    width: '84px',
    whiteSpace: 'normal',
    lineHeight: condition ? '20px' : '12px',
    fontSize: condition ? '14px' : '10px',
  },
}));
