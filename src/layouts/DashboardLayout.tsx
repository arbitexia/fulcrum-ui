/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { ReactNode } from 'react';
import { UIAppLayoutWrapper, UILayoutMain } from '@/components/UI';
import { AppSEO, AppNavbar, AppSidebar } from '@/components/App';

interface Props {
  title: string;
  navEls?: ReactNode;
  children: ReactNode | ReactNode[];
  navbarBorder: boolean;
}

const DashboardLayout = (props: Props): JSX.Element => {
  return (
    <UIAppLayoutWrapper>
      <AppSidebar />
      <UILayoutMain>
        <AppSEO title={props.title} description="" />
        <AppNavbar elements={props.navEls} navbarBorder={props.navbarBorder} />
        {props.children}
      </UILayoutMain>
    </UIAppLayoutWrapper>
  );
};

export default DashboardLayout;
