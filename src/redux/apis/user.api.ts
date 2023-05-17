/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { UserJson } from '@/types';
import axios from 'axios';
import config from '@/config';
// FIXME - Are there any solution to make the lib directory is module?
import { apiHeader } from '@/libs/redux-api';
import { convertSnakeToCamelCase } from '@/libs/data-type';

const baseAuthenticationUrl: string = config.URLS.AUTHENTICATION || '';

export const loadUsers = async (
  params: UserJson.RetrieveUserParams
): Promise<UserJson.User[]> => {
  const response = await axios.get<UserJson.User[]>(
    `${baseAuthenticationUrl}/api/users`,
    apiHeader('token', params)
  );

  // FIXME - Capital issue? Common structure?
  return response.data.map((el) => convertSnakeToCamelCase(el));
};
