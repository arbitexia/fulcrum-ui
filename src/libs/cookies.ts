/**
 * Copyright (c) 2023, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh patel
 */
export const writeCookie = (
  name: string,
  value: string,
  date: Date | string | null
): void => {
  if (typeof window === 'undefined') return;
  const expirey = date instanceof Date ? '; expires=' + date : null;
  const cookie = [
    name,
    '=',
    JSON.stringify(value),
    '; domain_.',
    window.location.host.toString(),
    '; path=/;',
    expirey,
  ].join('');
  document.cookie = cookie;
};

export const readCookie = (name: string): string | string[] | null => {
  let result: RegExpMatchArray | string | string[] | null =
    document.cookie.match(new RegExp(name + '=([^;]+)'));
  result = result != undefined ? result[1] : [];
  return result;
};
