/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import {
  styled,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import {
  UIFlexWrapBox,
  UISelect,
  UIDefaultTextField,
  UIProfilePagination,
  UIFlexColumnBox,
} from '@/components/UI';
import { DefaultModalProps } from '@/types';
import { populationList } from '@/_mock';
import BuildRiskHistoricalTable from './BuildRiskHistoricalTable';

export const StyledText = styled(Typography)({
  padding: '4px',
  fontSize: 14,
  color: '#000000',
  lineHeight: '16px',
});

const BuildRiskHistoricalModal = ({
  open,
  onClose,
}: DefaultModalProps): JSX.Element => {
  const handleChange = (): void => {
    console.log('handleChange');
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          background: '#FFFFFF',
          border: '1px solid #000000',
          borderRadius: '0px',
          maxWidth: '440px',
        },
      }}
      fullWidth
    >
      <DialogTitle
        sx={{
          margin: '0px',
          padding: '9px 0px 9px 16px',
          display: 'flex',
          background: '#ECEFF1',
          height: '48px',
          justifyContent: 'space-between',
          alignItems: 'center',
          letterSpacing: '0.15px',
          fontWeight: '400',
          fontSize: '16px',
          lineHeight: '32px',
          color: '#39474E',

          svg: {
            color: '#889AAE',
          },
        }}
      >
        Historical Data Values
        <IconButton disableRipple onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <UIFlexWrapBox
          sx={{
            background: '#ECEFF1',
            p: '8px 24px',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <UIFlexWrapBox>
            <Typography sx={{ fontSize: 13, width: '80px' }}>
              Data Source:
            </Typography>
            <Typography sx={{ color: '#0050BE', fontSize: 13 }}>
              Human Resources
            </Typography>
          </UIFlexWrapBox>
          <UIFlexWrapBox>
            <Typography sx={{ fontSize: 13, width: '80px' }}>
              Field Name:
            </Typography>
            <Typography sx={{ color: '#0050BE', fontSize: 13 }}>
              Performance Rating
            </Typography>
          </UIFlexWrapBox>
          <UIFlexWrapBox sx={{ alignItems: 'center' }}>
            <Typography sx={{ fontSize: 13, width: '80px' }}>
              Population:
            </Typography>
            <UISelect
              itemList={populationList.items}
              handleChange={handleChange}
            />
          </UIFlexWrapBox>
        </UIFlexWrapBox>
        <UIFlexWrapBox
          sx={{
            background: '#ECEFF1',
            p: '8px 24px 16px 24px',
            alignItems: 'center',
          }}
        >
          <Typography fontSize={13}>Date Range between:</Typography>{' '}
          <UIDefaultTextField sx={{ width: '100px' }} variant="standard" />
          <Typography fontSize={13}>and</Typography>
          <UIDefaultTextField sx={{ width: '100px' }} variant="standard" />
        </UIFlexWrapBox>
        <Box sx={{ py: 2, px: 3 }}>
          <UIProfilePagination flip={true} />
          <BuildRiskHistoricalTable />
        </Box>
        <UIFlexColumnBox sx={{ borderTop: '1px solid #000000', p: 3 }}>
          <Typography
            sx={{
              fontSize: 14,
              color: '#504f54',
              fontWeight: 700,
              lineHeight: '16px',
            }}
          >
            Summary Statistics
          </Typography>
          <UIFlexWrapBox sx={{ mt: 3, mb: 3 }}>
            <Box sx={{ width: '180px' }}>
              <StyledText>Total Occurrences</StyledText>
              <StyledText>Unique Values</StyledText>
              <StyledText>Mean</StyledText>
              <StyledText>Median</StyledText>
              <StyledText>Standard Deviation</StyledText>
              <StyledText>Skewness</StyledText>
              <StyledText>Minimum</StyledText>
              <StyledText>Maximum</StyledText>
            </Box>
            <Box>
              <StyledText>30,137</StyledText>
              <StyledText>5</StyledText>
              <StyledText>4.2</StyledText>
              <StyledText>3.9</StyledText>
              <StyledText>2</StyledText>
              <StyledText>1.2</StyledText>
              <StyledText>1</StyledText>
              <StyledText>5</StyledText>
            </Box>
          </UIFlexWrapBox>
        </UIFlexColumnBox>
      </DialogContent>
    </Dialog>
  );
};

export default BuildRiskHistoricalModal;
