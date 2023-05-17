/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { UIFlexSpaceBox, UIFlexCenterBox } from '@/components/UI';
import { EntityComment } from '@/types/entity.type';

export const CommentCard = ({
  comment,
}: {
  comment: EntityComment;
}): JSX.Element => {
  return (
    <Box m={3} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <UIFlexSpaceBox>
        <UIFlexCenterBox>Author: {comment.author}</UIFlexCenterBox>
      </UIFlexSpaceBox>
      <Typography
        sx={{
          fontWeight: '400',
          fontSize: '15px',
          lineHeight: '24px',
          letterSpacing: '0.125px',
          color: '#39474E',
        }}
      >
        {comment.comment}
      </Typography>
      <Divider />
    </Box>
  );
};
