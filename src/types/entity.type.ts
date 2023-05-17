/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Dan Finkel
 */

export type PropertyType = {
  [propertyid: string]: string;
};

export type Entity = {
  entityId: string;
  properties: PropertyType;
  entityComments?: EntityComment[];
  entityStatus: EntityStatus;
};

export type EntityStatus = string;

export type EntityReturn = {
  entityId: string;
  entityComments?: EntityComment[];
};

export type EntityReturnStatus = {
  entityId: string;
  entityStatus: EntityStatus;
};

export type EntityComment = {
  id: string;
  comment: string;
  author: string;
};

export type GetEntityParams = {
  accessToken: string;
  entityId: string;
};

export type GetEntitiesParams = {
  accessToken: string;
};

export type GetPropertiesParams = {
  accessToken: string;
};

export type QueryEntityParams = {
  accessToken: string;
  entityQuery: string;
};

export type QueryEntityStatusParams = {
  accessToken: string;
  entityId: string;
};

export type NewEntityStatusParams = {
  accessToken: string;
  entityId: string;
  entityStatus: string;
  author: string;
  timeStamp: number;
};

export type QueryEntityCommentsParams = {
  accessToken: string;
  entityId: string;
};

export type NewEntityCommentsParams = {
  accessToken: string;
  entityId: string;
  entityComment: string;
  author: string;
};
