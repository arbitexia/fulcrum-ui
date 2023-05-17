/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { styled, Container, ContainerProps } from '@mui/material';

const UIContentWrapper = styled(Container)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  gap: theme.spacing(3),
  width: '100%',
}));

export const UIContainer = ({
  children,
  ...rest
}: ContainerProps): JSX.Element => {
  return (
    <UIContentWrapper maxWidth="xl" {...rest}>
      {children}
    </UIContentWrapper>
  );
};
