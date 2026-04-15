import { getRuntimeApiBaseUrl } from '../config/runtime';

export function getApiBaseUrl(): string {
  return getRuntimeApiBaseUrl();
}

export const API_BASE_URL = getApiBaseUrl();

export function apiUrl(path: string): string {
  const base = API_BASE_URL;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
