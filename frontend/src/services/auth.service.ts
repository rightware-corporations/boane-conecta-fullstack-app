import { api, setAuthToken, setRefreshToken, clearAuthTokens, getRefreshToken, getErrorMessage } from '@/lib/api';
import type {
  AuthSession,
  LoginCredentials,
  RegisterData,
  User,
  Profile,
  ApiResponse,
  UserRole,
} from '@/types';

type BackendUser = {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  status?: string;
  emailVerified?: boolean;
  roles?: string[];
};

type BackendAuthResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: BackendUser;
};

function mapRole(roles?: string[]): UserRole {
  const normalized = (roles || []).map((role) => role.replace(/^ROLE_/, '').toUpperCase());
  if (normalized.includes('SUPER_ADMIN')) return 'super_admin';
  if (normalized.includes('ADMIN')) return 'admin';
  if (normalized.includes('MANAGER')) return 'gestor';
  if (normalized.includes('EMPLOYEE')) return 'funcionario';
  if (normalized.includes('EDITOR')) return 'editor';
  return 'municipe';
}

function mapUser(user: BackendUser): User {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone || null,
    status: user.status,
    emailVerified: user.emailVerified,
    roles: user.roles || [],
    created_at: '',
    updated_at: '',
  };
}

function mapProfile(user: BackendUser): Profile {
  const role = mapRole(user.roles);
  return {
    id: user.id,
    user_id: user.id,
    full_name: user.fullName || null,
    role,
    phone: user.phone || null,
    avatar_url: null,
    nuit: null,
    bi: null,
    address: null,
    district: null,
    neighborhood: null,
    verified: !!user.emailVerified,
    created_at: '',
    updated_at: '',
  };
}

function mapSession(data: BackendAuthResponse): AuthSession {
  return {
    token: data.accessToken,
    refreshToken: data.refreshToken,
    tokenType: data.tokenType,
    expiresIn: data.expiresIn,
    user: mapUser(data.user),
    profile: mapProfile(data.user),
    expires_at: new Date(Date.now() + data.expiresIn * 1000).toISOString(),
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ data?: AuthSession; error?: string }> {
    try {
      const response = await api.post<ApiResponse<BackendAuthResponse>>('/auth/login', credentials);
      if (response.success && response.data) {
        const session = mapSession(response.data);
        setAuthToken(session.token);
        setRefreshToken(session.refreshToken);
        return { data: session };
      }
      return { error: response.message || 'Login failed' };
    } catch (error) {
      return { error: getErrorMessage(error, 'Network error during login') };
    }
  },

  async register(data: RegisterData): Promise<{ error?: string }> {
    try {
      const response = await api.post<ApiResponse<BackendUser>>('/auth/register', {
        fullName: data.full_name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      if (response.success) return {};
      return { error: response.message || 'Registration failed' };
    } catch (error) {
      return { error: getErrorMessage(error, 'Network error during registration') };
    }
  },

  async logout(): Promise<void> {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.warn('Error during logout:', error);
    } finally {
      clearAuthTokens();
    }
  },

  async refreshToken(): Promise<{ data?: AuthSession; error?: string }> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return { error: 'No refresh token available' };
    try {
      const response = await api.post<ApiResponse<BackendAuthResponse>>('/auth/refresh', { refreshToken });
      if (response.success && response.data) {
        const session = mapSession(response.data);
        setAuthToken(session.token);
        setRefreshToken(session.refreshToken);
        return { data: session };
      }
      return { error: response.message || 'Token refresh failed' };
    } catch (error) {
      clearAuthTokens();
      return { error: getErrorMessage(error, 'Network error during token refresh') };
    }
  },

  async me(): Promise<{ data?: { user: User; profile: Profile }; error?: string }> {
    try {
      const response = await api.get<ApiResponse<BackendUser>>('/auth/me');
      if (response.success && response.data) {
        return { data: { user: mapUser(response.data), profile: mapProfile(response.data) } };
      }
      return { error: response.message || 'Failed to fetch user data' };
    } catch (error) {
      return { error: getErrorMessage(error, 'Network error fetching user data') };
    }
  },
};
