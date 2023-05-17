/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */

export const shortenFormat = (source: number): string => {
  if (source != null) {
    const formatter = Intl.NumberFormat('en', { notation: 'compact' });
    return formatter.format(source);
  }
  return '';
};

export const formatKey = (
  sourceKey: string,
  capitalizeKey: string[] = []
): string => {
  const capitalizeKeySet = new Set(capitalizeKey);
  if (capitalizeKeySet.has(sourceKey)) {
    return sourceKey.toUpperCase();
  }
  const capitalizeLetterFunction = (match: string): string =>
    match.toUpperCase().replace('_', ' ');
  return sourceKey.replace(/(^\w)|(\s\w)|(_\w)/g, capitalizeLetterFunction);
};

export const formatListId = (sourceListName: string): string => {
  /*
   * We want to match strings that start with any number of `@` signs
   * at the beginning of the string, and then find the listName: which is
   * anything that isn't an '@' sign.
   *
   * The listName that is not an '@' sign will become the listName,
   * which could have any character that is not white space.
   */
  const regexp = /(?:^@*)(?<listName>[\S]+)/;
  const match: RegExpMatchArray | null = sourceListName.match(regexp);
  if (match && match.groups && match.groups.listName) {
    return `@${match.groups.listName}`;
  }
  return sourceListName;
};

export const formatTableCellName = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);
