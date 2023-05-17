/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
export type ProfileRiskTableType = {
  id: number;
  indicator: string;
  score: number;
  max: number;
  trend: number;
  up: number;
};

export type ProfileBasisTableType = {
  id: number;
  date: string;
  emailSent: number;
  attachSent: number;
  size: string;
};

export type ProfileCommentType = {
  id: number;
  avatar: string;
  online: boolean;
  name: string;
  date: string;
  comment: string;
  file?: string;
};

export type ExternalApplication = {
  id: number;
  name: string;
  description: string;
  analyst: string;
  actionTime: string;
  status: string;
  action: string;
  createdAt: string;
};

export type NewExternalParams = {
  accessToken: string;
  externalJson: string;
  author: string;
  lastUpdateDate: number;
};
