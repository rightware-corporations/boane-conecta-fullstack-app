import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthContext } from '@/hooks/auth-context';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { RoleGuard } from './RoleGuard';
import type { AuthContextType, UserRole } from '@/types';

function State() { const location = useLocation(); return <p>Destino: {location.pathname}</p>; }
function renderRoute(role: UserRole | null, start: string, loading = false) {
  const context: AuthContextType = {
    user: role ? { id: 'qa', email: 'qa@example.test' } : null,
    profile: null, role, permissions: [], isAuthenticated: !!role, isLoading: loading,
    login: vi.fn(), register: vi.fn(), logout: vi.fn(), refreshProfile: vi.fn(),
  };
  return render(<AuthContext.Provider value={context}>
    <MemoryRouter initialEntries={[start]}><Routes>
      <Route path="/auth" element={<PublicOnlyRoute><State /></PublicOnlyRoute>} />
      <Route path="/admin" element={<ProtectedRoute><RoleGuard allowedRoles={['super_admin', 'admin', 'editor', 'funcionario', 'gestor']}><State /></RoleGuard></ProtectedRoute>} />
      <Route path="/municipe/pedidos" element={<ProtectedRoute><RoleGuard allowedRoles={['municipe']}><State /></RoleGuard></ProtectedRoute>} />
    </Routes></MemoryRouter>
  </AuthContext.Provider>);
}

describe('FE-01 routed access', () => {
  it('sends anonymous protected access to login', () => {
    renderRoute(null, '/municipe/pedidos');
    expect(screen.getByText('Destino: /auth')).toBeInTheDocument();
  });
  it('shows neither staff nor citizen private data while bootstrapping', () => {
    renderRoute(null, '/municipe/pedidos', true);
    expect(screen.queryByText('Destino: /municipe/pedidos')).not.toBeInTheDocument();
    expect(screen.getByText('A carregar...')).toBeInTheDocument();
  });
  it.each(['super_admin', 'admin', 'editor', 'funcionario', 'gestor'] as UserRole[])(
    'denies citizen-private route to %s', role => {
      renderRoute(role, '/municipe/pedidos');
      expect(screen.getByText('Acesso Negado')).toBeInTheDocument();
    },
  );
  it('denies admin route to citizen', () => {
    renderRoute('municipe', '/admin');
    expect(screen.getByText('Acesso Negado')).toBeInTheDocument();
  });
  it('allows citizen on citizen route and staff on internal landing', () => {
    renderRoute('municipe', '/municipe/pedidos');
    expect(screen.getByText('Destino: /municipe/pedidos')).toBeInTheDocument();
  });
  it('redirects authenticated staff away from login', () => {
    renderRoute('funcionario', '/auth');
    expect(screen.getByText('Destino: /admin')).toBeInTheDocument();
  });
});
