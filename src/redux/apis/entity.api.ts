/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Dan Finkel
 */
import {
  Entity,
  GetEntityParams,
  GetEntitiesParams,
  QueryEntityParams,
} from '@/types';
import axios from 'axios';
import config from '@/config';
import {
  EntityComment,
  EntityReturn,
  EntityReturnStatus,
  NewEntityCommentsParams,
  NewEntityStatusParams,
  QueryEntityCommentsParams,
  QueryEntityStatusParams,
} from '@/types/entity.type';

const baseEntityUrl: string = config.URLS.ENTITY || '';

const headers = {
  'Access-Control-Allow-Origin': baseEntityUrl,
  'Access-Control-Allow-Methods':
    config.ACCESS_CONTROL_ALLOWED_METHODS.ENTITY.join(','),
};

export const loadEntitiesData = async (
  params: GetEntitiesParams
): Promise<Entity[]> => {
  const response = await axios.post<Entity[]>(
    `${baseEntityUrl}/api/entities`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const loadEntityData = async (
  params: GetEntityParams
): Promise<Entity> => {
  const response = await axios.post<Entity>(
    `${baseEntityUrl}/api/entity`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const loadUnmaskedEntityData = async (
  params: GetEntityParams
): Promise<Entity> => {
  const response = await axios.post<Entity>(
    `${baseEntityUrl}/api/entity/unmasked`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const queryEntityData = async (
  params: QueryEntityParams
): Promise<Entity[]> => {
  const response = await axios.post<Entity[]>(
    `${baseEntityUrl}/api/query/entities`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const loadEntityStatusData = async (
  params: QueryEntityStatusParams
): Promise<EntityReturnStatus> => {
  const response = await axios.post<EntityReturnStatus>(
    `${baseEntityUrl}/api/entity/status/latest`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const newEntityStatus = async (
  params: NewEntityStatusParams
): Promise<EntityReturnStatus> => {
  await axios.post<void>(`${baseEntityUrl}/api/entity/status/new`, params, {
    headers,
  });
  return { entityId: params.entityId, entityStatus: params.entityStatus };
};

export const loadEntityCommentsData = async (
  params: QueryEntityCommentsParams
): Promise<EntityReturn> => {
  const response = await axios.post<EntityComment[]>(
    `${baseEntityUrl}/api/entity/comments`,
    params,
    {
      headers,
    }
  );
  return { entityId: params.entityId, entityComments: response.data };
};

export const newEntityComments = async (
  params: NewEntityCommentsParams
): Promise<EntityReturn> => {
  await axios.post<void>(`${baseEntityUrl}/api/entity/comment/new`, params, {
    headers,
  });
  return {
    entityId: params.entityId,
    entityComments: [
      {
        comment: params.entityComment,
        author: params.author,
        timestamp: Date.now(),
      },
    ],
  };
};
