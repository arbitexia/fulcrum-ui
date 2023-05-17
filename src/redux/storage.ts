/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { WebStorage } from 'redux-persist/es/types';

export type NoopStorage = {
  getItem: (_key: never) => Promise<null>;
  setItem: (_key: never, _value: never) => Promise<void>;
  removeItem: (_key: never) => Promise<void>;
};

const createNoopStorage = (): NoopStorage => ({
  getItem(_key: never) {
    return Promise.resolve(null);
  },
  setItem(_key: never, value: never) {
    return Promise.resolve(value);
  },
  removeItem(_key: never) {
    return Promise.resolve();
  },
});

const storage: WebStorage | NoopStorage =
  typeof window !== `undefined`
    ? createWebStorage(`local`)
    : createNoopStorage();

export default storage;
