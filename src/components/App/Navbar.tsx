/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { ReactNode } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { appImageLoader } from '@/libs/image-loader';
import { AppBar, Box, Toolbar, Button } from '@mui/material';
import { UIFlexCenterBox } from '@/components/UI';

type NavbarProps = {
  elements?: ReactNode | null;
  navbarBorder?: boolean;
};

const AppNavbar = (props: NavbarProps): JSX.Element => {
  const router = useRouter();
  if (!props.elements) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar color="inherit">
          <Toolbar>
            <Box sx={{ cursor: 'pointer' }}>
              <Image
                src="images/logo.png"
                loader={appImageLoader}
                width={205}
                height={30}
                onClick={() => router.push('/')}
                alt="logo"
              />
            </Box>

            <Box sx={{ flexGrow: 1 }}></Box>
            <Button
              size="small"
              variant="text"
              color="info"
              onClick={() => router.push('/home')}
            >
              Dashboard
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }

  return (
    <UIFlexCenterBox
      sx={{
        justifyContent: 'flex-start',
        backgroundColor: '#ECEFF1',
        borderBottom: props.navbarBorder ? '1px solid #504F54' : 'none',
      }}
    >
      {props.elements}
    </UIFlexCenterBox>
  );
};

export default AppNavbar;
