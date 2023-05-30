/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from '@/redux/store';
import { Entity, Model, ReduxJson, ResponseStatus } from '@/types';
import { notificationsApi } from '@/redux/apis';
import { AxiosError } from 'axios';
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
  NotificationType,
} from '@/types/notification.type';
import { formatDate } from '@/libs/time-utils';
import { getActiveModels } from '@/redux/slices/model.slice';
import { getEntitiesByIdWithMasking } from '@/redux/slices/entity.slice';
import { isAccessTokenValid } from '@/libs/auth-token';

const initialState: ReduxJson.NotificationState = {
  notifications: {
    initialized: false,
    loading: false,
    status: null,
    value: {},
  },
  notificationEvents: {
    initialized: false,
    loading: false,
    status: null,
    value: {},
  },
};

export const retrieveNotification = createAsyncThunk<
  Notification,
  GetNotificationParams,
  { dispatch: AppDispatch; state: RootState }
>('notification/retrieveNotification', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await notificationsApi.loadNotification(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const retrieveNotifications = createAsyncThunk<
  Notification[],
  GetNotificationsParams,
  { dispatch: AppDispatch; state: RootState }
>('notification/retrieveNotifications', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await notificationsApi.loadNotifications(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const createNotification = createAsyncThunk<
  Notification,
  NewNotificationParams,
  { dispatch: AppDispatch; state: RootState }
>('notification/createNotification', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await notificationsApi.newNotification(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const removeNotification = createAsyncThunk<
  { notificationId: string },
  DeleteNotificationParams,
  { dispatch: AppDispatch; state: RootState }
>('notification/removeNotification', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await notificationsApi.deleteNotification(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const retrieveNotificationEvent = createAsyncThunk<
  NotificationEvent,
  GetNotificationEventParams,
  { dispatch: AppDispatch; state: RootState }
>('notification/retrieveNotificationEvent', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await notificationsApi.loadNotificationEvent(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const retrieveNotificationEvents = createAsyncThunk<
  NotificationEvent[],
  GetNotificationEventsParams,
  { dispatch: AppDispatch; state: RootState }
>('notification/retrieveNotificationEvents', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await notificationsApi.loadNotificationEvents(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const createNotificationEvent = createAsyncThunk<
  NotificationEvent,
  NewNotificationEventParams,
  { dispatch: AppDispatch; state: RootState }
>('notification/createNotificationEvent', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await notificationsApi.newNotificationEvent(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

export const removeNotificationEvent = createAsyncThunk<
  { notificationId: string; entityId: string; scoringInstance: number },
  DeleteNotificationEventParams,
  { dispatch: AppDispatch; state: RootState }
>('notification/removeNotificationEvent', async (params, thunkAPI) => {
  try {
    // TODO - define the api auth token
    await isAccessTokenValid();
    return await notificationsApi.deleteNotificationEvent(params);
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data);
  }
});

const notificationSlice = createSlice({
  name: `notification`,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(retrieveNotification.pending, (state) => {
        state.notifications.loading = true;
        state.notifications.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveNotification.fulfilled,
        (state, { payload }: PayloadAction<Notification>) => {
          const notification = payload as Notification;
          const previousNotifications = { ...state.notifications.value };
          const { notificationId } = notification;
          state.notifications.value = {
            ...previousNotifications,
            [notificationId]: notification,
          };
          state.notifications.loading = false;
          state.notifications.initialized = true;
          state.notifications.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveNotification.rejected, (state) => {
        state.notifications.loading = false;
        state.notifications.initialized = true;
        state.notifications.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveNotifications.pending, (state) => {
        state.notifications.loading = true;
        state.notifications.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveNotifications.fulfilled,
        (state, { payload }: PayloadAction<Notification[]>) => {
          const notifications = payload as Notification[];
          const previousNotifications = { ...state.notifications.value };
          const newNotifications: { [notificationId: string]: Notification } =
            {};
          notifications.forEach((notification: Notification) => {
            const { notificationId } = notification;
            newNotifications[notificationId] = notification;
          });
          state.notifications.value = {
            ...previousNotifications,
            ...newNotifications,
          };
          state.notifications.loading = false;
          state.notifications.initialized = true;
          state.notifications.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveNotifications.rejected, (state) => {
        state.notifications.loading = false;
        state.notifications.initialized = true;
        state.notifications.status = ResponseStatus.FAILED;
      })
      .addCase(createNotification.pending, (state) => {
        state.notifications.loading = true;
        state.notifications.status = ResponseStatus.PENDING;
      })
      .addCase(
        createNotification.fulfilled,
        (state, { payload }: PayloadAction<Notification>) => {
          const notification = payload as Notification;
          const previousNotifications = { ...state.notifications.value };
          const { notificationId } = notification;
          state.notifications.value = {
            ...previousNotifications,
            [notificationId]: notification,
          };
          state.notifications.loading = false;
          state.notifications.initialized = true;
          state.notifications.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(createNotification.rejected, (state) => {
        state.notifications.loading = false;
        state.notifications.initialized = true;
        state.notifications.status = ResponseStatus.FAILED;
      })
      .addCase(removeNotification.pending, (state) => {
        state.notifications.loading = true;
        state.notifications.status = ResponseStatus.PENDING;
      })
      .addCase(
        removeNotification.fulfilled,
        (state, { payload }: PayloadAction<{ notificationId: string }>) => {
          const { notificationId } = payload as { notificationId: string };
          const {
            [notificationId]: _deletedNotification,
            ...newNotifications
          } = state.notifications.value;
          state.notifications.value = newNotifications;
          state.notifications.loading = false;
          state.notifications.initialized = true;
          state.notifications.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(removeNotification.rejected, (state) => {
        state.notifications.loading = false;
        state.notifications.initialized = true;
        state.notifications.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveNotificationEvent.pending, (state) => {
        state.notificationEvents.loading = true;
        state.notificationEvents.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveNotificationEvent.fulfilled,
        (state, { payload }: PayloadAction<NotificationEvent>) => {
          const notificationEvent = payload as NotificationEvent;
          const previousNotifications = { ...state.notificationEvents.value };
          const { notificationId, entityId, scoringInstance } =
            notificationEvent;
          const previousNotificationsForNoficationId = previousNotifications[
            notificationId
          ] ?? { [entityId]: { [scoringInstance]: notificationEvent } };

          state.notificationEvents.value = {
            ...previousNotifications,
            [notificationId]: previousNotificationsForNoficationId,
          };
          state.notificationEvents.loading = false;
          state.notificationEvents.initialized = true;
          state.notificationEvents.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveNotificationEvent.rejected, (state) => {
        state.notificationEvents.loading = false;
        state.notificationEvents.initialized = true;
        state.notificationEvents.status = ResponseStatus.FAILED;
      })
      .addCase(retrieveNotificationEvents.pending, (state) => {
        state.notificationEvents.loading = true;
        state.notificationEvents.status = ResponseStatus.PENDING;
      })
      .addCase(
        retrieveNotificationEvents.fulfilled,
        (state, { payload }: PayloadAction<NotificationEvent[]>) => {
          const notificationEvents = payload as NotificationEvent[];
          const newNotifications: {
            [notificationId: string]: {
              [entityId: string]: {
                [scoringInstance: number]: NotificationEvent;
              };
            };
          } = { ...state.notificationEvents.value };
          notificationEvents.forEach((notificationEvent: NotificationEvent) => {
            const { notificationId, entityId, scoringInstance } =
              notificationEvent;
            if (!(notificationId in newNotifications)) {
              newNotifications[notificationId] = {};
            }
            const notificationsByEntityId: {
              [entityId: string]: {
                [scoringInstance: number]: NotificationEvent;
              };
            } = newNotifications[notificationId];
            if (!(entityId in notificationsByEntityId)) {
              newNotifications[notificationId][entityId] = {};
            }
            newNotifications[notificationId][entityId][scoringInstance] =
              notificationEvent;
          });
          state.notificationEvents.value = newNotifications;
          state.notificationEvents.loading = false;
          state.notificationEvents.initialized = true;
          state.notificationEvents.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(retrieveNotificationEvents.rejected, (state) => {
        state.notificationEvents.loading = false;
        state.notificationEvents.initialized = true;
        state.notificationEvents.status = ResponseStatus.FAILED;
      })
      .addCase(createNotificationEvent.pending, (state) => {
        state.notificationEvents.loading = true;
        state.notificationEvents.status = ResponseStatus.PENDING;
      })
      .addCase(
        createNotificationEvent.fulfilled,
        (state, { payload }: PayloadAction<NotificationEvent>) => {
          const notificationEvent = payload as NotificationEvent;
          const previousEvents = { ...state.notificationEvents.value };
          const { notificationId, entityId, scoringInstance } =
            notificationEvent;
          if (notificationId in previousEvents) {
            const eventsForNotificationId = previousEvents[notificationId];
            if (entityId in eventsForNotificationId) {
              const eventsForEntityId = eventsForNotificationId[entityId];
              const newEvents = {
                ...previousEvents,
                [notificationId]: {
                  ...eventsForNotificationId,
                  [entityId]: {
                    ...eventsForEntityId,
                    [scoringInstance]: notificationEvent,
                  },
                },
              };
              state.notificationEvents.value = newEvents;
            } else {
              const newEvents = {
                ...previousEvents,
                [notificationId]: {
                  ...eventsForNotificationId,
                  [entityId]: { [scoringInstance]: notificationEvent },
                },
              };
              state.notificationEvents.value = newEvents;
            }
          } else {
            const newEvents = {
              ...previousEvents,
              [notificationId]: {
                [entityId]: { [scoringInstance]: notificationEvent },
              },
            };
            state.notificationEvents.value = newEvents;
          }
          state.notificationEvents.loading = false;
          state.notificationEvents.initialized = true;
          state.notificationEvents.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(createNotificationEvent.rejected, (state) => {
        state.notificationEvents.loading = false;
        state.notificationEvents.initialized = true;
        state.notificationEvents.status = ResponseStatus.FAILED;
      })
      .addCase(removeNotificationEvent.pending, (state) => {
        state.notificationEvents.loading = true;
        state.notificationEvents.status = ResponseStatus.PENDING;
      })
      .addCase(
        removeNotificationEvent.fulfilled,
        (
          state,
          {
            payload,
          }: PayloadAction<{
            notificationId: string;
            entityId: string;
            scoringInstance: number;
          }>
        ) => {
          const { notificationId, entityId, scoringInstance } = payload as {
            notificationId: string;
            entityId: string;
            scoringInstance: number;
          };
          const notificationEvents = { ...state.notificationEvents.value };
          if (notificationId in notificationEvents) {
            const eventsForNotificationId = notificationEvents[notificationId];
            if (entityId in eventsForNotificationId) {
              const eventsForEntityId = eventsForNotificationId[entityId];
              if (scoringInstance in eventsForEntityId) {
                delete notificationEvents[notificationId][entityId][
                  scoringInstance
                ];
              }
              const keyLengthEntityEvents = Object.keys(
                notificationEvents[notificationId][entityId]
              ).length;
              if (keyLengthEntityEvents <= 0) {
                delete notificationEvents[notificationId][entityId];
              }
              const keyLengthNotificationsEvents = Object.keys(
                notificationEvents[notificationId]
              ).length;
              if (keyLengthNotificationsEvents <= 0) {
                delete notificationEvents[notificationId];
              }
              state.notificationEvents.value = { ...notificationEvents };
            }
          }
          state.notificationEvents.loading = false;
          state.notificationEvents.initialized = true;
          state.notificationEvents.status = ResponseStatus.SUCCESS;
        }
      )
      .addCase(removeNotificationEvent.rejected, (state) => {
        state.notificationEvents.loading = false;
        state.notificationEvents.initialized = true;
        state.notificationEvents.status = ResponseStatus.FAILED;
      });
  },
});

export const isNotificationsInitializedSelector = (state: RootState): boolean =>
  state?.notifications?.notifications?.initialized ?? false;

export const isNotificationEventsInitializedSelector = (
  state: RootState
): boolean => state?.notifications?.notificationEvents?.initialized ?? false;

export const isNotificationsLoadingSelector = (state: RootState): boolean =>
  state?.notifications?.notifications?.loading ?? false;

export const isNotificationEventsLoadingSelector = (
  state: RootState
): boolean => state?.notifications?.notificationEvents?.loading ?? false;

export const isNotificationsStatusPendingSelector = (
  state: RootState
): boolean =>
  (state?.notifications?.notifications?.status ?? null) ===
  ResponseStatus.PENDING;

export const isNotificationsStatusSuccessSelector = (
  state: RootState
): boolean =>
  (state?.notifications?.notifications?.status ?? null) ===
  ResponseStatus.SUCCESS;

export const isNotificationsStatusFailedSelector = (
  state: RootState
): boolean =>
  (state?.notifications?.notifications?.status ?? null) ===
  ResponseStatus.FAILED;

export const isNotificationEventsStatusPendingSelector = (
  state: RootState
): boolean =>
  (state?.notifications?.notificationEvents?.status ?? null) ===
  ResponseStatus.PENDING;

export const isNotificationEventsStatusSuccessSelector = (
  state: RootState
): boolean =>
  (state?.notifications?.notificationEvents?.status ?? null) ===
  ResponseStatus.SUCCESS;

export const isNotificationEventsStatusFailedSelector = (
  state: RootState
): boolean =>
  (state?.notifications?.notificationEvents?.status ?? null) ===
  ResponseStatus.FAILED;

export const getNotificationsByNotificationId = (
  state: RootState
): { [notificationId: string]: Notification } =>
  state.notifications?.notifications?.value ?? {};

export const getNotifications = (state: RootState): Notification[] =>
  Object.values(state?.notifications?.notifications?.value ?? {}) ?? [];

export const getNotificationById =
  (notificationId: string): ((state: RootState) => Notification) =>
  (state: RootState) => {
    const notifications = state?.notifications?.notifications?.value;
    if (notificationId in notifications) {
      return notifications[notificationId];
    }
    return null;
  };

export const getNotificationEvents = (
  state: RootState
): NotificationEvent[] => {
  const notificationEvents: NotificationEvent[] = [];
  const notificationsValues =
    state?.notifications?.notificationEvents?.value ?? {};
  if (notificationsValues && Object.keys(notificationsValues).length > 0) {
    const notificationsByEntityId: {
      [entityId: string]: { [scoringInstance: number]: NotificationEvent };
    }[] = Object.values(notificationsValues);
    notificationsByEntityId.forEach(
      (notificationEventsForEntityId: {
        [entityId: string]: { [scoringInstance: number]: NotificationEvent };
      }) => {
        const notificationsByScoringInstance: {
          [scoringInstance: number]: NotificationEvent;
        }[] = Object.values(notificationEventsForEntityId);
        notificationsByScoringInstance.forEach(
          (notificationEventsForScoringInstance) => {
            const notificationEventsForScoringInstances: NotificationEvent[] =
              Object.values(notificationEventsForScoringInstance);
            notificationEventsForScoringInstances.forEach(
              (notificationEvent: NotificationEvent) => {
                notificationEvents.push(notificationEvent);
              }
            );
          }
        );
      }
    );
  }
  return notificationEvents;
};

export const getNotificationEventsForNotificationId =
  (notificationId: string): ((state: RootState) => NotificationEvent[]) =>
  (state: RootState) => {
    const returnEvents: NotificationEvent[] = [];
    const notificationsValues =
      state?.notifications?.notificationEvents?.value ?? {};
    if (notificationId in notificationsValues) {
      const notificationsByNotificationId = notificationsValues[notificationId];
      const notificationsByScoringInstance: {
        [scoringInstance: number]: NotificationEvent;
      }[] = Object.values(notificationsByNotificationId);
      notificationsByScoringInstance.forEach(
        (notificationEventsForScoringInstance) => {
          const notificationEventsForScoringInstances: NotificationEvent[] =
            Object.values(notificationEventsForScoringInstance);
          notificationEventsForScoringInstances.forEach(
            (notificationEvent: NotificationEvent) => {
              returnEvents.push(notificationEvent);
            }
          );
        }
      );
    }
    return returnEvents;
  };

export const getNotificationEventObjectForNotificationId =
  (
    notificationId: string
  ): ((state: RootState) => {
    [entityId: string]: { [scoringInstance: number]: NotificationEvent };
  } | null) =>
  (state: RootState) => {
    const notificationsValues =
      state?.notifications?.notificationEvents?.value ?? {};
    if (notificationId in notificationsValues) {
      return notificationsValues[notificationId];
    }
    return null;
  };

export const getNotificationEventsForNotificationIdAndEntityId =
  (
    notificationId: string,
    entityId: string
  ): ((state: RootState) => NotificationEvent[]) =>
  (state: RootState) => {
    const returnEvents: NotificationEvent[] = [];
    const notificationsValues =
      state?.notifications?.notificationEvents?.value ?? {};
    if (notificationId in notificationsValues) {
      const notificationsByNotificationId = notificationsValues[notificationId];
      if (entityId in notificationsByNotificationId) {
        const notificationsByScoringInstance: {
          [scoringInstance: number]: NotificationEvent;
        } = notificationsByNotificationId[entityId];
        const notificationEventsForScoringInstances: NotificationEvent[] =
          Object.values(notificationsByScoringInstance);
        notificationEventsForScoringInstances.forEach(
          (notificationEvent: NotificationEvent) => {
            returnEvents.push(notificationEvent);
          }
        );
      }
    }
    return returnEvents;
  };

export const getNotificationEventObjectForNotificationIdAndEntityId =
  (
    notificationId: string,
    entityId: string
  ): ((
    state: RootState
  ) => { [scoringInstance: number]: NotificationEvent } | null) =>
  (state: RootState) => {
    const notificationsValues =
      state?.notifications?.notificationEvents?.value ?? {};
    if (notificationId in notificationsValues) {
      const notificationsByEntityId = notificationsValues[notificationId];
      if (entityId in notificationsByEntityId) {
        return notificationsByEntityId[entityId];
      }
    }
    return null;
  };

export const getNotificationEventForNotificationIdEntityIdAndScoringInstance =
  (
    notificationId: string,
    entityId: string,
    scoringInstance: number
  ): ((state: RootState) => NotificationEvent | null) =>
  (state: RootState) => {
    const notificationsValues =
      state?.notifications?.notificationEvents?.value ?? {};
    if (notificationId in notificationsValues) {
      const notificationsByNotificationId = notificationsValues[notificationId];
      if (entityId in notificationsByNotificationId) {
        const notificationsByScoringInstance: {
          [scoringInstance: number]: NotificationEvent;
        } = notificationsByNotificationId[entityId];
        if (scoringInstance in notificationsByScoringInstance) {
          return notificationsByScoringInstance[scoringInstance];
        }
      }
    }
    return null;
  };

export const getNotificationsForTable = (
  state: RootState
): NotificationType[] => {
  const notificationsValue: Notification[] = getNotifications(state);
  return notificationsValue.map(
    (notification: Notification): NotificationType => {
      return {
        id: notification.notificationId,
        status: '',
        name: notification.name,
        score: '0',
        active: notification.active,
        notificationType: notification.notificationType,
        notificationName: notification.name,
        model: notification.modelId,
        category: notification.category,
        time: '',
        threshold: notification.threshold.toString(),
        isMasking: false,
      };
    }
  );
};

export const getNotificationEventsForTable = (
  state: RootState
): NotificationType[] => {
  const notificationsEventsValue: NotificationEvent[] =
    getNotificationEvents(state);
  const notificationsById: { [notificationId: string]: Notification } =
    getNotificationsByNotificationId(state);
  const modelsById: { [modelId: string]: Model } = getActiveModels(state);
  const maskedEntitiesById: { [entityId: string]: Entity } =
    getEntitiesByIdWithMasking(state);

  const candidateNotificationTypes: (NotificationType | null)[] =
    notificationsEventsValue.map(
      (notificationEvent: NotificationEvent): NotificationType | null => {
        const { notificationId, scoringInstance, status, entityId } =
          notificationEvent;
        const notification = notificationsById[notificationId] ?? null;
        if (notification !== null) {
          const entity = maskedEntitiesById[entityId] ?? null;
          const { modelId } = notification;
          const model = modelsById[modelId] ?? null;
          if (model !== null && entity !== null) {
            return {
              id: notification.notificationId,
              status,
              name: entity.isMasked
                ? 'Unmask'
                : (entity.properties.name as string),
              score: notificationEvent.score.toString(),
              active: false,
              notificationType: notification.notificationType,
              notificationName: notification.name,
              model: model.name,
              category: notification.category,
              time: formatDate(new Date(scoringInstance)),
              threshold: notification.threshold.toString(),
              isMasking: entity.isMasked ?? false,
              entityId,
              scoringInstance,
            };
          }
        }
        return null;
      }
    );
  const notificationTypes: NotificationType[] = [];
  candidateNotificationTypes.forEach(
    (candidateNotificationEvent: NotificationType | null) => {
      if (candidateNotificationEvent !== null) {
        notificationTypes.push(candidateNotificationEvent);
      }
    }
  );
  return notificationTypes;
};

export const getNotificationEventsEntityIds = (state: RootState): string[] => {
  const notificationsEventsValue: NotificationEvent[] =
    getNotificationEvents(state);
  return notificationsEventsValue.map(
    (notificationEvent: NotificationEvent) => notificationEvent.entityId
  );
};

export const getNotificationEventsCount = (state: RootState): number => {
  const notificationEvents = getNotificationEvents(state);
  return notificationEvents.length;
};

export default notificationSlice.reducer;
