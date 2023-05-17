/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */

export const isObject = (variable: object | string | number): boolean =>
  variable !== null && typeof variable === 'object';

export const objectHasPropertyName = (
  variable: object | string | number,
  propertyName: string
): boolean => {
  if (!isObject(variable)) {
    return false;
  }
  const entityPropertyBase = variable as object;
  return propertyName in entityPropertyBase;
};
