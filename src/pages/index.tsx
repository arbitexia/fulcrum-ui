/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { ChangeEvent, useState } from 'react';
import { Typography } from '@mui/material';
import { AppLayout } from '@/layouts';
import { useAppDispatch } from '@/hooks';
import { UIFlexSpaceBox } from '@/components/UI';
import { CustomThemeSwitch } from '@/components/Custom';
import { toggleThemeMode } from '@/redux/slices';
import { useAppToast } from '@/providers';

const Home = (): JSX.Element => {
  const appToast = useAppToast();
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState<boolean>(true);

  const handleThemeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setChecked(e.target.checked);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    dispatch(toggleThemeMode());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    appToast({ severity: 'success', message: 'App Theme Mode Changed' });
  };

  return (
    <AppLayout title="Home">
      <UIFlexSpaceBox>
        <Typography variant="h5">Home</Typography>
        <CustomThemeSwitch checked={checked} onChange={handleThemeChange} />
      </UIFlexSpaceBox>
    </AppLayout>
  );
};

export default Home;
