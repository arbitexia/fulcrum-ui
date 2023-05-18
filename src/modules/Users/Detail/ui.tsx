/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { styled, Chip, Typography, Box, Button, Dialog } from '@mui/material';
import { UIFlexSpaceBox, UIFlexCenterBox } from '@/components/UI';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';

export const StyledActionDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    position: 'absolute',
    margin: 0,
    background: '#FFFFFF',
    border: '1px solid #E5E1E9',
    boxShadow: 'none',
    top: '68px',
    right: 0,
    height: '550px',
    minWidth: '1120px',
  },
});

export const StyledHeader = styled(Typography)({
  fontWeight: '700',
  fontSize: '24px',
  lineHeight: '32px',
  letterSpacing: '0.2px',
  color: '#283238',
});

export const StyledChip = styled(Chip)({
  padding: '10px',
  borderRadius: '4px',
  background: '#ECEFF1',
  height: '24px',
  color: '#485A63',
  cursor: 'pointer',

  '& .MuiChip-label': {
    paddingRight: 0,
    paddingLeft: '5px',
  },
});

export const StyledLegendBox = styled(Box)({
  fontSize: '14px',
  lineHeight: '20px',
  color: '#485A63',
});

export const StyledAddButton = styled(Button)({
  background: '#FFFFFF',
  border: '1px solid #D0D8DC',
  borderRadius: '6px',
  fontWeight: 400,
  fontSize: 13,
  color: '#2E2C34',
  alignSelf: 'flex-end',
});

export const StyledSendButton = styled(Button)({
  background: '#CCCCCC',
  border: '1px solid #D0D8DC',
  color: '#2E2C34',
  borderRadius: '6px',
  fontWeight: 400,
  fontSize: 13,
  width: 135,
  height: 36,
});

export const StyledTabText = styled(Typography)({
  textTransform: 'capitalize',
  fontSize: '14px',
});

export const StyledLegendWrapper = styled(Box)({
  position: 'absolute',
  right: 0,
  top: '22%',
});

interface StyledPeerChipProps {
  bgColor: string;
  label: string;
  onClick: () => void; // React.Dispatch<React.SetStateAction<boolean>>;
}

export const StyledPeerChip = ({
  bgColor,
  label,
  ...rest
}: StyledPeerChipProps): JSX.Element => {
  return (
    <UIFlexSpaceBox
      sx={{
        cursor: 'pointer',
        height: '24px',
        background: '#ECEFF1',
        borderRadius: '4px',
      }}
      {...rest}
    >
      <UIFlexCenterBox
        sx={{
          width: '29px',
          height: '24px',
          background: bgColor,
          borderRadius: '4px 0 0 4px',
        }}
      >
        <Image
          src={'images/icons/profile-peer.svg'}
          loader={appImageLoader}
          width={18}
          height={14}
          alt="peer"
        />
      </UIFlexCenterBox>
      <Typography
        sx={{
          fontWeight: '400',
          fontSize: '13px',
          lineHeight: '20px',
          color: '#485A63',
          paddingRight: 1,
        }}
      >
        {label}
      </Typography>
    </UIFlexSpaceBox>
  );
};
