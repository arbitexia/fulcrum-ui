/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import {
  Action,
  combineReducers,
  configureStore,
  Store,
  ThunkAction,
} from '@reduxjs/toolkit';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { createWrapper } from 'next-redux-wrapper';
import { ReduxJson } from '@/types';
import storage, { NoopStorage } from './storage';
import {
  appReducer,
  scoresReducer,
  modelsReducer,
  userReducer,
  attributesReducer,
  entitiesReducer,
  statsReducer,
  configReducer,
  controlReducer,
  listsReducer,
  graphReducer,
  externalReducer,
  filtersReducer,
  riskReducer,
  governanceReducer,
} from './slices';
import { WebStorage } from 'redux-persist/es/types';

const combinedReducer = combineReducers<{
  app: ReduxJson.AppState;
  users: ReduxJson.UserState;
  scores: ReduxJson.ScoresState;
  models: ReduxJson.ModelsState;
  attributes: ReduxJson.AttributesState;
  entities: ReduxJson.EntitiesState;
  stats: ReduxJson.StatsState;
  config: ReduxJson.ConfigState;
  control: ReduxJson.ControlState;
  lists: ReduxJson.ListsState;
  graph: ReduxJson.GraphState;
  external: ReduxJson.ExternalState;
  filters: ReduxJson.FiltersState;
  risks: ReduxJson.RiskState;
  governance: ReduxJson.GovernanceState;
}>({
  app: appReducer,
  users: userReducer,
  scores: scoresReducer,
  models: modelsReducer,
  attributes: attributesReducer,
  entities: entitiesReducer,
  stats: statsReducer,
  config: configReducer,
  control: controlReducer,
  lists: listsReducer,
  graph: graphReducer,
  external: externalReducer,
  filters: filtersReducer,
  risks: riskReducer,
  governance: governanceReducer,
});

const createStore = (): Store => {
  const persistConfig: {
    key: string;
    version: number;
    storage: WebStorage | NoopStorage;
    whitelist: Array<string>;
  } = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['app', 'samsara', 'users', 'control'],
  };

  const persistedReducer = persistReducer(persistConfig, combinedReducer);

  return configureStore({
    reducer: persistedReducer,
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
};

type ConfiguredStore = ReturnType<typeof createStore>;
type StoreGetState = ConfiguredStore['getState'];

export type RootState = ReturnType<StoreGetState>;
export type AppDispatch = ConfiguredStore['dispatch'];
export type AppThunk = ThunkAction<void, RootState, undefined, Action<string>>;

const wrapper = createWrapper<ConfiguredStore>(createStore, { debug: true });
export { wrapper, createStore };
