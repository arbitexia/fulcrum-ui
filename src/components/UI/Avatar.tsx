/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { styled, Box, Avatar } from '@mui/material';

export const UIAvatarArea = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px dashed #E3E9EF',
  width: '120px',
  height: '120px',
  borderRadius: '20px',
  mb: '30px',
  position: 'relative',
  '& input': {
    display: 'none',
  },
});

const stringToColor = (string: string): string => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

const stringAvatar = (name: string): object => {
  return {
    sx: {
      width: 36,
      height: 36,
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
};

interface UIAvatarWithStatusProps {
  src: string;
  name: string;
  width?: number;
}

export const UIAvatarWithStatus = ({
  src,
  name,
  width,
}: UIAvatarWithStatusProps): JSX.Element => {
  const size = width ? width : 36;
  return (
    <Box sx={{ width: size, height: size, position: 'relative' }}>
      {src && src !== '' ? (
        <Avatar src={src} sx={{ width: size, height: size }} />
      ) : (
        <Avatar {...stringAvatar(name)}></Avatar>
      )}
      <Box
        sx={{
          width: 8,
          height: 8,
          background: '#00AC65',
          borderRadius: '50%',
          border: '2px solid #FFFFFF',
          position: 'absolute',
          right: 0,
          bottom: 0,
        }}
      />
    </Box>
  );
};
