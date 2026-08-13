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

export class ApiError extends Error {
  constructor(public status: number, public statusText: string, public data?: any) {
    super(data?.message || `API Error ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const isMultipart = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (!isMultipart && !headers['Content-Type']) headers['Content-Type'] = 'application/json';

  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, { ...options, headers });
  let data: any = undefined;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) data = await response.json();

  if (!response.ok) throw new ApiError(response.status, response.statusText, data);
  return data as T;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) }),
  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'PUT', body: body === undefined ? undefined : JSON.stringify(body) }),
  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'PATCH', body: body === undefined ? undefined : JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'DELETE' }),
  upload: <T>(endpoint: string, formData: FormData) => request<T>(endpoint, { method: 'POST', body: formData }),
};

export default api;
