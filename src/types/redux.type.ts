/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { PaletteMode } from '@mui/material';
import { ResponseStatus, UISelectInterface } from './common.type';
import { UserJson } from './user.type';
import {
  EntityRanking,
  PaginationState,
  ScoreBasisResult,
} from './scoring.type';
import { List, Model, RiskIndicatorType } from './models.type';
import { Entity } from '@/types/entity.type';
import { Stats } from '@/types/stats.type';
import { EntityProperty } from '@/types/config.type';
import { PeerDataType, GraphDataType } from './graph.type';
import { ExternalApplication } from './profile.type';

export declare namespace ReduxJson {
  export type CommonReduxData<T> = {
    loading: boolean;
    data: T | null;
    status: ResponseStatus | null;
  };

  export type AppState = {
    theme: {
      mode: PaletteMode;
      loading: boolean;
    };
  };

  export type ControlState = {
    loading: boolean;
    status: ResponseStatus | null;
    scoringPaused: boolean;
  };

  export type UserState = {
    users: CommonReduxData<UserJson.User[]>;
    user: UserJson.User | null;
    accessToken?: string;
  };

  export type ConfigState = {
    dataSources: {
      loading: boolean;
      status: ResponseStatus | null;
      initialized: boolean;
      dataSourcesSelect: { id: string; name: string }[];
      dataSourcesFields: { [dataSourceId: string]: UISelectInterface[] };
    };
    entities: {
      loading: boolean;
      status: ResponseStatus | null;
      initialized: boolean;
      entityProperties: EntityProperty[];
      entityDetailProperties: EntityProperty[];
      entityStatusValues: {
        default: string;
        values: EntityProperty[];
      };
    };
  };

  export type ListsState = {
    loading: boolean;
    listsInitialized: boolean;
    status: ResponseStatus | null;
    selectedListId: string | null;
    listsById: { [id: string]: List };
    newList: List | null;
  };

  export type ScoresState = {
    loading: boolean;
    scoresInitialized: boolean;
    countInitialized: boolean;
    status: ResponseStatus | null;
    entityModelId: string | null;
    entityRanking: EntityRanking[] | null;
    scoringReportInitialized: boolean;
    basisReport: ScoreBasisResult[] | null;
    dataSourceId: string;
    beginCursor: string;
    endCursor: string;
    pageNumber: number;
    previousPageNumber: number;
    pageLimit: number | null;
    countRecords: number;
    basisCursorByPageNumber: { [pageNumber: number]: PaginationState };
  };

  export type ModelsState = {
    loading: boolean;
    initialized: boolean;
    status: ResponseStatus | null;
    models: { [id: string]: Model };
    selectedModelId: string | null;
    newModel: Model | null;
  };

  export type AttributesState = {
    loading: boolean;
    status: ResponseStatus | null;
    isAttributesInitialized: boolean;
    attributes: { [id: string]: RiskIndicatorType };
    newAttribute: RiskIndicatorType | null;
    currentAttributeId: string | null;
  };

  export type EntitiesState = {
    loading: boolean;
    initialized: boolean;
    status: ResponseStatus | null;
    entities: { [id: string]: Entity };
    isCommentsInitialized: boolean;
    isStatusInitialized: boolean;
    rankingByEntityId: { [id: string]: EntityRanking };
  };

  export type StatsState = {
    loading: boolean;
    initialized: boolean;
    status: ResponseStatus | null;
    latestStatsByModelId: { [modelId: string]: Stats };
    selectedStats: Stats | null;
  };

  export type GraphState = {
    loading: boolean;
    status: ResponseStatus | null;
    peerData: PeerDataType[];
    graphData: GraphDataType[];
  };

  export type ExternalState = {
    loading: boolean;
    status: ResponseStatus | null;
    externalData: ExternalApplication[];
  };
}
