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
import { formatDate } from '@/libs/time-utils';

export const CommentCard = ({
  comment,
}: {
  comment: EntityComment;
}): JSX.Element => {
  const commentDate = new Date(comment.timestamp);
  return (
    <Box m={3} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <UIFlexSpaceBox>
        <UIFlexCenterBox>{comment.author}</UIFlexCenterBox>
        <UIFlexCenterBox sx={{ opacity: 0.75 }}>
          {formatDate(commentDate, 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
        </UIFlexCenterBox>
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
