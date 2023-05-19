/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import { NotificationColumnType } from '@/types/notification.type';
import { UISelectInterface } from '@/types/common.type';

export const viewColumns: NotificationColumnType[] = [
  { id: 'status', field: 'status', headerName: 'Status', sortable: true },
  { id: 'name', field: 'name', headerName: 'Name', sortable: true },
  { id: 'score', field: 'score', headerName: 'Risk Score', sortable: true },
  {
    id: 'notificationType',
    field: 'notificationType',
    headerName: 'Notification',
    sortable: true,
  },
  { id: 'model', field: 'model', headerName: 'Model', sortable: true },
  {
    id: 'time',
    field: 'time',
    headerName: 'Notification Time',
    sortable: true,
  },
];

export const manageColumns: NotificationColumnType[] = [
  {
    id: 'notificationName',
    field: 'notificationName',
    headerName: 'Notification Name',
    sortable: true,
  },
  {
    id: 'notificationType',
    field: 'notificationType',
    headerName: 'Type',
    sortable: true,
  },
  {
    id: 'active',
    field: 'active',
    headerName: 'Active',
    sortable: false,
  },
];

export const SCORE_THRESHOLD = 'SCORE_THRESHOLD';
export const SIDELINE = 'SIDELINE';

export const notificationTypes: UISelectInterface[] = [
  { id: 'SCORE_THRESHOLD', name: 'Threshold Excedeed' },
  { id: 'SIDELINE', name: 'Sideline' },
];
