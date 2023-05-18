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
import { GovernanceColumnType } from '@/types';
import GovernanceTable from './GovernanceTable';
import { useAppSelector } from '@/hooks';
import { getEntityStatusTableData } from '@/redux/slices';

const columns: GovernanceColumnType[] = [
  { id: 'status', headerName: 'Person Status Change', sortable: true },
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
    id: 'name',
    headerName: 'Name',
    sortable: true,
  },
  {
    id: 'eid',
    headerName: 'EID',
    sortable: true,
  },
  {
    id: 'title',
    headerName: 'Title',
    sortable: true,
  },
  {
    id: 'department',
    headerName: 'Department',
    sortable: true,
  },
];

const Status = (): JSX.Element => {
  const statusTableData = useAppSelector(getEntityStatusTableData);
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
        rows={statusTableData}
        order="status"
        type="usage"
        tableRole="text"
      />
    </Stack>
  );
};

export default Status;
