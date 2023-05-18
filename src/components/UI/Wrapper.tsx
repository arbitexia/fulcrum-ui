/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { styled, Box, Tabs, BoxProps } from '@mui/material';

export const UIAppLayoutWrapper = styled(Box)({
  width: '100%',
  minHeight: '100vh',
  scrollBehavior: 'smooth',
});

interface UITabWrapperProps extends BoxProps {
  children: React.ReactNode | React.ReactNode[];
  value: number;
  noBorder?: boolean;
  onChange: (event: React.SyntheticEvent, newValue?: number) => void;
}

export const UITabWrapper = ({
  children,
  value,
  noBorder,
  onChange,
  ...rest
}: UITabWrapperProps): JSX.Element => {
  return (
    <Box
      {...rest}
      sx={{
        borderBottom: noBorder ? 0 : 1,
        '.MuiTabs-root': {
          marginTop: 0,
          minHeight: '30px',
        },
        '.MuiTabs-scroller': {
          flex: 'inherit',
          width: '100%',
        },
        '.MuiTabs-indicator': {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Tabs
        value={value}
        onChange={onChange}
        variant="fullWidth"
        sx={{
          '.MuiTab-root': {
            justifyContent: 'flex-start',
            textTransform: 'Capitalize',
            flexGrow: 0,
            flexDirection: 'row',
            fontWeight: 400,
            color: '#504F54',
            fontSize: '14px',
            minWidth: '150px',
            '&:nth-of-type(1)': {
              marginLeft: 0,
              paddingLeft: 0,
              minWidth: '75px',
            },
            '&:nth-of-type(3)': {
              minWidth: '100px',
            },
            '&.Mui-selected': {
              fontWeight: 700,
              color: '#C62828',
            },
            span: {
              padding: 0,
            },
          },
          svg: {
            marginRight: 0,
            marginBottom: 0,
            fontSize: '21px',
          },
        }}
      >
        {children}
      </Tabs>
    </Box>
  );
};
