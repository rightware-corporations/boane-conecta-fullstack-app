import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { AuthContext } from '@/hooks/auth-context';
import type { AuthContextType, UserRole } from '@/types';

import Dashboard from './Dashboard';

function authForRole(role: UserRole): AuthContextType {
  return {
    user: { id: 'staff-1', email: 'staff@boane.gov.mz', fullName: 'Maria Staff' },
    profile: {
      id: 'staff-1',
      user_id: 'staff-1',
      full_name: 'Maria Staff',
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

function renderLanding(role: UserRole) {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <AuthContext.Provider value={authForRole(role)}>
        <Dashboard />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe('role-aware internal landing', () => {
  it('uses InternalShell and presents only approved operational destinations', () => {
    renderLanding('funcionario');

    const main = screen.getByRole('main');
    expect(screen.getByRole('heading', { name: 'Área interna', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Saltar para o conteúdo principal' })).toHaveAttribute('href', '#main-content');
    expect(within(main).getByRole('link', { name: /Filas/ })).toHaveAttribute('href', '/admin/filas');
    expect(within(main).getByRole('link', { name: /Agenda/ })).toHaveAttribute('href', '/admin/agenda');
    expect(within(main).queryByRole('link', { name: /Notícias|Serviços|Projectos|Utilizadores|Pedidos/ })).not.toBeInTheDocument();
    expect(within(main).queryByText(/Versão|Último acesso|Activo/)).not.toBeInTheDocument();
  });

  it('shows a conservative empty state when the role has no approved operations', () => {
    renderLanding('editor');

    const main = screen.getByRole('main');
    expect(within(main).getByRole('heading', { name: 'Sem operações disponíveis' })).toBeInTheDocument();
    expect(within(main).queryByRole('link', { name: /Filas|Agenda/ })).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Navegação de operações' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Início interno' })).toHaveAttribute('aria-current', 'page');
  });
});
