/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */

export const limitValue: (
  input: number,
  minimumValue: number,
  maximumValue: number
) => number = (input: number, minimumValue: number, maximumValue: number) =>
  Math.min(Math.max(input, minimumValue), maximumValue);

export const roundScore: (score: number) => number = (score: number): number =>
  Math.round(score * 100);

export const roundScoreIntelligently: (score: number) => number = (
  score: number
): number =>
  score >= 0 && score <= 1
    ? Math.round(limitValue(score * 100, 0, 100))
    : Math.round(limitValue(score, 0, 100));

export const convertScore: (score: number) => number = (
  score: number
): number => limitValue(score / 100, 0.0, 1.0);
