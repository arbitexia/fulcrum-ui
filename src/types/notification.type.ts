/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

export type NotificationColumnType = {
  id: string;
  field: string;
  headerName: string;
  props?: { [id: string]: string };
  variant?: string;
  sortable?: boolean;
};

export type NotificationType = {
  id: string;
  status: string;
  name: string;
  score: string;
  notificationType: string;
  notificationName: string;
  model: string;
  category: string;
  time: string;
  threshold: string;
  isMasking: boolean;
};
