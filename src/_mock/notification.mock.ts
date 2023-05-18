/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import {
  NotificationColumnType,
  NotificationType,
} from '@/types/notification.type';

export const rows: NotificationType[] = [
  {
    id: '1',
    status: 'New',
    name: 'Unmask',
    score: '44',
    notificationType: 'Score Threshhold exceeded',
    notificationName: 'Arres Severity (50)',
    model: 'Combined Model',
    category: 'All',
    time: '12/15/2022 5:35 AM',
    threshold: '50%',
    isMasking: true,
  },
  {
    id: '2',
    status: 'Reviewed',
    name: 'Jason Wang',
    score: '25',
    notificationType: 'Score Threshhold exceeded',
    notificationName: 'Arres Severity (50)',
    model: 'Data exfiltration',
    category: 'All',
    time: '12/15/2022 5:35 AM',
    threshold: '50%',
    isMasking: false,
  },
];

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
];
