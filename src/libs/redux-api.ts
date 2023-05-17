/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
interface ApiHeaderValues {
  headers?: { Accept: string; Authorization: string };
  params: object;
}

export const apiHeader = (
  token: string | undefined,
  params: object = {}
): ApiHeaderValues => {
  if (!token) {
    return { params };
  }

  return {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    params,
  };
};
