import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { getAuthToken, getRefreshToken, clearAuthTokens, AUTH_INVALIDATED_EVENT, AUTH_REFRESHED_EVENT } from '@/lib/api';
import { AuthContext } from '@/hooks/auth-context';
import type { UserRole, LoginCredentials, RegisterData, Profile, User } from '@/types';

const permissionsByRole: Record<UserRole, string[]> = {
  super_admin: ['*'],
  admin: ['admin.dashboard.view', 'admin.users.manage', 'admin.services.read', 'admin.services.manage', 'admin.requests.manage', 'admin.reports.view'],
  editor: ['admin.dashboard.view', 'admin.news.manage', 'admin.announcements.manage'],
  funcionario: ['admin.dashboard.view', 'admin.requests.manage'],
  gestor: ['admin.dashboard.view', 'admin.services.read', 'admin.projects.manage', 'admin.reports.view'],
  municipe: ['citizen.profile.view', 'citizen.profile.edit', 'citizen.requests.view', 'citizen.requests.create', 'citizen.payments.view', 'citizen.documents.view', 'citizen.documents.upload'],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const sessionEpoch = useRef(0);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((nextUser: User, nextProfile: Profile) => {
    setUser(nextUser);
    setProfile(nextProfile);
    setRole(nextProfile.role);
    setPermissions(permissionsByRole[nextProfile.role] || []);
  }, []);

  const clearSession = useCallback(() => {
    sessionEpoch.current += 1;
    queryClient.clear();
    setUser(null);
    setProfile(null);
    setRole(null);
    setPermissions([]);
  }, [queryClient]);

  const refreshProfile = useCallback(async (): Promise<void> => {
    const epoch = sessionEpoch.current;
    let result = await authService.me();
    if (result.unauthorized && getRefreshToken()) {
      const refreshed = await authService.refreshToken();
      if (refreshed.data) result = await authService.me();
    }
    if (epoch !== sessionEpoch.current) return;
    if (result.data && getAuthToken()) applySession(result.data.user, result.data.profile);
    else {
      clearAuthTokens();
      clearSession();
    }
  }, [applySession, clearSession]);

  useEffect(() => {
    let active = true;
    const invalidate = () => { if (active) clearSession(); };
    const refreshed = () => { if (active) void refreshProfile(); };
    window.addEventListener(AUTH_INVALIDATED_EVENT, invalidate);
    window.addEventListener(AUTH_REFRESHED_EVENT, refreshed);
    async function bootstrap() {
      const epoch = sessionEpoch.current;
      try {
        if (!getAuthToken() && getRefreshToken()) await authService.refreshToken();
        if (getAuthToken()) {
          let result = await authService.me();
          if (result.unauthorized && getRefreshToken()) {
            const refreshed = await authService.refreshToken();
            if (refreshed.data) result = await authService.me();
          }
          if (active && epoch === sessionEpoch.current && result.data && getAuthToken()) applySession(result.data.user, result.data.profile);
          else if (active && epoch === sessionEpoch.current) { clearAuthTokens(); clearSession(); }
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    bootstrap();
    return () => { active = false; window.removeEventListener(AUTH_INVALIDATED_EVENT, invalidate); window.removeEventListener(AUTH_REFRESHED_EVENT, refreshed); };
  }, [applySession, clearSession, refreshProfile]);

  const login = async (credentials: LoginCredentials): Promise<{ error: string | null; role?: UserRole }> => {
    const result = await authService.login(credentials);
    if (result.error || !result.data) return { error: result.error || 'Login failed' };
    queryClient.clear();
    sessionEpoch.current += 1;
    applySession(result.data.user, result.data.profile);
    return { error: null, role: result.data.profile.role };
  };

  const register = async (data: RegisterData): Promise<{ error: string | null }> => {
    const result = await authService.register(data);
    return { error: result.error || null };
  };

  const logout = async (): Promise<void> => {
    const revocation = authService.logout();
    clearSession();
    await revocation;
  };

  return (
    <AuthContext.Provider value={{ user, profile, role, permissions, isAuthenticated: !!user, isLoading: loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
