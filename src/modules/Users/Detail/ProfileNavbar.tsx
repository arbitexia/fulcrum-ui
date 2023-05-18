/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useState } from 'react';
import { styled, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';
import {
  UIContainer,
  UIFlexSpaceBox,
  UIFlexCenterBox,
  UISelect,
  UISelectBox,
  UISelectItem,
} from '@/components/UI';
import { Entity } from '@/types/entity.type';
import { SlidelineModal } from './SlidelineModal';
import { CommentModal } from './CommentModal';
import { ActionModal } from './ActionModal';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  entityPropertiesByIdSelector,
  getEntityStatusValues,
  getEntitiesConfigInitialized,
  getStatusForEntityId,
} from '@/redux/slices';
import { getStatusColor, StatusDict } from '@/libs/color-generator';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { newEntityStatus, NOT_AVAILABLE } from '@/redux/slices/entity.slice';
import { UIFlexEndBox } from '@/components/UI/Box';
import { analysts } from '@/_mock/home.mock';

const StyledTypography = styled(Typography)({
  fontWeight: '400',
  fontSize: '13px',
  lineHeight: '20px',
  color: '#504F54',
});

const UserDetailNavbar = ({
  entity,
  accessToken = null,
}: {
  entity: Entity | null;
  accessToken: string | null;
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const entityId: string | null = entity?.entityId ?? null;
  const entityProperties = useAppSelector(
    entityPropertiesByIdSelector(entityId ?? '')
  );
  const statusList = useAppSelector(getEntityStatusValues);
  const configIsInitialized = useAppSelector(getEntitiesConfigInitialized);
  const entityStatus = useAppSelector(getStatusForEntityId(entityId as string));
  const [onSlideline, setOnSlideline] = useState<boolean>(false);
  const [openSlideSetting, setOpenSlideSetting] = useState<boolean>(false);
  const [openComment, setOpenComment] = useState<boolean>(false);
  const [openAction, setOpenAction] = useState<boolean>(false);
  const missingNamePlaceHolder = NOT_AVAILABLE;

  const handleSelectChange = (event: SelectChangeEvent<unknown>): void => {
    const statusValue = (event.target.value as string) || null;
    if (statusValue && accessToken && entityId) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        newEntityStatus({
          accessToken,
          entityId,
          entityStatus: statusValue,
          author: 'Diego Martinez',
          timeStamp: Date.now(),
        })
      );
    }
  };

  return (
    <UIContainer disableGutters sx={{ padding: '8px 8px 8px 24px' }}>
      <UIFlexSpaceBox
        sx={{
          alignItems: 'flex-end',
          paddingTop: '18px',
          paddingBottom: '6px',
        }}
      >
        <UIFlexSpaceBox>
          {entityProperties && (
            <Tooltip title={entityProperties?.name ?? missingNamePlaceHolder}>
              <Typography
                noWrap
                sx={{
                  mr: 4,
                  fontWeight: 700,
                  fontSize: '32px',
                  lineHeight: '32px',
                  textAlign: 'center',
                  letterSpacing: '0.2px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '300px',
                }}
              >
                {entityProperties?.name ?? missingNamePlaceHolder}
              </Typography>
            </Tooltip>
          )}
        </UIFlexSpaceBox>
        <UIFlexEndBox>
          {entityId && configIsInitialized && (
            <UIFlexSpaceBox sx={{ gap: 1 }}>
              <UIFlexEndBox>
                <StyledTypography>Status</StyledTypography>
                <UISelectBox
                  id="demo-simple-select-helper"
                  defaultValue={statusList.default}
                  value={entityStatus ?? statusList.default}
                  label="status"
                  onChange={handleSelectChange}
                  width="210px"
                  height="36px"
                >
                  {statusList.values.map((item, index) => {
                    const colorPair = getStatusColor(
                      item as keyof StatusDict,
                      statusList.default
                    );
                    return (
                      <UISelectItem
                        key={index}
                        value={item as string}
                        sx={{ minWidth: '210px' }}
                      >
                        <Chip
                          label={item as string}
                          sx={{
                            color: colorPair.textColor,
                            background: colorPair.bgColor,
                            borderRadius: '4px',
                            width: '157px',
                            height: '24px',
                            justifyContent: 'flex-start',
                          }}
                        />
                      </UISelectItem>
                    );
                  })}
                </UISelectBox>
              </UIFlexEndBox>
              <UIFlexCenterBox>
                <StyledTypography>Sideline</StyledTypography>
                <UIFlexCenterBox
                  sx={{
                    width: '55px',
                    height: '36px',
                    background: '#FFFFFF',
                    border: '1px solid #D0D8DC',
                    borderRadius: '6px',
                  }}
                >
                  <Chip
                    label={onSlideline ? 'On' : 'Off'}
                    onClick={() => {
                      onSlideline
                        ? setOnSlideline(false)
                        : setOpenSlideSetting(true);
                    }}
                    sx={{
                      color: '#586D79',
                      background: onSlideline ? '#FFC107' : '#ECEFF1',
                      width: '42px',
                      height: '24px',
                      borderRadius: '4px',
                    }}
                  />
                </UIFlexCenterBox>
              </UIFlexCenterBox>
            </UIFlexSpaceBox>
          )}
          <UIFlexSpaceBox sx={{ alignItems: 'flex-end' }}>
            <UIFlexSpaceBox>
              <StyledTypography>Assigned Analyst</StyledTypography>
              <UISelect
                value={1}
                itemList={analysts.items}
                handleChange={() => {
                  console.log('Analyst Clicked');
                }}
                label=""
                height="36px"
              />
            </UIFlexSpaceBox>

            <IconButton sx={{ padding: 0 }}>
              <Image
                src={'images/icons/pdf.svg'}
                loader={appImageLoader}
                width={24}
                height={30}
                alt="pdf"
              />
            </IconButton>
            {entityId && (
              <IconButton
                onClick={() => setOpenComment(true)}
                sx={{ padding: 0 }}
              >
                <Image
                  src={'images/icons/comment.svg'}
                  loader={appImageLoader}
                  width={24}
                  height={30}
                  alt="comment"
                />
              </IconButton>
            )}
            <IconButton onClick={() => setOpenAction(true)} sx={{ padding: 0 }}>
              <Image
                src={'images/icons/action.svg'}
                loader={appImageLoader}
                width={24}
                height={30}
                alt="action"
              />
            </IconButton>
          </UIFlexSpaceBox>
        </UIFlexEndBox>
      </UIFlexSpaceBox>
      <SlidelineModal
        open={openSlideSetting}
        onClose={() => {
          setOpenSlideSetting(false);
        }}
        onUpdate={() => {
          setOnSlideline(!onSlideline);
        }}
      />
      {entityId && accessToken && (
        <CommentModal
          open={openComment}
          onClose={() => setOpenComment(false)}
          entityId={entityId}
          accessToken={accessToken}
        />
      )}
      {entityProperties && (
        <ActionModal
          open={openAction}
          onClose={() => setOpenAction(false)}
          entityName={
            (entityProperties?.name ?? missingNamePlaceHolder) as string
          }
        />
      )}
    </UIContainer>
  );
};

export default UserDetailNavbar;
