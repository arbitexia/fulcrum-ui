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
  active: boolean;
  notificationType: string;
  notificationName: string;
  model: string;
  category: string;
  time: string;
  threshold: string;
  isMasking: boolean;
  entityId?: string;
  scoringInstance?: number;
};

export type Notification = {
  notificationId: string;
  name: string;
  active: boolean;
  notificationType: string;
  modelId: string;
  category: string;
  threshold: number;
};

export type NotificationEvent = {
  notificationId: string;
  entityId: string;
  scoringInstance: number;
  score: number;
  status: string;
};

export type GetNotificationParams = {
  accessToken: string;
  notificationId: string;
};

export type GetNotificationsParams = {
  accessToken: string;
};

export type NewNotificationParams = {
  accessToken: string;
  notificationId: string;
  name: string;
  active: boolean;
  notificationType: string;
  modelId: string;
  category: string;
  threshold: number;
};

export type DeleteNotificationParams = {
  accessToken: string;
  notificationId: string;
};

export type GetNotificationEventParams = {
  accessToken: string;
  notificationId: string;
};

export type GetNotificationEventsParams = {
  accessToken: string;
};

export type NewNotificationEventParams = {
  accessToken: string;
  notificationId: string;
  entityId: string;
  scoringInstance: number;
  score: number;
  status: string;
};

export type DeleteNotificationEventParams = {
  accessToken: string;
  notificationId: string;
  entityId: string;
  scoringInstance: number;
};
