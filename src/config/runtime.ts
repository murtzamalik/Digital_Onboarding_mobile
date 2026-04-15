import Constants from 'expo-constants';

export const DEFAULT_API_BASE_URL = 'http://localhost:8080/api/v1/mobile';

function sanitizeBaseUrl(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  return trimmed.replace(/\/+$/, '');
}

function readExtraApiBaseUrl(): string | undefined {
  const extra = Constants.expoConfig?.extra as
    | { apiBaseUrl?: unknown }
    | undefined;
  const maybeBaseUrl = extra?.apiBaseUrl;
  return typeof maybeBaseUrl === 'string' ? maybeBaseUrl : undefined;
}

/**
 * Runtime API base URL resolution order:
 * 1) EXPO_PUBLIC_API_BASE_URL
 * 2) expo.extra.apiBaseUrl
 * 3) DEFAULT_API_BASE_URL
 */
export function getRuntimeApiBaseUrl(): string {
  return (
    sanitizeBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL) ??
    sanitizeBaseUrl(readExtraApiBaseUrl()) ??
    DEFAULT_API_BASE_URL
  );
}
