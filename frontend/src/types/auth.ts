export type UserRole = 'super_admin' | 'admin' | 'editor' | 'funcionario' | 'gestor' | 'municipe';

export interface User {
  id: string;
  email: string;
  fullName?: string | null;
  phone?: string | null;
  status?: string;
  emailVerified?: boolean;
  roles?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  role: UserRole;
  phone: string | null;
  avatar_url: string | null;
  nuit: string | null;
  bi: string | null;
  address: string | null;
  district: string | null;
  neighborhood: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  token: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
  profile: Profile;
  expires_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  nuit?: string;
  bi?: string;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ error: string | null }>;
  register: (data: RegisterData) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
