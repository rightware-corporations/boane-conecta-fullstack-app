import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { AuthContext } from '@/hooks/auth-context';
import type { AuthContextType } from '@/types';

import { AdminLayout } from './AdminLayout';

const auth: AuthContextType = {
  user: { id: 'staff-1', email: 'staff@boane.gov.mz', fullName: 'Maria Staff' },
  profile: {
    id: 'staff-1', user_id: 'staff-1', full_name: 'Maria Staff', role: 'funcionario', phone: null,
    avatar_url: null, nuit: null, bi: null, address: null, district: null, neighborhood: null,
    verified: true, created_at: '', updated_at: '',
  },
  role: 'funcionario',
  permissions: [],
  isAuthenticated: true,
  isLoading: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  refreshProfile: vi.fn(),
};

describe('AdminLayout compatibility adapter', () => {
  it('uses InternalShell only when an operational route opts in', () => {
    render(
      <MemoryRouter initialEntries={['/admin/filas']}>
        <AuthContext.Provider value={auth}>
          <AdminLayout title="Operação de filas" shell="operations"><p>Fila integrada</p></AdminLayout>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('navigation', { name: 'Navegação de operações' })).toBeInTheDocument();
    expect(screen.getByText('Fila integrada')).toBeInTheDocument();
    expect(screen.queryByText('Portal Admin')).not.toBeInTheDocument();
  });
});
