/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */

export type GetGraphParams = {
  accessToken: string;
  entityId: string;
  attributeId: string;
};

export type GetPeerAttributeHistoricalRankingParams = {
  accessToken: string;
  modelId: string;
  entityId: string;
};

export type GetPeerAttributeRankingParams = {
  accessToken: string;
  modelId: string;
  modelInstance: number;
  attributeName: string;
  peerHash: number;
  entityId: string;
};

export type GetPeerGroupRankingParams = {
  accessToken: string;
  modelId: string;
  modelInstance: number;
  entityId: string;
};

export type GetPeerGroupRankingResponse = {
  modelId: string;
  peerGroupHash: number;
};

export type GetPeerGroupHistoricalRankingParams = {
  accessToken: string;
  modelId: string;
  entityId: string;
};

export type HistoricalPeerGroupType = {
  attributeIdHash: number;
  entity: string;
  modelIdHash: number;
  peerIdHash: number;
  ranking: number;
  score: number;
  scoringInstance: number;
};

export type GraphDataType = {
  number: string;
  average: string;
  standDeviation: string;
  zScore: string;
  outlier2: string;
  outlier3: string;
  startDate: string;
  endDate: string;
};

export type PeerDataType = {
  minimum: number;
  max: number;
  average: number;
  rank: number;
  individual: number;
  ties: number;
  startDate: string;
  endDate: string;
};

export type PeerAttributeData = {
  entity: string;
  modelIdHash: number;
  scoringInstance: number;
  peerIdHash: number;
  attributeIdHash: number;
  ranking: number;
  ties: number;
  score: number;
};

export interface GraphModalProps {
  open: boolean;
  onClose: () => void;
  attribute: string;
  accessToken: string | null;
}

export interface PeerChartModalProps {
  open: boolean;
  onClose: () => void;
  attribute: string;
  modelId: string;
  modelInstance: number;
  entityId: string;
  categoryIndex: number;
  accessToken: string | null;
}

export interface OutlierModalProps {
  open: boolean;
  onClose: () => void;
  entityId: string;
  categoryIndex: number;
  attributeIndex: number;
  attributeName: string;
}
