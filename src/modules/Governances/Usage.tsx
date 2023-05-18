/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import { IconButton, Stack } from '@mui/material';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';
import { UIFlexWrapBox } from '@/components/UI';
import GovernanceTable from './GovernanceTable';
import { GovernanceColumnType } from '@/types';
import { useAppSelector } from '@/hooks';
import { getAuditTableData } from '@/redux/slices/governance.slice';

const columns: GovernanceColumnType[] = [
  { id: 'action', headerName: 'Action', sortable: true },
  {
    id: 'date',
    headerName: 'Date/Time',
    sortable: true,
  },
  {
    id: 'user',
    headerName: 'Application User',
    sortable: true,
  },
  {
    id: 'role',
    headerName: 'Role (s)',
    sortable: true,
  },
  {
    id: 'description',
    headerName: 'Action Description',
    sortable: true,
  },
];

const Usage = (): JSX.Element => {
  const usageTableData = useAppSelector(getAuditTableData);
  return (
    <Stack>
      <UIFlexWrapBox sx={{ justifyContent: 'flex-end' }}>
        <IconButton>
          <Image
            src={'images/icons/xls.svg'}
            loader={appImageLoader}
            width={24}
            height={30}
            alt="pdf"
          />
        </IconButton>
      </UIFlexWrapBox>
      <GovernanceTable
        columns={columns}
        rows={usageTableData}
        order="action"
        type="usage"
        tableRole="text"
      />
    </Stack>
  );
};

export default Usage;
