/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
export type DashboardTableType = {
  id: number | string;
  status: string;
  name: { icon?: string; value: string };
  score: number;
  rank: number;
  properties: { [id: string]: string };
};

export type StateCardItemType = {
  title: string;
  amount: string;
  info: string;
  icon?: string;
  index: number;
  formatter: (input: number) => string;
};

export interface StateCardProps {
  cardInfo: StateCardItemType;
}
