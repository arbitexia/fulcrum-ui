/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { Box, IconButton, Input, styled } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  UISelectBox,
  UISelectItem,
  UIFlexSpaceBox,
  UIFlexWrapBox,
} from '@/components/UI';
import { noop } from 'lodash';

const StyledIconButton = styled(IconButton)({
  background: '#D3D3D3',
  borderRadius: '8px',
  marginRight: '5px',
  padding: '2px',
});

export const UIPagination = ({
  pageNumber = 1,
  pageCount = 25,
  onNext = noop,
  onPrev = noop,
  onStart = noop,
}: {
  pageNumber?: number;
  pageCount?: number;
  onNext?: () => void;
  onPrev?: () => void;
  onStart?: () => void;
}): JSX.Element => {
  return (
    <Box>
      <StyledIconButton disableRipple disableTouchRipple onClick={onStart}>
        <FirstPageIcon sx={{ color: 'black' }} />
      </StyledIconButton>
      <StyledIconButton disableRipple disableTouchRipple onClick={onPrev}>
        <ChevronLeftIcon sx={{ color: 'black' }} />
      </StyledIconButton>
      <Box component="span" sx={{ fontSize: '0.8125rem' }}>
        {pageNumber} to {pageCount}
      </Box>
      <StyledIconButton
        sx={{ marginRight: '0px', marginLeft: '5px' }}
        disableRipple
        disableTouchRipple
        onClick={onNext}
      >
        <ChevronRightIcon sx={{ color: 'black' }} />
      </StyledIconButton>
    </Box>
  );
};

export const StyledProfileIconButton = styled(IconButton)({
  width: '27px',
  height: '36px',
  background: '#ECEFF1',
  border: '1px solid #ECEFF1',
  borderRadius: '6px',
});

export const UIProfilePagination = ({
  flip,
  width,
  pageNumber,
  limit,
  pageCount,
  onNext,
  onPrev,
  onChange,
}: {
  flip?: boolean;
  width?: string;
  pageNumber?: number;
  pageCount?: number;
  limit?: number;
  onNext?: () => void;
  onPrev?: () => void;
  onChange?: (value: number) => void;
}): JSX.Element => {
  return (
    <UIFlexSpaceBox sx={{ width: width }}>
      <UIFlexWrapBox sx={{ order: flip ? 2 : 1, alignItems: 'center' }}>
        <StyledProfileIconButton
          disableRipple
          disableTouchRipple
          onClick={() => {
            onPrev && onPrev();
          }}
        >
          <ChevronLeftIcon sx={{ color: '#586D79' }} />
        </StyledProfileIconButton>
        <Box
          component="span"
          sx={{
            fontWeight: '400',
            fontSize: '13px',
            lineHeight: '20px',
            color: '#39474E',
            marginLeft: '5px',
          }}
        >
          <Input
            value={pageNumber ?? 1}
            sx={{
              border: '1px solid #D0D8DC',
              borderRadius: '6px',
              width: '33px',
              borderBottom: '1px solid #D0D8DC',
              marginRight: '10px',
              '&:hover': { borderBottom: '1px solid #D0D8DC' },
              '::before, ::after': { borderBottom: 'none !important' },
              input: { textAlign: 'center' },
            }}
          />
          / {pageCount ?? 25}
        </Box>
        <StyledProfileIconButton
          sx={{ marginLeft: '5px' }}
          onClick={() => {
            onNext && onNext();
          }}
          disableRipple
          disableTouchRipple
        >
          <ChevronRightIcon sx={{ color: '#586D79' }} />
        </StyledProfileIconButton>
      </UIFlexWrapBox>
      <Box
        component="span"
        sx={{
          fontWeight: '400',
          fontSize: '13px',
          lineHeight: '20px',
          color: '#39474E',
          order: flip ? 1 : 2,
        }}
      >
        <UISelectBox
          width="65px"
          height="36px"
          textColor="#39474E"
          sx={{ marginRight: '10px' }}
          value={limit ?? 5}
          onChange={(e) => {
            onChange && onChange(parseInt(e.target.value as string));
          }}
        >
          <UISelectItem value={5}>5</UISelectItem>
          <UISelectItem value={10}>10</UISelectItem>
          <UISelectItem value={15}>15</UISelectItem>
          <UISelectItem value={20}>20</UISelectItem>
          <UISelectItem value={25}>25</UISelectItem>
        </UISelectBox>
        Rows per page
      </Box>
    </UIFlexSpaceBox>
  );
};
