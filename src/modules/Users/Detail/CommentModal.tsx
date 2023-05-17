/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';
import { Typography, Box, IconButton } from '@mui/material';
import {
  UIFlexSpaceBox,
  UIModalButton,
  UISideDialog,
  UITextArea,
} from '@/components/UI';
import { Close } from '@mui/icons-material';
import { CommentCard } from './CommentCard';
import { DefaultModalProps } from '@/types';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { getAccessToken, getCommentsForEntityId } from '@/redux/slices';
import { NewEntityCommentsParams } from '@/types/entity.type';
import { newEntityComment } from '@/redux/slices/entity.slice';

interface CommentModalProps extends DefaultModalProps {
  entityId: string;
}

export const CommentModal = ({
  open,
  onClose,
  entityId,
}: CommentModalProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const stateAccessToken = useAppSelector(getAccessToken);
  const comments = useAppSelector(
    getCommentsForEntityId(entityId.toString() as string)
  );
  const [newComment, saveNewComment] = useState<string>('');

  const dispatchSave = (args: NewEntityCommentsParams): Promise<unknown> => {
    return new Promise<void>((resolve) => {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        newEntityComment(args)
      );
      resolve();
    });
  };
  const handleInputChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    const value = event.currentTarget.value ?? null;

    if (value != null) {
      saveNewComment(value);
    }
  };

  const handleSave: () => void = () => {
    if (newComment && stateAccessToken) {
      dispatchSave({
        accessToken: stateAccessToken,
        entityId: entityId.toString(),
        entityComment: newComment,
        author: 'Diego Martinez',
      }).then(() => {
        onClose();
      });
    } else {
      onClose();
    }
  };

  return (
    <UISideDialog open={open} onClose={onClose} offset={68} width={575}>
      <UIFlexSpaceBox sx={{ m: 0, p: 2 }}>
        <Box></Box>
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
      </UIFlexSpaceBox>
      <Box sx={{ px: 3, py: 2.5 }}>
        <Typography fontSize={16}>Comments</Typography>
        <Box
          sx={{
            with: '481px',
            border: '1px solid #CCCCCC',
            borderRadius: '6px',
            padding: '30px 25px 0px 25px',
          }}
        >
          <UITextArea
            multiline
            rows={7}
            border="none"
            sx={{ width: '100%' }}
            placeholder="Comment"
            value={newComment}
            onChange={handleInputChange}
          />
          <UIFlexSpaceBox sx={{ borderTop: '1px solid #EDEDED', py: '6px' }}>
            <IconButton>
              <Image
                src={'images/icons/attachfile.svg'}
                loader={appImageLoader}
                width={24}
                height={24}
                alt="comment"
              />
            </IconButton>
            <UIModalButton onClick={handleSave}>Save</UIModalButton>
          </UIFlexSpaceBox>
        </Box>
        {comments.map((comment) => {
          return <CommentCard key={comment.id} comment={comment} />;
        })}
      </Box>
    </UISideDialog>
  );
};
