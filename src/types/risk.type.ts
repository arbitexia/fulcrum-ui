/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */
export type PropertyType = {
  [propertyid: string]: string;
};

export enum ExcelParseStatus {
  PENDING = 'PENDING',
  DONE = 'DONE',
  FAILED = 'FAILED',
}

export type ExcelRequestParam = {
  userId: string;
  uuid: string;
};

export type ExcelResponse = {
  id: string;
  userId: string;
  uuid: string;
  status: ExcelParseStatus;
  url: string | null;
  metadata: string | null;
};
