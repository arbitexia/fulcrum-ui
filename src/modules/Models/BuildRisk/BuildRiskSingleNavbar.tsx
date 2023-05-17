/**
/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import {
  UIContainer,
  UIDefaultTextField,
  UIModalButton,
  UIFlexWrapBox,
  UISelect,
} from '@/components/UI';
import { behaviorData, riskTypeData } from '@/_mock';
import { Box, InputLabel, Typography } from '@mui/material';
import { RiskSingleRecordDataType } from '@/types';

const BuildRiskNavbar = ({
  item,
}: {
  item: RiskSingleRecordDataType;
}): JSX.Element => {
  const handleChange = (): void => {
    console.log('handleChange');
  };
  return (
    <UIContainer>
      <Typography variant="h4" sx={{ mr: 4 }}>
        Build a Risk Indicator
      </Typography>
      <UIFlexWrapBox sx={{ alignItems: 'flex-end', mt: 2, gap: 4 }}>
        <Box>
          <InputLabel variant="standard">
            <Typography
              sx={{
                mb: 1,
                fontWeight: '400',
                fontSize: '13px',
                lineHeight: '20px',
                color: '#504F54',
              }}
            >
              Risk Indicator Name
            </Typography>
          </InputLabel>
          <UIDefaultTextField
            defaultValue={item.name}
            sx={{ width: '288px' }}
            variant="standard"
          />
        </Box>
        <Box>
          <InputLabel variant="standard">
            <Typography
              sx={{
                mb: 1,
                fontWeight: '400',
                fontSize: '13px',
                lineHeight: '20px',
                color: '#504F54',
              }}
            >
              Description
            </Typography>
          </InputLabel>
          <UIDefaultTextField
            defaultValue={item.description}
            sx={{ width: '288px' }}
            variant="standard"
          />
        </Box>
        <Box>
          <Typography
            sx={{
              mb: 1,
              fontWeight: '400',
              fontSize: '13px',
              lineHeight: '20px',
              color: '#504F54',
            }}
          >
            Type
          </Typography>
          <UISelect
            defaultValue={item.type}
            itemList={riskTypeData}
            handleChange={handleChange}
            width="236px"
            height="36px"
          />
        </Box>

        <Box>
          <Typography
            sx={{
              mb: 1,
              fontWeight: '400',
              fontSize: '13px',
              lineHeight: '20px',
              color: '#504F54',
            }}
          >
            Data Source
          </Typography>
          <UISelect
            defaultValue={item.resource}
            itemList={behaviorData}
            handleChange={handleChange}
            width="236px"
            height="36px"
          />
        </Box>
        <UIModalButton sx={{ fontWeight: 400 }}>Save</UIModalButton>
      </UIFlexWrapBox>
    </UIContainer>
  );
};

export default BuildRiskNavbar;
