/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
// TODO - Need to split the export enum/types
export { ResponseStatus } from './common.type';

export type {
  DefaultChildProps,
  PaginateParam,
  DefaultModalProps,
  PaginateResult,
} from './common.type';

export type {
  GetPropertiesParams,
  Entity,
  GetEntityParams,
  GetEntitiesParams,
  QueryEntityParams,
  PropertyType,
} from './entity.type';

export type {
  DashboardTableType,
  StateCardProps,
  StateCardItemType,
} from './home.type';

export type {
  ProfileRiskTableType,
  ProfileBasisTableType,
  ProfileCommentType,
  ExternalApplication,
  NewExternalParams,
} from './profile.type';

export type {
  AttributesType,
  Model,
  ModelsTableDataType,
  ModelsRiskIndicatorDataType,
  ModelsCategoryDataType,
  FiltersTableDataType,
  FiltersDataType,
  RiskIndicatorFeatures,
  RiskIndicatorType,
  RiskIndicatorRangeValues,
  RiskIndicatorValues,
  RiskSingleRecordDataType,
  RiskSingleRecordRowType,
  RiskHistoricalTableDataType,
  List,
  RetrieveListParams,
  RetrieveListsParams,
  NewListParams,
  DeleteListParams,
  FilterAttributeType,
  Filter,
  NewFilterParams,
  RetrieveFilterParams,
  RetrieveFiltersParams,
} from './models.type';

export type {
  DataSourceDescriptorConfig,
  GetDataSourceConfigParams,
  EntitiesDescriptorConfig,
  GetEntitiesConfigParams,
  EntityPropertyBase,
  EntityProperty,
} from './config.type';

export type {
  RetrieveBasisParams,
  RetrieveScoringParams,
  BarChartDataSets,
  BarChartDataSet,
  EntityRanking,
  ScoreBasisResult,
  ScoringDataResult,
  ScoringRankingResult,
  ScoringResult,
  Attributes,
  Attribute,
  PaginationState,
} from './scoring.type';

export type {
  GetGraphParams,
  PeerDataType,
  GraphDataType,
  GraphModalProps,
  GetPeerAttributeHistoricalRankingParams,
  GetPeerAttributeRankingParams,
} from './graph.type';

// FIXME - Define the Jsons based on the response from the backend.
export type { ReduxJson } from './redux.type';
export type { UserJson } from './user.type';

export type {
  UnmaskingTableType,
  GovernanceColumnType,
  UsageTableType,
  StatusTableType,
} from './governance.type';

export type { AccessTokenType } from './auth.type';
export type {
  ReportsColumnType,
  ProgramTableType,
  OrganizationTableType,
  RetrieveProgramParams,
  RetrievePersonParams,
  RetrieveOrgParams,
  RiskStatusSummaryType,
  StatusOvertimeType,
  PersonPerType,
  IndividualsRiskIndicatorType,
} from './report.type';
