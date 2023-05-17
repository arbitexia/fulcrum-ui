/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';

export enum ResponseStatus {
  PENDING = 'pending',
  FAILED = 'failed',
  SUCCESS = 'success',
}

export type PaginateParam = {
  beginCursor?: string;
  endCursor?: string;
  pageNumber: number;
  limit: number;
};

export type PaginateResult<T> = {
  pageInfo: PaginateParam;
  modelId: string;
  data: T[];
};

export type DefaultChildProps = {
  children: React.ReactNode | React.ReactNode[];
  sx?: object;
  spacing?: number;
  ref?: React.RefObject<HTMLInputElement>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  variant?: 'outlined' | 'elevation';
  elevation?: number;
};

export interface DefaultModalProps {
  open: boolean;
  onClose: () => void;
}

export interface UISelectInterface {
  id: number | string;
  name: string;
}
