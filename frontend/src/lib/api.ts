/**
 * API Client for Dart Backend
 * 
 * All communication with the database goes through the Dart backend.
 * The frontend NEVER communicates directly with the database.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const N8N_BASE_URL = import.meta.env.VITE_N8N_BASE_URL || '';

// Token management
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

export function getAuthToken(): string | null {
  if (!authToken) {
    authToken = localStorage.getItem('auth_token');
  }
  return authToken;
}

// API Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

// Core fetch wrapper
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  base: 'api' | 'n8n' = 'api'
): Promise<T> {
  const baseUrl = base === 'api' ? API_BASE_URL : N8N_BASE_URL;

  if (!baseUrl) {
    throw new Error(`${base === 'api' ? 'VITE_API_BASE_URL' : 'VITE_N8N_BASE_URL'} is not configured`);
  }

  const url = `${baseUrl}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    throw new ApiError(response.status, response.statusText, data);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// HTTP method helpers
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'POST', body: body ? JSON.stringify(body) : undefined }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'PUT', body: body ? JSON.stringify(body) : undefined }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),

  // For file uploads (no Content-Type header — browser sets multipart boundary)
  upload: <T>(endpoint: string, formData: FormData) =>
    request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {}, // Override to remove Content-Type
    }),

  // For n8n webhook calls
  n8n: <T>(webhookPath: string, body?: unknown) =>
    request<T>(webhookPath, { method: 'POST', body: body ? JSON.stringify(body) : undefined }, 'n8n'),
};

export default api;
