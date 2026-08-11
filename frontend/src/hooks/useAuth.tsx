import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { UserRole, AuthContextType, LoginCredentials, RegisterData, Profile } from '@/types';

// Simplified User type for our context
interface User {
  id: string;
  email: string;
  created_at: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const getPermissions = (userRole: UserRole | null): string[] => {
    if (!userRole) return [];
    const rolePermissions: Record<UserRole, string[]> = {
      super_admin: ['*'],
      admin: [
        'admin.dashboard.view', 'admin.users.manage', 'admin.services.manage',
        'admin.news.manage', 'admin.projects.manage', 'admin.requests.manage', 'admin.reports.view'
      ],
      editor: ['admin.dashboard.view', 'admin.news.manage', 'admin.announcements.manage'],
      funcionario: ['admin.dashboard.view', 'admin.services.manage', 'admin.requests.manage'],
      gestor: ['admin.dashboard.view', 'admin.projects.manage', 'admin.reports.view'],
      municipe: [
        'citizen.profile.view', 'citizen.profile.edit', 'citizen.requests.view',
        'citizen.requests.create', 'citizen.payments.view', 'citizen.documents.view', 'citizen.documents.upload'
      ]
    };
    return rolePermissions[userRole] || [];
  };

  const loadProfile = async (userId: string) => {
    // Load profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileData) {
      setProfile(profileData as unknown as Profile);
    }

    // Load role from user_roles table
    const { data: roleData } = await supabase.rpc('get_user_role', { _user_id: userId });
    
    const userRole = (roleData as UserRole) || (profileData?.role as UserRole) || 'municipe';
    setRole(userRole);
    setPermissions(getPermissions(userRole));
  };

  const mapSupabaseUser = (su: SupabaseUser): User => ({
    id: su.id,
    email: su.email || '',
    created_at: su.created_at,
  });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
        // Use setTimeout to avoid Supabase client deadlock
        setTimeout(() => loadProfile(session.user.id), 0);
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
        setPermissions([]);
      }
      setLoading(false);
    });

    // THEN check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const register = async (data: RegisterData): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setRole(null);
    setPermissions([]);
  };

  const refreshProfile = async (): Promise<void> => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user: user as any,
      profile,
      role,
      permissions,
      isAuthenticated,
      isLoading: loading,
      login,
      register,
      logout,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
