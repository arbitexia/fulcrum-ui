/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import React from 'react';
import ProgramTab from './ProgramTab';
import OrganizationTab from './OrganizationTab';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
const ReportsTabs = ({ url }: { url: string }): JSX.Element => {
  const router = useRouter();
  return (
    <Box>
      {url === 'program-metrics' && <ProgramTab />}
      {url === 'organization-metrics' && <OrganizationTab />}
    </Box>
  );
};

export default ReportsTabs;
