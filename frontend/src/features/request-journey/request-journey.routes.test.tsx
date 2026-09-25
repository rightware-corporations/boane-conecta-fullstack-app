import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { AppRoutes } from '@/App';
import { AuthContext } from '@/hooks/auth-context';
import type { AuthContextType, UserRole } from '@/types';

vi.mock('@/features/request-journey/RequestStartPage', () => ({ default: () => <h2>Rota S01</h2> }));
vi.mock('@/features/request-journey/RequestDraftsPage', () => ({ default: () => <h2>Rota S08</h2> }));
vi.mock('@/features/request-journey/RequestDraftResolverPage', () => ({ default: () => <h2>Resolvedor de rascunho</h2> }));
vi.mock('@/features/request-journey/RequestEligibilityPage', () => ({ default: () => <h2>Rota S02</h2> }));
vi.mock('@/features/request-journey/RequestFormPage', () => ({ default: () => <h2>Rota S03</h2> }));
vi.mock('@/features/request-journey/RequestSubmitPage', () => ({ default: () => <h2>Rota S06</h2> }));
vi.mock('@/features/request-journey/RequestConfirmationPage', () => ({ default: () => <h2>Rota S07</h2> }));
vi.mock('@/pages/citizen/CitizenPedidoDetalhe', () => ({ default: () => <h2>Detalhe submetido</h2> }));
vi.mock('@/pages/Auth', () => ({ default: () => <h2>Login FE03a</h2> }));

const serviceId = '11111111-1111-4111-8111-111111111111';
const draftId = '22222222-2222-4222-8222-222222222222';

function route(path: string, role: UserRole | null) {
  const auth: AuthContextType = {
    user: role ? { id: 'qa', email: 'qa@example.test' } : null,
    profile: null, role, permissions: [], isAuthenticated: Boolean(role), isLoading: false,
    login: vi.fn(), register: vi.fn(), logout: vi.fn(), refreshProfile: vi.fn(),
  };
  return render(<AuthContext.Provider value={auth}><MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter></AuthContext.Provider>);
}

describe('FE-03a production route tree', () => {
  it.each([
    [`/municipe/pedidos/iniciar/${serviceId}`, 'Rota S01'],
    ['/municipe/pedidos/rascunhos', 'Rota S08'],
    [`/municipe/pedidos/rascunhos/${draftId}`, 'Resolvedor de rascunho'],
    [`/municipe/pedidos/rascunhos/${draftId}/elegibilidade`, 'Rota S02'],
    [`/municipe/pedidos/rascunhos/${draftId}/formulario`, 'Rota S03'],
    [`/municipe/pedidos/rascunhos/${draftId}/submissao`, 'Rota S06'],
    [`/municipe/pedidos/rascunhos/${draftId}/confirmacao`, 'Rota S07'],
    [`/municipe/pedidos/${draftId}`, 'Detalhe submetido'],
  ])('keeps %s mapped to %s for CITIZEN', async (path, title) => {
    route(path, 'municipe');
    expect(await screen.findByRole('heading', { name: title })).toBeInTheDocument();
  });
  it('redirects anonymous draft access to login', async () => {
    route(`/municipe/pedidos/rascunhos/${draftId}`, null);
    expect(await screen.findByRole('heading', { name: 'Login FE03a' })).toBeInTheDocument();
    expect(screen.queryByText('Resolvedor de rascunho')).not.toBeInTheDocument();
  });
  it.each(['super_admin', 'admin', 'editor', 'funcionario', 'gestor'] as UserRole[])(
    'denies %s access to citizen drafts', async role => {
      route('/municipe/pedidos/rascunhos', role);
      expect(await screen.findByRole('heading', { name: 'Acesso Negado' })).toBeInTheDocument();
    },
  );
});
