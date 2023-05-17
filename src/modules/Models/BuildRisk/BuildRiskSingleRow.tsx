/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useState } from 'react';
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import { UIDefaultTextField, UIFlexWrapBox, UISelect } from '@/components/UI';
import { Box, Collapse, IconButton, Typography } from '@mui/material';
import { behaviorData, emailData } from '@/_mock';
import { RiskSingleRecordRowType } from '@/types';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';

const BuildRiskSingleRow = ({
  riskItem,
  onOpenHistory,
}: {
  riskItem: RiskSingleRecordRowType;
  onOpenHistory: () => void;
}): JSX.Element => {
  const [openCollapse, setOpenCollapse] = useState<boolean>(false);
  const handleChange = (): void => {
    console.log('handleChange');
  };
  return (
    <Box>
      <UIFlexWrapBox
        sx={{
          alignItems: 'center',
          fontWeight: '400',
          fontSize: '13px',
          lineHeight: '20px',
          color: '#504F54',
          py: '10px',
          gap: '16px',
        }}
      >
        <IconButton
          onClick={() => setOpenCollapse(!openCollapse)}
          sx={{ padding: 0 }}
        >
          {openCollapse ? (
            <KeyboardArrowDown
              sx={{ color: '#647C8A', width: '20px', height: '20px' }}
            />
          ) : (
            <KeyboardArrowRight
              sx={{ color: '#647C8A', width: '20px', height: '20px' }}
            />
          )}
        </IconButton>
        Risk Name
        <UIDefaultTextField
          value={riskItem.name}
          sx={{
            width: '288px',
            height: '36px',
            marginLeft: '8px',
            marginRight: '24px',
            paddingLeft: '8px',
            input: {
              '&::placeholder': {
                fontStyle: 'italic',
                fontWeight: '400',
                fontSize: '13px',
                lineHeight: '20px',
                color: '#3F3F3F',
                opacity: 1,
              },
            },
          }}
          placeholder="Add Category Name"
          variant="standard"
        />
        Weight
        <Typography
          sx={{
            fontWeight: '400',
            fontSize: '13px',
            lineHeight: '20px',
            color: '#0050BE',
            cursor: 'pointer',
          }}
        >
          {riskItem.weight}%
        </Typography>
      </UIFlexWrapBox>
      <Collapse in={openCollapse} timeout="auto" unmountOnExit>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            p: '16px 0px 30px 36px',
          }}
        >
          <UIFlexWrapBox sx={{ gap: 2, alignItems: 'center' }}>
            <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
              Behavior
            </Typography>
            <UISelect
              defaultValue={riskItem.behavior}
              itemList={behaviorData}
              handleChange={handleChange}
            />
          </UIFlexWrapBox>
          <UIFlexWrapBox sx={{ gap: 2, alignItems: 'center' }}>
            <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
              If
            </Typography>
            <UISelect
              defaultValue={riskItem.first}
              itemList={emailData}
              handleChange={handleChange}
            />
            <IconButton sx={{ padding: 0 }} onClick={onOpenHistory}>
              <Image
                src="images/icons/info.svg"
                loader={appImageLoader}
                width={16}
                height={16}
                alt="info"
              />
            </IconButton>
            <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
              is similar to
            </Typography>
            <UISelect
              defaultValue={riskItem.second}
              itemList={emailData}
              handleChange={handleChange}
            />
            <IconButton sx={{ padding: 0 }} onClick={onOpenHistory}>
              <Image
                src="images/icons/info.svg"
                loader={appImageLoader}
                width={16}
                height={16}
                alt="info"
              />
            </IconButton>
            <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
              then score
            </Typography>
            <UIDefaultTextField
              sx={{ width: '48px' }}
              variant="standard"
              defaultValue={riskItem.score}
            />
          </UIFlexWrapBox>
        </Box>
      </Collapse>
    </Box>
  );
};

export default BuildRiskSingleRow;
