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

const ReportsTabs = ({ url }: { url: string }): JSX.Element => {
  return (
    <>
      {url === 'program' && <ProgramTab />}
      {url === 'organization' && <OrganizationTab />}
    </>
  );
};

export default ReportsTabs;
