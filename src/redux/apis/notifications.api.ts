/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import axios from 'axios';
import config from '@/config';
import {
  DeleteNotificationEventParams,
  DeleteNotificationParams,
  GetNotificationEventParams,
  GetNotificationEventsParams,
  GetNotificationParams,
  GetNotificationsParams,
  NewNotificationEventParams,
  NewNotificationParams,
  Notification,
  NotificationEvent,
} from '@/types/notification.type';

const baseConfigUrl: string = config.URLS.NOTIFICATIONS || '';

const headers = {
  'Access-Control-Allow-Origin': baseConfigUrl,
  'Access-Control-Allow-Methods':
    config.ACCESS_CONTROL_ALLOWED_METHODS.NOTIFICATIONS.join(','),
};

export const loadNotification = async (
  params: GetNotificationParams
): Promise<Notification> => {
  const response = await axios.post<Notification>(
    `${baseConfigUrl}/api/notification`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const loadNotifications = async (
  params: GetNotificationsParams
): Promise<Notification[]> => {
  const response = await axios.post<Notification[]>(
    `${baseConfigUrl}/api/notifications`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const newNotification = async (
  params: NewNotificationParams
): Promise<Notification> => {
  await axios.post<void>(`${baseConfigUrl}/api/notification/new`, params, {
    headers,
  });
  return {
    notificationId: params.notificationId,
    name: params.name,
    active: params.active,
    notificationType: params.notificationType,
    modelId: params.modelId,
    category: params.category,
    threshold: params.threshold,
  };
};

export const deleteNotification = async (
  params: DeleteNotificationParams
): Promise<{ notificationId: string }> => {
  await axios.post<void>(`${baseConfigUrl}/api/notification/delete`, params, {
    headers,
  });
  return {
    notificationId: params.notificationId,
  };
};

export const loadNotificationEvent = async (
  params: GetNotificationEventParams
): Promise<NotificationEvent> => {
  const response = await axios.post<NotificationEvent>(
    `${baseConfigUrl}/api/notification/event`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const loadNotificationEvents = async (
  params: GetNotificationEventsParams
): Promise<NotificationEvent[]> => {
  const response = await axios.post<NotificationEvent[]>(
    `${baseConfigUrl}/api/notification/events`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const newNotificationEvent = async (
  params: NewNotificationEventParams
): Promise<NotificationEvent> => {
  await axios.post<void>(
    `${baseConfigUrl}/api/notification/event/new`,
    params,
    {
      headers,
    }
  );
  return {
    notificationId: params.notificationId,
    entityId: params.entityId,
    scoringInstance: params.scoringInstance,
    score: params.score,
    status: params.status,
  };
};

export const deleteNotificationEvent = async (
  params: DeleteNotificationEventParams
): Promise<{
  notificationId: string;
  entityId: string;
  scoringInstance: number;
}> => {
  await axios.post<void>(
    `${baseConfigUrl}/api/notification/event/delete`,
    params,
    {
      headers,
    }
  );
  return {
    notificationId: params.notificationId,
    entityId: params.entityId,
    scoringInstance: params.scoringInstance,
  };
};
