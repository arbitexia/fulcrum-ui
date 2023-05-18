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
  AuditEvent,
  DeleteMaskingStatusParams,
  EntityStatusLog,
  GetAuditEventsParams,
  GetEntityStatusesParams,
  GetMaskingParams,
  GetMaskingsByStatus,
  GetMaskingsParams,
  GetMaskingSystemAutoUnmaskPercentageParams,
  GetMaskingSystemAutoUnmaskTopCountParams,
  GetMaskingSystemRemaskDaysParams,
  GetMaskingSystemStatusParams,
  MaskingType,
  NewMaskingStatusParams,
  SetMaskingSystemAutoUnmaskPercentageParams,
  SetMaskingSystemAutoUnmaskTopCountParams,
  SetMaskingSystemRemaskDaysParams,
  SetMaskingSystemStatusParams,
} from '@/types/governance.type';

const baseConfigUrl: string = config.URLS.GOVERNANCE || '';

const headers = {
  'Access-Control-Allow-Origin': baseConfigUrl,
  'Access-Control-Allow-Methods':
    config.ACCESS_CONTROL_ALLOWED_METHODS.GOVERNANCE.join(','),
};

const auditConfigUrl: string = config.URLS.AUDIT || '';

const auditConfigHeaders = {
  'Access-Control-Allow-Origin': auditConfigUrl,
  'Access-Control-Allow-Methods':
    config.ACCESS_CONTROL_ALLOWED_METHODS.AUDIT.join(','),
};

const entityConfigUrl: string = config.URLS.ENTITY || '';

const entityConfigHeaders = {
  'Access-Control-Allow-Origin': auditConfigUrl,
  'Access-Control-Allow-Methods':
    config.ACCESS_CONTROL_ALLOWED_METHODS.ENTITY.join(','),
};

export const loadMaskingSystemStatus = async (
  params: GetMaskingSystemStatusParams
): Promise<boolean> => {
  const response = await axios.post<boolean>(
    `${baseConfigUrl}/api/masking/system/status`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const setSystemMaskingStatus = async (
  params: SetMaskingSystemStatusParams
): Promise<boolean> => {
  await axios.post<void>(
    `${baseConfigUrl}/api/masking/system/status/new`,
    params,
    {
      headers,
    }
  );
  return params.systemMaskingStatus;
};

export const loadMaskingSystemAutoUnmaskPercentage = async (
  params: GetMaskingSystemAutoUnmaskPercentageParams
): Promise<number> => {
  const response = await axios.post<number>(
    `${baseConfigUrl}/api/masking/system/autounmask/percent`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const setMaskingSystemAutoUnmaskPercentage = async (
  params: SetMaskingSystemAutoUnmaskPercentageParams
): Promise<number> => {
  await axios.post<void>(
    `${baseConfigUrl}/api/masking/system/autounmask/percent/new`,
    params,
    {
      headers,
    }
  );
  return params.autoUnmaskPercentage;
};

export const loadMaskingSystemAutoUnmaskTopCount = async (
  params: GetMaskingSystemAutoUnmaskTopCountParams
): Promise<number> => {
  const response = await axios.post<number>(
    `${baseConfigUrl}/api/masking/system/autounmask/count`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const setMaskingSystemAutoUnmaskTopCount = async (
  params: SetMaskingSystemAutoUnmaskTopCountParams
): Promise<number> => {
  await axios.post<void>(
    `${baseConfigUrl}/api/masking/system/autounmask/count/new`,
    params,
    {
      headers,
    }
  );
  return params.autoUnmaskCount;
};

export const loadMaskingSystemRemaskDays = async (
  params: GetMaskingSystemRemaskDaysParams
): Promise<number> => {
  const response = await axios.post<number>(
    `${baseConfigUrl}/api/masking/system/remask`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const setMaskingSystemRemaskDays = async (
  params: SetMaskingSystemRemaskDaysParams
): Promise<number> => {
  await axios.post<void>(
    `${baseConfigUrl}/api/masking/system/remask/new`,
    params,
    {
      headers,
    }
  );
  return params.remaskingDays;
};

export const getMaskings = async (
  params: GetMaskingsParams
): Promise<MaskingType[]> => {
  const response = await axios.post<MaskingType[]>(
    `${baseConfigUrl}/api/maskings`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const getMaskingsByStatus = async (
  params: GetMaskingsByStatus
): Promise<MaskingType[]> => {
  const response = await axios.post<MaskingType[]>(
    `${baseConfigUrl}/api/maskings/statuses`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const getMasking = async (
  params: GetMaskingParams
): Promise<MaskingType> => {
  const response = await axios.post<MaskingType>(
    `${baseConfigUrl}/api/masking`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const setNewMasking = async (
  params: NewMaskingStatusParams
): Promise<MaskingType> => {
  await axios.post<void>(`${baseConfigUrl}/api/masking/new`, params, {
    headers,
  });
  return {
    userId: params.userId,
    entityId: params.entityId,
    status: params.status,
    justification: params.justification,
    lastUpdateDate: params.lastUpdateDate,
    score: parseFloat(params.score),
    modelId: params.modelId,
    scoringInstance: params.scoringInstance,
  };
};

export const deleteMasking = async (
  params: DeleteMaskingStatusParams
): Promise<{ userId: string; entityId: string }> => {
  await axios.post<void>(`${baseConfigUrl}/api/masking/delete`, params, {
    headers,
  });
  return { userId: params.userId, entityId: params.entityId };
};

export const loadAuditEvents = async (
  params: GetAuditEventsParams
): Promise<AuditEvent[]> => {
  const response = await axios.post<AuditEvent[]>(
    `${auditConfigUrl}/api/audit/events`,
    params,
    {
      headers: auditConfigHeaders,
    }
  );
  return response.data;
};

export const loadEntityStatusesEvents = async (
  params: GetEntityStatusesParams
): Promise<EntityStatusLog[]> => {
  const response = await axios.post<EntityStatusLog[]>(
    `${entityConfigUrl}/api/entity/statuses`,
    params,
    {
      headers: entityConfigHeaders,
    }
  );
  return response.data;
};
