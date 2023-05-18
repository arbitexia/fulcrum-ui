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
  maxWidth: '100vw',
}));

export const UIContainer = ({
  children,
  maxWidth = 'xl',
  ...rest
}: ContainerProps): JSX.Element => {
  return (
    <UIContentWrapper maxWidth={maxWidth} {...rest}>
      {children}
    </UIContentWrapper>
  );
};
