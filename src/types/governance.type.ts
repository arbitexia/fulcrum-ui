/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import { PropertyType } from '@/types/entity.type';

export type GovernanceColumnType = {
  id: string;
  headerName: string;
  props?: { [id: string]: string };
  variant?: string;
  sortable?: boolean;
};

export type UnmaskingTableType =
  | {
      id: string;
      name: string;
      score: number;
      userId: string;
      justification: string;
      modelId: string;
      scoringInstance: number;
    }
  | PropertyType;

export type GovernanceEntity = {
  entityId: string;
  name: string;
  score: number;
  justification: string;
  eid: string;
  title: string;
  department: string;
  location: string;
};

export type UsageTableType = {
  id: string;
  name?: string;
  score?: number;
  action: string;
  date: string;
  user: string;
  role: string;
  description: string;
};

export type StatusTableType =
  | {
      id: string;
      name: string;
      status: string;
      date: string;
      user: string;
    }
  | PropertyType;

export type GetMaskingSystemStatusParams = {
  accessToken: string;
};

export type SetMaskingSystemStatusParams = {
  accessToken: string;
  systemMaskingStatus: boolean;
};

export type GetMaskingSystemAutoUnmaskPercentageParams = {
  accessToken: string;
};

export type SetMaskingSystemAutoUnmaskPercentageParams = {
  accessToken: string;
  autoUnmaskPercentage: number;
};

export type GetMaskingSystemAutoUnmaskTopCountParams = {
  accessToken: string;
};

export type SetMaskingSystemAutoUnmaskTopCountParams = {
  accessToken: string;
  autoUnmaskCount: number;
};

export type GetMaskingSystemRemaskDaysParams = {
  accessToken: string;
};

export type SetMaskingSystemRemaskDaysParams = {
  accessToken: string;
  remaskingDays: number;
};

export type NewMaskingStatusParams = {
  accessToken: string;
  userId: string;
  entityId: string;
  status: string;
  justification: string;
  lastUpdateDate: number;
  score: string;
  modelId: string;
  scoringInstance: number;
};

export type GetMaskingParams = {
  accessToken: string;
  userId: string;
  entityId: string;
};

export type GetMaskingsParams = {
  accessToken: string;
  userId: string;
};

export type GetMaskingsByStatus = {
  accessToken: string;
  status: string;
};

export type DeleteMaskingStatusParams = {
  accessToken: string;
  userId: string;
  entityId: string;
};

export type GetAuditEventsParams = {
  accessToken: string;
  limit: number;
};

export type GetEntityStatusesParams = {
  accessToken: string;
};

export type MaskingType = {
  userId: string;
  entityId: string;
  status: string;
  justification: string;
  lastUpdateDate: number;
  score: number;
  modelId: string;
  scoringInstance: number;
};

export type AuditEvent = {
  userId: string;
  eventType: string;
  timestamp: number;
  eventJson: string;
};

export type EntityStatusLog = {
  entityId: string;
  timeStamp: number;
  entityStatus: string;
  author: string;
};
