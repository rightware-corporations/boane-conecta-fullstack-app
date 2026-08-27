import { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import { getAuthToken, getRefreshToken, clearAuthTokens } from '@/lib/api';
import { AuthContext } from '@/hooks/auth-context';
import type { UserRole, LoginCredentials, RegisterData, Profile, User } from '@/types';

const permissionsByRole: Record<UserRole, string[]> = {
  super_admin: ['*'],
  admin: ['admin.dashboard.view', 'admin.users.manage', 'admin.services.manage', 'admin.requests.manage', 'admin.reports.view'],
  editor: ['admin.dashboard.view', 'admin.news.manage', 'admin.announcements.manage'],
  funcionario: ['admin.dashboard.view', 'admin.services.manage', 'admin.requests.manage'],
  gestor: ['admin.dashboard.view', 'admin.projects.manage', 'admin.reports.view'],
  municipe: ['citizen.profile.view', 'citizen.profile.edit', 'citizen.requests.view', 'citizen.requests.create', 'citizen.payments.view', 'citizen.documents.view', 'citizen.documents.upload'],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const applySession = (nextUser: User, nextProfile: Profile) => {
    setUser(nextUser);
    setProfile(nextProfile);
    setRole(nextProfile.role);
    setPermissions(permissionsByRole[nextProfile.role] || []);
  };

  const clearSession = () => {
    setUser(null);
    setProfile(null);
    setRole(null);
    setPermissions([]);
  };

  const refreshProfile = async (): Promise<void> => {
    const result = await authService.me();
    if (result.data) applySession(result.data.user, result.data.profile);
    else {
      clearAuthTokens();
      clearSession();
    }
  };

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      try {
        if (!getAuthToken() && getRefreshToken()) await authService.refreshToken();
        if (getAuthToken()) {
          const result = await authService.me();
          if (active && result.data) applySession(result.data.user, result.data.profile);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    bootstrap();
    return () => { active = false; };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ error: string | null }> => {
    const result = await authService.login(credentials);
    if (result.error || !result.data) return { error: result.error || 'Login failed' };
    applySession(result.data.user, result.data.profile);
    return { error: null };
  };

  const register = async (data: RegisterData): Promise<{ error: string | null }> => {
    const result = await authService.register(data);
    return { error: result.error || null };
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, profile, role, permissions, isAuthenticated: !!user, isLoading: loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
