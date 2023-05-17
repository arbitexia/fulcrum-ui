/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  UIContainer,
  UIFlexCenterBox,
  UIFlexWrapBox,
  UIScoreChip,
  UIVerticalArrow,
} from '@/components/UI';
import { StyledHeader } from './ui';
import { timeLineData } from '@/_mock';
import { getColorPair, getScoreColor } from '@/libs/color-generator';
import { roundScoreIntelligently } from '@/libs/math-utils';

const UserDetailTimeLineView = (): JSX.Element => {
  return (
    <UIContainer sx={{ pb: 0 }}>
      <StyledHeader>Timeline</StyledHeader>
      <Box
        sx={{ overflow: 'auto', display: 'flex', gap: 6, marginTop: '25px' }}
      >
        {timeLineData.map((riskData) => {
          return (
            <Box
              key={riskData.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                '&::before': {
                  content: `""`,
                  borderLeft: '1px dashed #B0B4BE',
                  position: 'absolute',
                  top: '0',
                  left: '16px',
                  height: '100%',
                  zIndex: 1,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  zIndex: 2,
                }}
              >
                <UIScoreChip
                  label={riskData.score}
                  bgColor={getScoreColor(
                    roundScoreIntelligently(riskData.score)
                  )}
                />
                {riskData.date}
              </Box>
              {riskData.items.map((trendData) => {
                return (
                  <UIFlexWrapBox
                    key={trendData.id}
                    sx={{
                      alignItems: 'center',
                      padding: '8px 14px',
                      background: '#FFFFFF',
                      borderRadius: '6px',
                      width: '312px',
                      height: '48px',
                      fontWeight: '400',
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#283238',
                      margin: '12px 0',
                      zIndex: 2,
                    }}
                  >
                    <Box width="12px">
                      {trendData.up != 2 ? (
                        <UIVerticalArrow
                          direction={trendData.up}
                          color={getColorPair(trendData.colorIndex).textColor}
                        />
                      ) : null}
                    </Box>
                    <UIFlexCenterBox
                      sx={{
                        width: '32px',
                        height: '32px',
                        color: getColorPair(trendData.colorIndex).textColor,
                        background: getColorPair(trendData.colorIndex).bgColor,
                      }}
                    >
                      {trendData.trend}
                    </UIFlexCenterBox>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        overflow: 'hidden!important',
                        textOverflow: 'ellipsis',
                        width: '220px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {trendData.label}
                    </Typography>
                  </UIFlexWrapBox>
                );
              })}
            </Box>
          );
        })}
      </Box>
    </UIContainer>
  );
};

export default UserDetailTimeLineView;
