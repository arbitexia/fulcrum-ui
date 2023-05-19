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
  HistoricalRanking,
  PaginationState,
  ScoreBasisResult,
} from './scoring.type';
import { Filter, List, Model, RiskIndicatorType } from './models.type';
import { Entity } from '@/types/entity.type';
import {
  DataSourceStatByPopulationName,
  Stats,
  TopRiskIndicatorPercentage,
  TriageAndAverageScore,
} from '@/types/stats.type';
import { EntityProperty } from '@/types/config.type';
import {
  PeerDataType,
  GraphDataType,
  HistoricalPeerGroupType,
  PeerAttributeData,
} from './graph.type';
import { ExternalApplication } from './profile.type';
import { ExcelResponse } from './risk.type';
import {
  AuditEvent,
  EntityStatusLog,
  MaskingType,
} from '@/types/governance.type';
import { Notification, NotificationEvent } from '@/types/notification.type';

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
      entityMaskingValues: {
        default: string;
        values: EntityProperty[];
      };
      homePageTopPercent: number;
    };
    riskIndicators: {
      loading: boolean;
      status: ResponseStatus | null;
      initialized: boolean;
      topNumberRiskIndicators: number;
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
    scoringReportInitialized: boolean;
    scoringCategoriesInitialized: boolean;
    categoriesCountInitialized: boolean;
    scoringHistoryDataInitialized: boolean;
    peerGroupHashInitialized: boolean;
    peerGroupHistoricalHashesInitialized: boolean;
    peerAttributeDataInitialized: boolean;
    status: ResponseStatus | null;
    entityModelId: string | null;
    entityRanking: EntityRanking[] | null;
    basisReport: ScoreBasisResult[] | null;
    scoringHistory: HistoricalRanking[] | null;
    dataSourceId: string;
    beginCursor: string;
    endCursor: string;
    pageNumber: number;
    previousPageNumber: number;
    pageLimit: number | null;
    countRecords: number;
    basisCursorByPageNumber: { [pageNumber: number]: PaginationState };
    peerGroupHashModelId: string | null;
    peerGroupHash: number | null;
    peerGroupHashCallFailed: { [modelId: string]: boolean };
    peerGroupHistoricalHashes: HistoricalPeerGroupType[];
    peerAttributeData: PeerAttributeData | null;
    selectedCategories?: string[];
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
    hasDeleteAttributeMessage: boolean;
    attributes: { [id: string]: RiskIndicatorType };
    newAttribute: RiskIndicatorType | null;
    currentAttributeId: string | null;
  };
  export type FiltersState = {
    loading: boolean;
    status: ResponseStatus | null;
    filters: { [id: string]: Filter };
    newFilter: Filter | null;
    currentFilterId: string | null;
  };

  export type EntitiesState = {
    loading: boolean;
    initialized: boolean;
    status: ResponseStatus | null;
    entities: { [id: string]: Entity };
    entitiesPending: { [id: string]: boolean };
    isCommentsInitialized: boolean;
    isStatusInitialized: boolean;
    rankingByEntityId: { [id: string]: EntityRanking };
    historyByEntityId: { [id: string]: HistoricalRanking[] };
  };

  export type StatsState = {
    loading: boolean;
    initialized: boolean;
    status: ResponseStatus | null;
    latestStatsByModelId: { [modelId: string]: Stats[] };
    maxInstanceNumber: number;
    statsByDataSourceId: {
      [dataSourceId: string]: DataSourceStatByPopulationName;
    };
    topAttributesByModelIdInitialized: { [modelId: string]: boolean };
    topAttributesByModelId: { [modelId: string]: TopRiskIndicatorPercentage[] };
    countTriageByModelIdInitialized: { [modelId: string]: boolean };
    countTriagedByModelId: { [modelId: string]: TriageAndAverageScore };
    selectedStats: Stats | null;
    numberOfLeads: number | null;
    numberOfLeadsInitialized: boolean;
    numberOfCases: number | null;
    numberOfCasesInitialized: boolean;
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

  export type RiskState = {
    risks: [];
    downloadStatus: ExcelResponse | null;
  };

  export type GovernanceState = {
    systemMasking: {
      initialized: boolean;
      loading: boolean;
      status: ResponseStatus | null;
      value: boolean;
    };
    autoUnmaskPercent: {
      initialized: boolean;
      loading: boolean;
      status: ResponseStatus | null;
      value: number;
    };
    autoUnmaskTopCount: {
      initialized: boolean;
      loading: boolean;
      status: ResponseStatus | null;
      value: number;
    };
    remaskAfterDays: {
      initialized: boolean;
      loading: boolean;
      status: ResponseStatus | null;
      value: number;
    };
    entitiesToMask: {
      initialized: boolean;
      loading: boolean;
      status: ResponseStatus | null;
      value: { [entityId: string]: MaskingType };
    };
    auditEvents: {
      initialized: boolean;
      loading: boolean;
      status: ResponseStatus | null;
      value: AuditEvent[];
    };
    entityStatuses: {
      initialized: boolean;
      loading: boolean;
      status: ResponseStatus | null;
      value: EntityStatusLog[];
    };
  };
  export type NotificationState = {
    notifications: {
      initialized: boolean;
      loading: boolean;
      status: ResponseStatus | null;
      value: { [notificationId: string]: Notification };
    };
    notificationEvents: {
      initialized: boolean;
      loading: boolean;
      status: ResponseStatus | null;
      value: {
        [notificationId: string]: {
          [entityId: string]: { [scoringInstance: number]: NotificationEvent };
        };
      };
    };
  };
}
