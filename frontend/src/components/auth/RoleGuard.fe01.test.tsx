import type { ReactNode } from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AuthContext } from '@/hooks/auth-context';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useUserRole } from '@/hooks/useUserRole';
import type { AuthContextType, UserRole } from '@/types';

function authForRole(role: UserRole): AuthContextType {
  return {
    user: { id: 'qa-user', email: 'qa@example.test', fullName: 'QA' },
    profile: {
      id: 'qa-user',
      user_id: 'qa-user',
      full_name: 'QA',
      role,
      phone: null,
      avatar_url: null,
      nuit: null,
      bi: null,
      address: null,
      district: null,
      neighborhood: null,
      verified: true,
      created_at: '',
      updated_at: '',
    },
    role,
    permissions: [],
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    refreshProfile: vi.fn(),
  };
}

function provider(role: UserRole) {
  return function Provider({ children }: { children: ReactNode }) {
    return <AuthContext.Provider value={authForRole(role)}>{children}</AuthContext.Provider>;
  };
}

describe('FE-01 access and default landing', () => {
  it.each(['super_admin', 'admin', 'editor', 'funcionario', 'gestor'] as UserRole[])(
    'sends internal role %s to the implemented internal landing',
    (role) => {
      const { result } = renderHook(() => useUserRole(), { wrapper: provider(role) });
      expect(result.current.getDefaultRedirect()).toBe('/admin');
    },
  );

  it('sends citizens to the citizen home', () => {
    const { result } = renderHook(() => useUserRole(), { wrapper: provider('municipe') });
    expect(result.current.getDefaultRedirect()).toBe('/municipe');
  });

  it.each(['super_admin', 'admin', 'editor', 'funcionario', 'gestor'] as UserRole[])(
    'does not render citizen-only content to %s',
    (role) => {
      render(<RoleGuard allowedRoles={['municipe']}><p>Dados pessoais</p></RoleGuard>, { wrapper: provider(role) });
      expect(screen.queryByText('Dados pessoais')).not.toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Acesso Negado' })).toBeInTheDocument();
    },
  );

  it('renders citizen-only content for a citizen', () => {
    render(<RoleGuard allowedRoles={['municipe']}><p>Dados pessoais</p></RoleGuard>, { wrapper: provider('municipe') });
    expect(screen.getByText('Dados pessoais')).toBeInTheDocument();
  });
});
