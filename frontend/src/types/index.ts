// Auth types
export * from './auth';

// Public types
export * from './public';

// Citizen types
export * from './citizen';

// Admin types
export * from './admin';

// Generic API response wrappers
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export type Pagination = PaginatedResponse<unknown>['pagination'];
