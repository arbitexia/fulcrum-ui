/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import React, { useState } from 'react';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { UIFlexWrapBox, UIIOSSwitch } from '@/components/UI';
import { GovernanceColumnType } from '@/types';

const columns: GovernanceColumnType[] = [
  { id: 'unmask', headerName: 'Unmask' },
  {
    id: 'score',
    headerName: 'Risk Score',
    sortable: true,
  },
  {
    id: 'justification',
    headerName: 'Justification',
  },
  {
    id: 'name',
    headerName: 'Name',
  },
  {
    id: 'id',
    headerName: 'EID',
  },
  {
    id: 'title',
    headerName: 'Title',
  },
  {
    id: 'department',
    headerName: 'Department',
  },
  {
    id: 'location',
    headerName: 'Location',
  },
];

const OrganizationTab = (): JSX.Element => {
  const [isMasking, setIsMasking] = useState(true);

  return (
    <Box sx={{ padding: '1rem 0' }}>
      <Stack spacing={3}>
        <UIFlexWrapBox sx={{ gap: 2, alignItems: 'center' }}>
          <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
            Masking
          </Typography>
          <UIIOSSwitch
            checked={isMasking}
            onChange={(event) => setIsMasking(event.target.checked)}
          />
        </UIFlexWrapBox>
        <UIFlexWrapBox sx={{ gap: 2, alignItems: 'center' }}>
          <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
            Auto-unmask all individuals ranked in the top
          </Typography>
          <TextField
            size="small"
            type="number"
            sx={{
              width: '70px',
              '.MuiInputBase-input': {
                padding: 1,
                color: '#0050BE',
                textAlign: 'center',
              },
            }}
            disabled={!isMasking}
          />
          <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
            percent
          </Typography>
        </UIFlexWrapBox>
        <UIFlexWrapBox sx={{ gap: 2, alignItems: 'center' }}>
          <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
            Re-mask individuals after
          </Typography>
          <TextField
            size="small"
            type="number"
            sx={{
              width: '70px',
              '.MuiInputBase-input': {
                padding: 1,
                color: '#0050BE',
                textAlign: 'center',
              },
            }}
            disabled={!isMasking}
          />
          <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
            days
          </Typography>
        </UIFlexWrapBox>
      </Stack>
    </Box>
  );
};

export default OrganizationTab;
