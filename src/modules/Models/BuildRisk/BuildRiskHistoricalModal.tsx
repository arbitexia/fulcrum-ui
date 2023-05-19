/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useState } from 'react';
import {
  styled,
  Box,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Drawer,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import {
  UIFlexWrapBox,
  UISelect,
  // UIDefaultTextField,
  // UIProfilePagination,
  UIFlexColumnBox,
} from '@/components/UI';
import { DefaultModalProps } from '@/types';
import BuildRiskHistoricalTable from './BuildRiskHistoricalTable';
import { useAppSelector } from '@/hooks';
import {
  getFiltersByDataSourceId,
  getStatsByDataSourceIdFeatureAndFieldName,
} from '@/redux/slices';
import { roundToSignificant } from '@/libs/math-utils';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { UniqueValueCountDisplay } from '@/types/stats.type';

export const StyledText = styled(Typography)({
  padding: '4px',
  fontSize: 14,
  color: '#000000',
  lineHeight: '16px',
});

interface HistoricalModalProps extends DefaultModalProps {
  dataSourceId: string;
  riskFieldId: string;
}

const BuildRiskHistoricalModal = ({
  open,
  onClose,
  dataSourceId,
  riskFieldId,
}: HistoricalModalProps): JSX.Element => {
  const filters = useAppSelector(getFiltersByDataSourceId(dataSourceId));
  const defaultFilter =
    filters && filters.length > 0 ? filters[0] : { id: '', name: '' };
  const [stateFilterValue, setStateFilterValue] = useState<string>(
    defaultFilter.id
  );
  const startingModelData = useAppSelector(
    getStatsByDataSourceIdFeatureAndFieldName(
      dataSourceId,
      stateFilterValue,
      riskFieldId
    )
  );
  const handleChange = (event: SelectChangeEvent<unknown>): void => {
    const value = (event.target.value as string) || null;
    if (value) {
      setStateFilterValue(value as string);
    }
  };

  const uniqueValueArrays: UniqueValueCountDisplay[] = Object.entries(
    startingModelData.uniqueValueCounts ?? {}
  ).map(([value, occurrence]) => {
    return { value, occurrence };
  });

  return (
    <Drawer
      anchor="right"
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
              {dataSourceId}
            </Typography>
          </UIFlexWrapBox>
          <UIFlexWrapBox>
            <Typography sx={{ fontSize: 13, width: '80px' }}>
              Field Name:
            </Typography>
            <Typography sx={{ color: '#0050BE', fontSize: 13 }}>
              {riskFieldId}
            </Typography>
          </UIFlexWrapBox>
          <UIFlexWrapBox sx={{ alignItems: 'center' }}>
            <Typography sx={{ fontSize: 13, width: '80px' }}>
              Population:
            </Typography>
            <UISelect
              itemList={filters}
              handleChange={handleChange}
              value={stateFilterValue}
            />
          </UIFlexWrapBox>
        </UIFlexWrapBox>
        {/*<UIFlexWrapBox*/}
        {/*  sx={{*/}
        {/*    background: '#ECEFF1',*/}
        {/*    p: '8px 24px 16px 24px',*/}
        {/*    alignItems: 'center',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Typography fontSize={13}>Date Range between:</Typography>{' '}*/}
        {/*  <UIDefaultTextField sx={{ width: '100px' }} variant="standard" />*/}
        {/*  <Typography fontSize={13}>and</Typography>*/}
        {/*  <UIDefaultTextField sx={{ width: '100px' }} variant="standard" />*/}
        {/*</UIFlexWrapBox>*/}
        <Box sx={{ py: 2, px: 3 }}>
          {/*<UIProfilePagination flip={true} />*/}
          <BuildRiskHistoricalTable
            uniqueValueCounts={uniqueValueArrays}
            isNumeric={startingModelData.isNumeric}
          />
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
              <StyledText>{startingModelData?.count ?? 0}</StyledText>
              <StyledText>
                {startingModelData?.uniquenessLimitExceeded != ''
                  ? startingModelData?.uniquenessLimitExceeded
                  : startingModelData?.countUnique ?? 0}
              </StyledText>
              <StyledText>
                {roundToSignificant(startingModelData?.mean ?? 0)}
              </StyledText>
              <StyledText>
                {roundToSignificant(startingModelData?.median ?? 0)}
              </StyledText>
              <StyledText>
                {roundToSignificant(startingModelData?.stdDev ?? 0)}
              </StyledText>
              <StyledText>
                {roundToSignificant(startingModelData?.skewness ?? 0)}
              </StyledText>
              <StyledText>{startingModelData?.min ?? 0}</StyledText>
              <StyledText>{startingModelData?.max ?? 0}</StyledText>
            </Box>
          </UIFlexWrapBox>
        </UIFlexColumnBox>
      </DialogContent>
    </Drawer>
  );
};

export default BuildRiskHistoricalModal;
