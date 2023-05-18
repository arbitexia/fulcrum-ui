/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
export type DataSourceDescriptorConfig = {
  descriptors: {
    [descriptorName: string]: {
      labels: string[];
    };
  };
};

export type EntitiesDescriptorConfig = {
  entityProperties: string[];
  entityDetailProperties: string[];
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

export type RiskIndicatorConfig = {
  topNumberRiskIndicators: number;
};

export type GetDataSourceConfigParams = {
  accessToken: string;
};

export type GetEntitiesConfigParams = {
  accessToken: string;
};

export type GetRiskIndicatorConfigParams = {
  accessToken: string;
};

export type EntityPropertyBase = {
  propertyName: string;
  values?: string[];
};

export type EntityProperty = EntityPropertyBase | string;
