/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import config from '@/config';
import { ExcelRequestParam, ExcelResponse } from '@/types/risk.type';
import axios from 'axios';

const baseRiskUrl: string = config.URLS.RISK || '';

const headers = {
  'Access-Control-Allow-Origin': baseRiskUrl,
  'Access-Control-Allow-Methods':
    config.ACCESS_CONTROL_ALLOWED_METHODS.RISK.join(','),
};

export const downloadExcelFile = async (
  params: ExcelRequestParam
): Promise<ExcelResponse> => {
  const response = await axios.post<ExcelResponse>(
    `${baseRiskUrl}/getcsv`,
    params,
    { headers }
  );
  return response.data;
};
