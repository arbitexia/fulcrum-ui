/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import { useRouter } from 'next/router';
import { LinearProgress, Stack } from '@mui/material';
import { NOTIFICATION_TAB } from '@/constants/notification';
import { manageColumns, viewColumns } from '@/_mock/notification.mock';
import NotificationDataTable from './NotificationDataTable';
import { NewNotificationModal } from './NewNotificationModal';
import { useState } from 'react';
import {
  getIsAttributesInitialized,
  getNotificationEventsForTable,
  getNotificationsForTable,
  isModelsInitialized,
  isNotificationEventsInitializedSelector,
  isNotificationsInitializedSelector,
} from '@/redux/slices';
import { useAppSelector } from '@/hooks';

const NotificationTab = (props: {
  isOpenNewDialog: boolean;
  closeNewDlg: () => void;
  openNewDlg: () => void;
  accessToken: string;
  onSubmit: ({
    notificationId,
    notificationType,
    modelId,
    categoryName,
    threshold,
  }: {
    notificationId: string | null;
    notificationType: string;
    modelId: string;
    categoryName: string;
    threshold: number;
  }) => void;
}): JSX.Element => {
  const router = useRouter();
  const { type: activeTab } = router.query as { type: string };
  const modelsListInitialized: boolean = useAppSelector(isModelsInitialized);
  const attributesListInitialized: boolean = useAppSelector(
    getIsAttributesInitialized
  );
  const isNotificationsInitialized = useAppSelector(
    isNotificationsInitializedSelector
  );
  const isNotificationEventsInitialized = useAppSelector(
    isNotificationEventsInitializedSelector
  );
  const notifications = useAppSelector(getNotificationsForTable);
  const notificationEvents = useAppSelector(getNotificationEventsForTable);
  const [notificationId, setNotificationId] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<string | null>(null);
  const [modelId, setModelId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<number | null>(null);
  const [setInputs, setInputsValue] = useState<boolean>(false);

  const columns =
    activeTab === NOTIFICATION_TAB.VIEW ? viewColumns : manageColumns;

  const rows =
    activeTab === NOTIFICATION_TAB.VIEW ? notificationEvents : notifications;

  const isNotificationsDataReady =
    modelsListInitialized &&
    attributesListInitialized &&
    isNotificationsInitialized;

  const isNotificationEventsDataReady =
    isNotificationsDataReady && isNotificationEventsInitialized;

  if (activeTab === NOTIFICATION_TAB.VIEW && !isNotificationEventsDataReady) {
    return <LinearProgress />;
  }

  if (activeTab === NOTIFICATION_TAB.MANAGE && !isNotificationsDataReady) {
    return <LinearProgress />;
  }

  return (
    <Stack spacing={3} padding="1rem 0">
      <NotificationDataTable
        accessToken={props.accessToken}
        columns={columns}
        rows={rows}
        orderField="status"
        tableRole="text"
        type={activeTab}
        setOpenEditDialog={props.openNewDlg}
        setNotificationId={setNotificationId}
        setNotificationType={setNotificationType}
        setModelId={setModelId}
        setCategoryName={setCategoryName}
        setThreshold={setThreshold}
        submitNotificationChange={props.onSubmit}
        useInputs={setInputsValue}
      />
      {activeTab === NOTIFICATION_TAB.MANAGE && (
        <NewNotificationModal
          open={props.isOpenNewDialog}
          onClose={() => {
            setNotificationId(null);
            setNotificationType(null);
            setModelId(null);
            setCategoryName(null);
            setThreshold(null);
            setInputsValue(false);
            props.closeNewDlg();
          }}
          onSubmit={props.onSubmit}
          inputNotificationId={notificationId}
          inputNotificationType={notificationType}
          inputModelId={modelId}
          inputCategoryName={categoryName}
          inputThreshold={threshold}
          useInputs={setInputs}
          setUseInputs={setInputsValue}
        />
      )}
    </Stack>
  );
};

export default NotificationTab;
