/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */

export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const returnArray: T[][] = [];
  let chunkedArray: T[] = [];
  const arrayMaxIndex = array.length - 1;
  array.forEach((item, index) => {
    if (index > 0 && index % chunkSize === 0) {
      returnArray.push(chunkedArray);
      chunkedArray = [];
      chunkedArray.push(item);
    } else if (index === arrayMaxIndex) {
      chunkedArray.push(item);
      returnArray.push(chunkedArray);
      chunkedArray = [];
    } else {
      chunkedArray.push(item);
    }
  });
  return returnArray;
};

export const existsInArray = <T>(
  array: T[],
  predicate: (item: T) => boolean
): boolean => {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      return true;
    }
  }
  return false;
};

export const allInArray = <T>(
  array: T[],
  predicate: (item: T) => boolean
): boolean => {
  return !existsInArray(array, (item: T) => !predicate(item));
};
