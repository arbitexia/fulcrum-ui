/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { styled, Box, Tabs, BoxProps, useTheme } from '@mui/material';

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
  const theme = useTheme();

  return (
    <Box
      {...rest}
      sx={{
        borderBottom: noBorder ? 0 : 1,
        '.MuiTabs-root': {
          marginTop: theme.spacing(2),
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
            alignItems: 'center',
            justifyContent: 'center',
            textTransform: 'Capitalize',
            flexGrow: 0,
            flexDirection: 'row',
            minHeight: '31px',
            fontWeight: 400,
            color: '#504F54',
            fontSize: '14px',
            minWidth: '164px',
            paddingLeft: theme.spacing(5),
            '&:nth-of-type(1)': {
              marginLeft: 0,
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
            marginRight: '5px',
            marginBottom: '0px !important',
            fontSize: '21px',
          },
        }}
      >
        {children}
      </Tabs>
    </Box>
  );
};
