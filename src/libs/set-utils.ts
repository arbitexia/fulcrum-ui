/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */

export const union = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  const newSet: Set<T> = new Set<T>();
  setA.forEach((value: T) => {
    newSet.add(value);
  });
  setB.forEach((value: T) => {
    newSet.add(value);
  });
  return newSet;
};

export const intersection = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  const newSet: Set<T> = new Set<T>();
  setA.forEach((value: T) => {
    if (setB.has(value)) {
      newSet.add(value);
    }
  });
  return newSet;
};

export const difference = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  const newSet: Set<T> = new Set<T>();
  setA.forEach((value: T) => {
    if (!setB.has(value)) {
      newSet.add(value);
    }
  });
  return newSet;
};

export const symmetricDifference = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  const newSet: Set<T> = new Set<T>();
  setA.forEach((value: T) => {
    if (!setB.has(value)) {
      newSet.add(value);
    }
  });
  setB.forEach((value: T) => {
    if (!setA.has(value)) {
      newSet.add(value);
    }
  });
  return newSet;
};
