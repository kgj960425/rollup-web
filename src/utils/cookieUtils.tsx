import Cookies from 'universal-cookie';
import type { CookieSetOptions, CookieGetOptions, CookieChangeListener } from 'universal-cookie';

const cookies = new Cookies();

export const setCookie = (name: string, value: string, options?: CookieSetOptions) => {
  return cookies.set(name, value, options);
};

export const getCookie = (name: string, options?: CookieGetOptions) => {
  return cookies.get(name, options);
};

export const removeCookie = (name: string, options?: CookieSetOptions) => {
  return cookies.remove(name, options);
};

export const addCookieChangeListener = (listener: CookieChangeListener) => {
  cookies.addChangeListener(listener);
}

export const removeCookieChangeListener = (listener: CookieChangeListener) => {
  cookies.removeChangeListener(listener);
}

export const getAllCookies = (options?: CookieGetOptions) => {
    return cookies.getAll(options);
};


export default cookies;