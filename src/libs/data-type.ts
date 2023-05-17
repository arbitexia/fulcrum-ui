/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import * as _ from 'lodash';
import { UserJson } from '@/types';

// FIXME - Should be sticky the type? or dynamic with typeof object?
type DataType = UserJson.User;
type ConvertSnakeToCamelCaseProps<T> = (value: object) => T;

export const convertSnakeToCamelCase: ConvertSnakeToCamelCaseProps<DataType> = (
  value
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
) => _.mapKeys(value, _.rearg(_.camelCase, 1));
