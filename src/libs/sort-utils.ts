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
): T[] => {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const comparatorOrder = comparator(a[0], b[0]);
    if (comparatorOrder !== 0) {
      return comparatorOrder;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

export const keyComparator = <T>(
  array: readonly T[],
  key: keyof T
): ((a: T, b: T) => number) => {
  return (a, b) => {
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return +1;
    }
    return 0;
  };
};
