/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
export const stableSort = <T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
): [T, number][] => {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const comparatorOrder = comparator(a[0], b[0]);
    if (comparatorOrder !== 0) {
      return comparatorOrder;
    }
    return a[1] - b[1];
  });
  return stabilizedThis;
};

export const valueComparator = <T, Q>(
  array: readonly T[],
  order: 'asc' | 'desc' = 'asc',
  converter: (val: T) => Q
): ((a: T, b: T) => number) => {
  return (a, b) => {
    const retVal = order === 'asc' ? 1 : -1;
    const convertedA: Q = converter(a);
    const convertedB: Q = converter(b);
    if (convertedA < convertedB) {
      return -retVal;
    }
    if (convertedA > convertedB) {
      return retVal;
    }
    return 0;
  };
};

export const keyComparator = <T>(
  array: readonly T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): ((a: T, b: T) => number) => {
  return valueComparator<T, T[keyof T]>(array, order, (value: T) => {
    return value[key];
  });
};
