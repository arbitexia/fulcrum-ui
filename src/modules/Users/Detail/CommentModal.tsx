/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { ChangeEvent, useEffect, useState } from 'react';
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
import {
  getCommentsForEntityId,
  getEntityComments,
  getIsCommentsInitialized,
} from '@/redux/slices';
import { NewEntityCommentsParams } from '@/types/entity.type';
import { newEntityComment } from '@/redux/slices/entity.slice';

interface CommentModalProps extends DefaultModalProps {
  entityId: string;
  accessToken: string | null;
}

export const CommentModal = ({
  open,
  onClose,
  entityId,
  accessToken = null,
}: CommentModalProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const isCommentsInitialized = useAppSelector(getIsCommentsInitialized);
  const comments = useAppSelector(getCommentsForEntityId(entityId as string));
  const [newComment, saveNewComment] = useState<string>('');
  const [needsReload, setNeedsReload] = useState<boolean>(false);

  useEffect(() => {
    if ((needsReload || !isCommentsInitialized) && accessToken && entityId) {
      setNeedsReload(false);
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getEntityComments({
          accessToken,
          entityId,
        })
      );
    }
  }, [accessToken, entityId, dispatch, needsReload, isCommentsInitialized]);

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
    if (newComment && accessToken) {
      dispatchSave({
        accessToken,
        entityId: entityId,
        entityComment: newComment,
        author: 'Diego Martinez',
      }).then(() => {
        saveNewComment('');
        setNeedsReload(true);
      });
    }
  };

  const handleClose: () => void = () => {
    saveNewComment('');
    setNeedsReload(true);
    onClose();
  };

  return (
    <UISideDialog open={open} onClose={handleClose} offset={68} width={575}>
      <UIFlexSpaceBox sx={{ m: 0, p: 2 }}>
        <Box sx={{ paddingTop: '9px' }}>
          <Typography fontSize={16}>Comments</Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
        <Box
          sx={{
            with: '481px',
            border: '1px solid #CCCCCC',
            borderRadius: '6px',
            padding: '0px 25px 0px 25px',
          }}
        >
          <UITextArea
            multiline
            rows={7}
            border="none"
            sx={{ width: '100%' }}
            placeholder="Add New Comment"
            value={newComment}
            onChange={handleInputChange}
          />
          <UIFlexSpaceBox
            sx={{
              borderTop: '1px solid #EDEDED',
              py: '6px',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              padding: '10px 10px',
            }}
          >
            {/*<IconButton>*/}
            {/*  <Image*/}
            {/*    src={'images/icons/attachfile.svg'}*/}
            {/*    loader={appImageLoader}*/}
            {/*    width={24}*/}
            {/*    height={24}*/}
            {/*    alt="comment"*/}
            {/*  />*/}
            {/*</IconButton>*/}
            <UIFlexSpaceBox>
              <UIModalButton onClick={handleSave}>Save</UIModalButton>
            </UIFlexSpaceBox>
          </UIFlexSpaceBox>
        </Box>
        {comments?.map((comment, index) => {
          return <CommentCard key={index} comment={comment} />;
        })}
      </Box>
    </UISideDialog>
  );
};
