/**
 * Copyright (c) 2022, Red Vector, Inc.
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
  minimum: string;
  max: string;
  average: string;
  individual: string;
  startDate: string;
  endDate: string;
};

export interface GraphModalProps {
  open: boolean;
  onClose: () => void;
  attribute: string;
}
