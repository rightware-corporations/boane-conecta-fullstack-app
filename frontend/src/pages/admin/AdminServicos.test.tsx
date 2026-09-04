import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getAdminServices } from '@/features/admin-services/admin-services.api';

import AdminServicos from './AdminServicos';

vi.mock('@/features/admin-services/admin-services.api', () => ({ getAdminServices: vi.fn() }));
vi.mock('@/components/admin/AdminLayout', () => ({
  AdminLayout: ({ children, title, subtitle, shell }: { children: React.ReactNode; title: string; subtitle?: string; shell?: string }) => (
    <main data-shell={shell}><h1>{title}</h1><p>{subtitle}</p>{children}</main>
  ),
}));

const service = {
  id: 'service-1', departmentName: 'Urbanização', title: 'Licença de construção', slug: 'licenca-construcao',
  description: 'Pedido de licença para obras.', processingTime: '15 dias úteis', status: 'PUBLISHED' as const,
  statusLabel: 'Publicado', updatedAt: '2026-08-02T10:00:00Z',
  requirements: [{ id: 'requirement-1', title: 'Planta', description: 'Planta aprovada', required: true }],
  fees: [{ id: 'fee-1', title: 'Taxa administrativa', amount: 1250, currency: 'MZN' }],
};

describe('AdminServicos', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders loading before the request resolves', () => {
    vi.mocked(getAdminServices).mockReturnValue(new Promise(() => undefined));
    render(<AdminServicos />);
    expect(screen.getByRole('status', { name: 'A carregar serviços municipais…' })).toBeInTheDocument();
  });

  it('renders real service fields through the operational shell', async () => {
    vi.mocked(getAdminServices).mockResolvedValue([service]);
    render(<AdminServicos />);
    expect(await screen.findByRole('heading', { name: 'Licença de construção' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('data-shell', 'operations');
    expect(screen.getByText('15 dias úteis')).toBeInTheDocument();
    expect(screen.getByText('Planta')).toBeInTheDocument();
    expect(screen.getByText('Taxa administrativa')).toBeInTheDocument();
  });

  it('omits optional content that is not present', async () => {
    vi.mocked(getAdminServices).mockResolvedValue([{ ...service, departmentName: null, description: null, processingTime: null }]);
    render(<AdminServicos />);
    await screen.findByText('Departamento não informado');
    expect(screen.queryByText('Pedido de licença para obras.')).not.toBeInTheDocument();
    expect(screen.queryByText('Prazo de processamento')).not.toBeInTheDocument();
  });

  it('renders the real empty state', async () => {
    vi.mocked(getAdminServices).mockResolvedValue([]);
    render(<AdminServicos />);
    expect(await screen.findByRole('heading', { name: 'Nenhum serviço registado' })).toBeInTheDocument();
  });

  it('renders an error state and retries', async () => {
    vi.mocked(getAdminServices).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce([service]);
    render(<AdminServicos />);
    fireEvent.click(await screen.findByRole('button', { name: 'Tentar novamente' }));
    await waitFor(() => expect(getAdminServices).toHaveBeenCalledTimes(2));
    expect(await screen.findByText('Licença de construção')).toBeInTheDocument();
  });

  it('does not expose unsupported management controls to a read-only Gestor', async () => {
    vi.mocked(getAdminServices).mockResolvedValue([service]);
    render(<AdminServicos />);
    await screen.findByText('Licença de construção');
    expect(screen.queryByRole('button', { name: /criar|editar|publicar|arquivar|eliminar/i })).not.toBeInTheDocument();
  });
});
