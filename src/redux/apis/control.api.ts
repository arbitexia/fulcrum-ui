/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Dan Finkel
 */
import { ControlParams } from '@/types/control.type';
import axios from 'axios';
import config from '@/config';

const baseControlUrl: string = config.URLS.CONTROL || '';

const headers = {
  'Access-Control-Allow-Origin': baseControlUrl,
  'Access-Control-Allow-Methods':
    config.ACCESS_CONTROL_ALLOWED_METHODS.CONTROL.join(','),
};

export const ingestData = async (params: ControlParams): Promise<string> => {
  const response = await axios.post<string>(
    `${baseControlUrl}/api/control/ingest`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const replayData = async (params: ControlParams): Promise<string> => {
  const response = await axios.post<string>(
    `${baseControlUrl}/api/control/replay`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const resetModels = async (params: ControlParams): Promise<string> => {
  const response = await axios.post<string>(
    `${baseControlUrl}/api/control/reset`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const refreshModels = async (params: ControlParams): Promise<string> => {
  const response = await axios.post<string>(
    `${baseControlUrl}/api/control/refresh`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const scoreModels = async (params: ControlParams): Promise<string> => {
  const response = await axios.post<string>(
    `${baseControlUrl}/api/control/score`,
    params,
    {
      headers,
    }
  );
  return response.data;
};

export const fullRun = async (params: ControlParams): Promise<string> => {
  const response = await axios.post<string>(
    `${baseControlUrl}/api/control/full`,
    params,
    {
      headers,
    }
  );
  return response.data;
};
