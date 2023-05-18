/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Dan Finkel
 */

export const SECONDS_AS_MILLISECONDS_FROM_EPOCH = 1000;
export const MINUTES_AS_MILLISECONDS_FROM_EPOCH =
  60 * SECONDS_AS_MILLISECONDS_FROM_EPOCH;
export const HOUR_AS_MILLISECONDS_FROM_EPOCH =
  60 * MINUTES_AS_MILLISECONDS_FROM_EPOCH;
export const DAY_AS_MILLISECONDS_FROM_EPOCH =
  24 * HOUR_AS_MILLISECONDS_FROM_EPOCH;
export const WEEK_AS_MILLISECONDS_FROM_EPOCH =
  7 * DAY_AS_MILLISECONDS_FROM_EPOCH;
export const WEEK_AS_HOURS_FROM_EPOCH =
  WEEK_AS_MILLISECONDS_FROM_EPOCH / HOUR_AS_MILLISECONDS_FROM_EPOCH;
export const MONTH_AS_MILLISECONDS_FROM_EPOCH =
  30 * DAY_AS_MILLISECONDS_FROM_EPOCH;
export const YEAR_AS_MILLISECONDS_FROM_EPOCH =
  365 * DAY_AS_MILLISECONDS_FROM_EPOCH;

export const addHours: (inDate: Date, hours: number) => Date = (
  inDate: Date,
  hours: number
) => {
  const newHours = inDate.getHours() + hours;
  const newDate = new Date(inDate.getTime());
  newDate.setHours(newHours);
  return newDate;
};

const defaultOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export const formatDate = (
  date: Date,
  locale = 'en-US',
  options = defaultOptions
): string => {
  return date.toLocaleDateString(locale, options);
};
