/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';
import { UIFlexSpaceBox, UIFlexWrapBox } from '@/components/UI';
import { IconButton, Typography, Slider } from '@mui/material';
import { convertScore, roundScore } from '@/libs/math-utils';

const BuildModelWeightChange = ({
  incomingWeight,
  onChangeWeight,
  itemName,
  onLock,
}: {
  incomingWeight: number;
  onChangeWeight: (value: number) => void;
  itemName: string;
  onLock: () => void;
}): JSX.Element => {
  const [lock, setLock] = useState<boolean>(false);
  const [weight, setWeight] = useState<number>(0.0);
  useEffect(() => {
    if (incomingWeight) {
      setWeight(incomingWeight);
    } else {
      setWeight(0.0);
    }
  }, [incomingWeight]);
  const onSlideChanged = (_: Event, value: number | number[]): void => {
    if (typeof value === 'number') {
      onChangeWeight(convertScore(value));
      setWeight(convertScore(value));
    }
  };
  return (
    <UIFlexSpaceBox
      sx={{
        height: '36px',
        fontWeight: '400',
        fontSize: '14px',
        lineHeight: '20px',
        color: '#504F54',
        alignItems: 'center',
        marginBottom: '12px',
        paddingRight: '24px',
      }}
    >
      <UIFlexSpaceBox sx={{ flex: 1 }}>
        {itemName}
        <UIFlexWrapBox sx={{ alignItems: 'center' }}>
          <IconButton
            onClick={() => {
              onLock();
              setLock(!lock);
            }}
            sx={{
              padding: 0,
              alignItems: 'flex-end',
              display: 'flex',
              height: '30px',
            }}
          >
            {lock ? (
              <Image
                src="images/icons/lock.svg"
                loader={appImageLoader}
                width={20}
                height={30}
                alt="lock"
              />
            ) : (
              <Image
                src="images/icons/unlock.svg"
                loader={appImageLoader}
                width={20}
                height={30}
                alt="unlock"
              />
            )}
          </IconButton>
          <Typography
            sx={{
              fontWeight: '700',
              fontSize: '14px',
              lineHeight: '20px',
              color: '#504F54',
              width: '40px',
            }}
          >
            {roundScore(weight)}%
          </Typography>
        </UIFlexWrapBox>
      </UIFlexSpaceBox>
      <Slider
        disabled={lock}
        sx={{
          width: '210px',
          '.MuiSlider-rail': {
            background: '#D0D8DC',
            height: 8,
          },
          '.MuiSlider-track': {
            background: '#B71C1C',
            height: 8,
            border: 'none',
          },
          '.MuiSlider-thumb': {
            background: '#B71C1C',
            width: 24,
            height: 24,
            '&:hover': { boxShadow: 'none' },
          },
          '.Mui-active': { boxShadow: 'none' },
        }}
        value={roundScore(weight)}
        onChange={onSlideChanged}
        aria-label="Default"
      />
    </UIFlexSpaceBox>
  );
};

export default BuildModelWeightChange;
