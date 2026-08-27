import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getMunicipalServices } from './api/service-catalog.api';
import { ServiceCatalogPage } from './ServiceCatalogPage';
import type { MunicipalService } from './types';

vi.mock('./api/service-catalog.api', () => ({
  getMunicipalServices: vi.fn(),
  getMunicipalService: vi.fn(),
}));

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ user: null }),
}));

const services: MunicipalService[] = [
  {
    id: '1', slug: 'licenca', title: 'Licença de Construção', description: 'Autoriza uma obra', category: 'Urbanismo',
    processingTime: '10 dias', availability: 'available', availabilityLabel: 'Disponível', channels: ['online'], audiences: ['citizen'],
    requirements: [], documents: [], process: [], locations: [], legalReferences: [], faq: [], fees: [], keywords: ['obra'],
  },
  {
    id: '2', slug: 'certidao', title: 'Certidão Municipal', description: 'Emissão de documento', category: 'Atendimento',
    processingTime: '5 dias', availability: 'available', availabilityLabel: 'Disponível', channels: [], audiences: [],
    requirements: [], documents: [], process: [], locations: [], legalReferences: [], faq: [], fees: [], keywords: [],
  },
];

function LocationProbe() {
  return <output data-testid="location">{useLocation().search}</output>;
}

function renderCatalog(initialEntry = '/servicos') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/servicos" element={<><ServiceCatalogPage /><LocationProbe /></>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('ServiceCatalogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getMunicipalServices).mockResolvedValue(services);
  });

  it('searches names, descriptions, categories, and synonyms through URL state', async () => {
    renderCatalog();
    expect(await screen.findByText('Licença de Construção')).toBeInTheDocument();
    const search = screen.getByRole('searchbox', { name: /Pesquisar por nome/ });
    fireEvent.change(search, { target: { value: 'obra' } });
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('search=obra'));
    expect(screen.getByText('Licença de Construção')).toBeInTheDocument();
    expect(screen.queryByText('Certidão Municipal')).not.toBeInTheDocument();
  });

  it('restores a search from the URL and links to the detail route', async () => {
    renderCatalog('/servicos?search=certidao');
    const link = await screen.findByRole('link', { name: 'Ver detalhes de Certidão Municipal' });
    expect(link).toHaveAttribute('href', '/servicos/certidao');
    expect(screen.queryByText('Licença de Construção')).not.toBeInTheDocument();
  });

  it('opens the mobile category sheet, stores the selection in the URL, and returns focus on Escape', async () => {
    renderCatalog();
    await screen.findByText('Licença de Construção');
    const trigger = screen.getByRole('button', { name: /Categorias/ });
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Urbanismo' }));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('category=Urbanismo'));
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });
});
