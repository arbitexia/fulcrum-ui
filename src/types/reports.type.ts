/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */
export type ReportsColumnType = {
  id: string;
  headerName: string;
  props?: { [id: string]: string };
  variant?: string;
  sortable?: boolean;
};

export type ProgramTableType = {
  id: number;
  status: string;
  date: string;
  analyst: string;
  name: string;
  eid: number;
  title: string;
  businessArea: string;
};
