import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getMunicipalService } from './api/service-catalog.api';
import { ServiceDetailPage } from './ServiceDetailPage';
import type { MunicipalService } from './types';

vi.mock('./api/service-catalog.api', () => ({
  getMunicipalServices: vi.fn(),
  getMunicipalService: vi.fn(),
}));

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ user: null }),
}));

const service: MunicipalService = {
  id: '1', slug: 'certidao', title: 'Certidão Municipal', description: 'Emissão de certidão', category: 'Atendimento',
  processingTime: '5 dias úteis', availability: 'available', availabilityLabel: 'Disponível', channels: [], audiences: [],
  requirements: [{ id: 'r1', title: 'Documento de identificação', description: null, required: true }],
  documents: [], process: [], locations: [], legalReferences: [], faq: [], fees: [], keywords: [],
};

function renderDetail() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/servicos/certidao']}>
        <Routes><Route path="/servicos/:slug" element={<ServiceDetailPage />} /></Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('ServiceDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getMunicipalService).mockResolvedValue(service);
  });

  it('places practical metadata before long content and does not invent transaction CTAs', async () => {
    renderDetail();
    expect(await screen.findByRole('heading', { level: 1, name: 'Certidão Municipal' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Resumo prático' })).toBeInTheDocument();
    expect(screen.getByText('Documento de identificação')).toBeInTheDocument();
    expect(screen.getAllByText('Esta informação ainda não foi publicada pelo município.').length).toBeGreaterThan(0);
    expect(screen.queryByRole('link', { name: 'Iniciar pedido' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Marcar atendimento' })).not.toBeInTheDocument();
  });

  it('shows the canonical CTAs only for explicitly published channels', async () => {
    vi.mocked(getMunicipalService).mockResolvedValue({ ...service, channels: ['online', 'in_person'] });
    renderDetail();
    expect(await screen.findByRole('link', { name: 'Iniciar pedido' })).toHaveAttribute('href', '/municipe/servicos/certidao/iniciar');
    expect(screen.getByRole('link', { name: 'Marcar atendimento' })).toHaveAttribute('href', '/municipe/agendamentos');
  });

  it('keeps a suspended service visible and removes transaction actions', async () => {
    vi.mocked(getMunicipalService).mockResolvedValue({
      ...service,
      availability: 'suspended',
      availabilityLabel: 'Temporariamente suspenso',
      channels: ['online', 'in_person'],
    });
    renderDetail();
    expect((await screen.findAllByText('Temporariamente suspenso')).length).toBeGreaterThan(0);
    expect(screen.getByText(/permanece visível para consulta/)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Iniciar pedido' })).not.toBeInTheDocument();
  });
});
