/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
export type ModelsRiskIndicatorDataType = {
  id: number;
  value: number;
  weight: number;
};

export type ModelsCategoryDataType = {
  id: number;
  name: string;
  weight: number;
  items: ModelsRiskIndicatorDataType[];
};

export type RiskHistoricalTableDataType = {
  id: number;
  value: number;
  occurrence: number;
};

export type ModelsTableDataType = {
  id: number;
  name: string;
  description: string;
  owner: string;
  lastUpdate: number;
  status?: string;
  active?: boolean;
  items?: FiltersDataType[];
};

export type FiltersTableDataType = {
  id: number;
  name: string;
  description: string;
  owner: string;
  lastUpdate: string;
  type: number;
  behaviour: number;
  matchResource: number;
  matchField: number;
  matchItems: { match: number; score: number }[];
  useData: number;
  useOverTime: number;
  useDateValue: number;
  useDateType: number;
  reduceType: number;
  reduceDateValue: number;
  reduceDateType: number;
  recordItems: { field: number; filter: number; value: string }[];
};

export type FiltersDataType = {
  id: number;
  operator: number;
  resource: number;
  field: number;
  filter: number;
  key: string;
};

export type RiskSingleRecordDataType = {
  id: number;
  name: string;
  description: string;
  type: number;
  resource: number;
  items: RiskSingleRecordRowType[];
};

export type RiskSingleRecordRowType = {
  id: number;
  name: string;
  weight: number;
  behavior: number;
  first: number;
  second: number;
  score: number;
};

export type IdBase = {
  id: string | null;
};

export type WeightBase = {
  weight: number;
};

export type ModelFeatureFilter = {
  filterId: Filter['filterId'];
};

export type Model = {
  name: string;
  description?: string;
  owner?: string;
  lastUpdate?: number;
  status?: string;
  active?: boolean;
  attributes: AttributesType[];
  featureFilter?: ModelFeatureFilter[];
} & IdBase;

export type AttributesType = {
  attributeType: string;
  name: string;
  description?: string;
  owner?: string;
  lastUpdate?: string;
  status?: string;
  attributes: RiskIndicatorModelType[];
} & WeightBase;

export type Filter = {
  filterId: string;
  name: string;
  description?: string;
  owner?: string;
  lastUpdate?: number;
  status?: string;
  active?: boolean;
  attributes: FilterAttributeType[];
} & IdBase;

export type FiltersBackend = {
  filterId: string;
  author: string;
  filterJson: string;
  lastUpdateDate: number;
  name: string;
};
export type FiltersJsonParsed = {
  id: string | null;
  filterId: string;
  name: string;
  description: string;
  owner: string;
  attributes: FilterAttributeType[];
};

export type FilterAttributeType = {
  id: number;
  field: number;
  option: number;
  value: string;
};

export type FullModel = Omit<Model, 'attributes'> & {
  attributes: FullAttributesType[];
};

export type FullAttributesType = Omit<AttributesType, 'attributes'> & {
  attributes: FullRiskIndicator[];
};

export type FullRiskIndicator = RiskIndicatorType & WeightBase;

export type RiskIndicatorModelType = {
  attributeId: string;
} & WeightBase;

export type OutlierKeys = 'outlier_time' | 'outlier_val';

export type OutlierBase = {
  occurrenceBased?: boolean;
  scoringType?: string;
  unitInMillis?: number;
  periodInMillis?: number;
  periodInUnits?: number;
  subFrameInUnits?: number;
  unitWeightingStart?: number;
  unitWeightingStop?: number;
  unitWeightingOffset?: number;
  unitWeightingLength?: number;
  unitWeightingMultiplier?: number;
  periodWeightingMultiplier?: number;
  fillInUnits?: number;
};

export type RiskIndicatorType = {
  attributeType: string;
  name: string;
  description?: string;
  owner?: string;
  lastUpdate?: number;
  status?: string;
  active?: boolean;
  dataSource?: string;
  dataSource2?: string;
  riskField?: string;
  riskField2?: string;
  threshold?: number;
  min?: number;
  max?: number;
  useData?: string;
  useOverTime?: string;
  useDateValue?: number;
  useDateType?: string;
  reduceType?: string;
  reduceDateValue?: number;
  reduceDateType?: string;
  useStartDate?: string;
  useEndDate?: string;
  agingDays?: number;
  instanceCount?: number;
  values?: string[];
  features?: RiskIndicatorFeatures[];
  valueList?: RiskIndicatorValues[];
  rangeList?: RiskIndicatorRangeValues[];
  orderList?: RiskIndicatorOrderingValues[];
  windowInDays?: number;
  featureFilter?: RiskIndicatorExcludeItems[];
  timeFilter?: RiskIndicatorIncludeTimes;
} & IdBase &
  OutlierBase;

export type RiskIndicatorFeatures = string;

export type RiskIndicatorValues = {
  values: string[];
} & WeightBase;

export type RiskIndicatorRangeValues = {
  rangeStart: string;
  rangeEnd: string;
} & WeightBase;

export type RiskIndicatorOrderingValues = number;

export type RiskIndicatorExcludeItems = {
  field: string;
  feature: string;
  type: string;
  values: string[];
};

export type RiskIndicatorIncludeTimes = {
  type: string;
  value: number;
  units: string;
  startDate: string;
  endDate: string;
};

export type ConfigurationTableType =
  | ModelsTableDataType
  | Model
  | RiskIndicatorType
  | List
  | Filter;

export type RetrieveModelsParams = {
  accessToken: string;
  limit: number;
};

export type RetrieveModelsIdsParams = {
  accessToken: string;
  limit: number;
};

export type RetrieveModelParams = {
  accessToken: string;
  modelId: string;
};

export type NewModelParams = {
  accessToken: string;
  modelJson: string;
  author: string;
  modelId: string | null;
  lastUpdateDate: number;
  active: boolean;
};

export type DeleteModelParams = {
  accessToken: string;
  modelId: string;
};

export type RetrieveAttributesParams = {
  accessToken: string;
  limit: number;
};

export type RetrieveAttributesIdsParams = {
  accessToken: string;
  limit: number;
};

export type RetrieveAttributeParams = {
  accessToken: string;
  attributeId: string;
};

export type NewAttributeParams = {
  accessToken: string;
  attributeJson: string;
  author: string;
  name: string;
  lastUpdateDate: number;
};

export type DeleteAttributeParams = {
  accessToken: string;
  attributeName: string;
  attributeId: string;
};

export type DeleteAttributeResponse = {
  affectedModelIds: string[];
  attributeId: string;
};

export type List = {
  listId: string | null;
  description?: string;
  status?: string;
  owner?: string;
  active?: boolean;
  lastUpdate?: number;
  listValues: string;
};

export type RetrieveListParams = {
  accessToken: string;
  listId: string;
};

export type RetrieveListsParams = {
  accessToken: string;
  limit: number;
};

export type NewListParams = {
  accessToken: string;
  listId: string;
  listValues: string;
  description: string;
  owner: string;
  lastUpdateDate: number;
};

export type DeleteListParams = {
  accessToken: string;
  listId: string;
};

export type RetrieveFiltersParams = {
  accessToken: string;
  limit: number;
};

export type RetrieveFilterParams = {
  accessToken: string;
  filterId: string;
};

export type NewFilterParams = {
  accessToken: string;
  filterId: string;
  filterJson: string;
  author: string;
  name: string;
  lastUpdateDate: number;
};
