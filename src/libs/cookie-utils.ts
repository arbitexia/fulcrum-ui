import Cookies from 'js-cookie';

export const writeCookie = (
  name: string,
  value: string,
  days?: number
): void => {
  const options = days ? { expires: days } : {};
  Cookies.set(name, value, options);
};

export const readCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

export const deleteCookie = (name: string): void => {
  Cookies.remove(name);
};
