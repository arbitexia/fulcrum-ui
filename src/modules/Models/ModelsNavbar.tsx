/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import {
  UIContainer,
  UIDefaultTextField,
  UIDefaultButton,
  UIFlexSpaceBox,
} from '@/components/UI';
import { Typography, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useTheme } from '@mui/system';

const ModelsNavbar = ({
  url,
  action,
  id,
  onActionClick,
}: {
  url: string;
  action: string;
  id: string;
  onActionClick: (url: string, action: string, id: number | string) => void;
}): JSX.Element => {
  const theme = useTheme();
  return (
    <UIContainer
      disableGutters
      maxWidth={false}
      sx={{
        [theme.breakpoints.up('sm')]: {
          padding: theme.spacing(2.5, 10),
        },
        paddingTop: '20px',
        paddingBottom: '20px',
        marginLeft: '80px',
        paddingRight: '0px',
        marginRight: '80px',
      }}
    >
      <UIFlexSpaceBox sx={{ alignItems: 'flex-end', paddingTop: '20px' }}>
        <Typography variant="h4" sx={{ mr: 4 }}>
          Model and Scoring Configuration
        </Typography>
        <UIFlexSpaceBox sx={{ gap: 2 }}>
          <UIDefaultButton onClick={() => onActionClick(url, action, id)}>
            Add New
          </UIDefaultButton>
          <UIDefaultTextField
            id="input-with-icon-textfield"
            placeholder="Filter List"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
            sx={{ input: { color: '#2E2C34' } }}
          />
        </UIFlexSpaceBox>
      </UIFlexSpaceBox>
    </UIContainer>
  );
};

export default ModelsNavbar;
