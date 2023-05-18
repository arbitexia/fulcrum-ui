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

export const returnScore: (score: number, basis?: number) => number = (
  score: number,
  basis = 100
): number => score * basis;

export const roundScoreIntelligently: (score: number) => number = (
  score: number
): number =>
  score >= 0 && score <= 1
    ? Math.round(limitValue(score * 100, 0, 100))
    : Math.round(limitValue(score, 0, 100));

export const convertScore: (score: number) => number = (
  score: number
): number => limitValue(score / 100, 0.0, 1.0);

export const roundToSignificant: (
  number: number,
  significantDigits?: number
) => number = (number: number, significantDigits = 2): number =>
  Math.round(number * Math.pow(10, significantDigits)) /
  Math.pow(10, significantDigits);

export const roundScore: (
  score: number,
  basis?: number,
  digits?: number
) => number = (score: number, basis = 100, digits = 0): number =>
  roundToSignificant(score * basis, digits);
