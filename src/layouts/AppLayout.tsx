/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { ReactNode } from 'react';
import { Container, Fab, Toolbar } from '@mui/material';
import { AppSEO, AppNavbar, AppScrollTop } from '@/components/App';
import { UIAppLayoutWrapper } from '@/components/UI';
import { KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';

interface Props {
  title?: string;
  description?: string;
  children: ReactNode | ReactNode[];
}

const AppLayout = (props: Props): JSX.Element => {
  return (
    <UIAppLayoutWrapper>
      <AppSEO title={props.title || ''} description={props.description || ''} />
      <AppNavbar />
      <Toolbar id="back-to-top-anchor" />
      <main>
        <Container sx={{ py: 3 }}>{props.children}</Container>
      </main>
      <AppScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </AppScrollTop>
    </UIAppLayoutWrapper>
  );
};

export default AppLayout;
