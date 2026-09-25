/**
 * Spring Boot Backend API Client.
 * The frontend must access system data through the backend API only.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1').replace(/\/$/, '');

let authToken: string | null = null;
let refreshTokenValue: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('boane_access_token', token);
  } else {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('boane_access_token');
  }
}

export function getAuthToken(): string | null {
  if (!authToken) {
    authToken = localStorage.getItem('boane_access_token') || localStorage.getItem('auth_token');
  }
  return authToken;
}

export function setRefreshToken(token: string | null) {
  refreshTokenValue = token;
  if (token) localStorage.setItem('boane_refresh_token', token);
  else localStorage.removeItem('boane_refresh_token');
}

export function getRefreshToken(): string | null {
  if (!refreshTokenValue) refreshTokenValue = localStorage.getItem('boane_refresh_token');
  return refreshTokenValue;
}

export function clearAuthTokens() {
  setAuthToken(null);
  setRefreshToken(null);
}

export const AUTH_INVALIDATED_EVENT = 'boane:auth-invalidated';
export const AUTH_REFRESHED_EVENT = 'boane:auth-refreshed';
let refreshInFlight: Promise<boolean> | null = null;

function invalidateSession() {
  clearAuthTokens();
  window.dispatchEvent(new Event(AUTH_INVALIDATED_EVENT));
}

async function refreshAccessToken(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  refreshInFlight = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) return false;
      const envelope = await response.json() as { success?: boolean; data?: { accessToken?: string; refreshToken?: string } };
      if (!envelope.success || !envelope.data?.accessToken || !envelope.data?.refreshToken) return false;
      setAuthToken(envelope.data.accessToken);
      setRefreshToken(envelope.data.refreshToken);
      window.dispatchEvent(new Event(AUTH_REFRESHED_EVENT));
      return true;
    } catch { return false; }
  })();
  try { return await refreshInFlight; } finally { refreshInFlight = null; }
}

type ApiErrorPayload = {
  message?: string;
  [key: string]: unknown;
};

function hasMessage(value: unknown): value is { message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string'
  );
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return hasMessage(error) && error.message.trim() ? error.message : fallback;
}

export class ApiError extends Error {
  constructor(public status: number, public statusText: string, public data?: ApiErrorPayload) {
    super(data?.message || `API Error ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

export type ApiResult<T> = { body: T; status: number; etag: string | null };

async function requestWithMetadata<T>(endpoint: string, options: RequestInit = {}, retried = false): Promise<ApiResult<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const isMultipart = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (!isMultipart && !headers['Content-Type']) headers['Content-Type'] = 'application/json';

  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, { ...options, headers });
  let data: unknown;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) data = await response.json();

  const errorData = typeof data === 'object' && data !== null ? data as ApiErrorPayload : undefined;
  if (!response.ok) {
    if (response.status === 401 && !endpoint.startsWith('/auth/')) {
      // A 401 does not prove the server did not apply a mutation. Refresh the
      // session, but only replay read-only requests; callers decide whether to
      // retry writes using their own idempotency contract.
      if (!retried && await refreshAccessToken()) {
        if ((options.method || 'GET').toUpperCase() === 'GET') return requestWithMetadata<T>(endpoint, options, true);
        throw new ApiError(response.status, response.statusText, errorData);
      }
      invalidateSession();
    }
    throw new ApiError(response.status, response.statusText, errorData);
  }
  return { body: data as T, status: response.status, etag: response.headers.get('etag') };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  return (await requestWithMetadata<T>(endpoint, options)).body;
}

async function download(endpoint: string, retried = false): Promise<Blob> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers: Record<string, string> = {};
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    if (response.status === 401) {
      if (!retried && await refreshAccessToken()) return download(endpoint, true);
      invalidateSession();
    }
    throw new ApiError(response.status, response.statusText);
  }
  return response.blob();
}

export const api = {
  getWithMetadata: <T>(endpoint: string, options?: RequestInit) => requestWithMetadata<T>(endpoint, { ...options, method: 'GET' }),
  postWithMetadata: <T>(endpoint: string, body?: unknown, options?: RequestInit) => requestWithMetadata<T>(endpoint, { ...options, method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) }),
  putWithMetadata: <T>(endpoint: string, body: unknown, options?: RequestInit) => requestWithMetadata<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patchWithMetadata: <T>(endpoint: string, body: unknown, options?: RequestInit) => requestWithMetadata<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) }),
  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'PUT', body: body === undefined ? undefined : JSON.stringify(body) }),
  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'PATCH', body: body === undefined ? undefined : JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'DELETE' }),
  upload: <T>(endpoint: string, formData: FormData) => request<T>(endpoint, { method: 'POST', body: formData }),
  download,
};

export default api;
