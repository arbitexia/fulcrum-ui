/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import { NOTIFICATION_TAB } from '@/constants/notification';
import { rows, manageColumns, viewColumns } from '@/_mock/notification.mock';
import NotificationDataTable from './NotificationDataTable';
import { NewNotificationModal } from './NewNotificationModal';

const NotificationTab = (props: {
  isOpenNewDialog: boolean;
  closeNewDlg: () => void;
}): JSX.Element => {
  const router = useRouter();
  const { type: activeTab } = router.query as { type: string };

  const columns =
    activeTab === NOTIFICATION_TAB.VIEW ? viewColumns : manageColumns;

  return (
    <Stack spacing={3} padding="1rem 0">
      <NotificationDataTable
        columns={columns}
        rows={rows}
        orderField="status"
        tableRole="text"
        type={activeTab}
      />
      {activeTab === NOTIFICATION_TAB.MANAGE && (
        <NewNotificationModal
          open={props.isOpenNewDialog}
          onClose={props.closeNewDlg}
        />
      )}
    </Stack>
  );
};

export default NotificationTab;
