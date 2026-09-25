import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ApiError } from '@/lib/api';

import RequestStartPage from './RequestStartPage';
import RequestDraftsPage from './RequestDraftsPage';
import RequestDraftResolverPage from './RequestDraftResolverPage';
import { requestJourneyApi } from './request-journey.api';

vi.mock('./RequestJourneyShell', () => ({ RequestJourneyShell: ({ title, children }: { title: string; children: React.ReactNode }) => <main><h1>{title}</h1>{children}</main> }));
vi.mock('./request-journey.api', () => ({ requestJourneyApi: { definition: vi.fn(), createOrResume: vi.fn(), list: vi.fn(), detail: vi.fn() } }));

const serviceId = '11111111-1111-4111-8111-111111111111';
const draftId = '22222222-2222-4222-8222-222222222222';
const definition = { serviceId, serviceVersionId: serviceId, formVersionId: draftId, serviceTitle: 'Serviço publicado de QA', serviceDescription: null, status: 'PUBLISHED', onlineSubmissionEnabled: true };
const draft = { id: draftId, serviceId, serviceVersionId: serviceId, formVersionId: draftId, status: 'IN_PROGRESS', expiresAt: '2099-01-01T00:00:00Z', updatedAt: '2026-09-20T10:00:00Z', lastSavedAt: '2026-09-20T10:00:00Z' };

function startAt(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><Routes>
    <Route path="/municipe/pedidos/iniciar/:serviceId" element={<RequestStartPage />} />
    <Route path="/municipe/pedidos/rascunhos" element={<RequestDraftsPage />} />
    <Route path="/municipe/pedidos/rascunhos/:draftId" element={<RequestDraftResolverPage />} />
    <Route path="/servicos" element={<p>Catálogo</p>} />
  </Routes></MemoryRouter>);
}

beforeEach(() => { vi.clearAllMocks(); vi.mocked(requestJourneyApi.definition).mockResolvedValue(definition as never); vi.mocked(requestJourneyApi.list).mockResolvedValue([]); });

describe('FE-03a S01 and S08', () => {
  it('checks publication and shows a single safe action, then navigates on confirmed 201', async () => {
    vi.mocked(requestJourneyApi.createOrResume).mockResolvedValue({ draft, etag: '"4"' } as never);
    vi.mocked(requestJourneyApi.detail).mockResolvedValue({ draft, etag: '"4"' } as never);
    startAt(`/municipe/pedidos/iniciar/${serviceId}`);
    fireEvent.click(await screen.findByRole('button', { name: 'Iniciar ou retomar rascunho' }));
    expect(await screen.findByText('Rascunho disponível')).toBeInTheDocument();
    expect(requestJourneyApi.createOrResume).toHaveBeenCalledOnce();
  });
  it('never POSTs for an invalid service UUID or an unpublished definition', async () => {
    startAt('/municipe/pedidos/iniciar/invalid');
    expect(await screen.findByText('Endereço de serviço inválido.')).toBeInTheDocument();
    expect(requestJourneyApi.definition).not.toHaveBeenCalled();
    expect(requestJourneyApi.createOrResume).not.toHaveBeenCalled();
  });
  it('recovers a timeout by reading own drafts, without a second POST', async () => {
    vi.mocked(requestJourneyApi.createOrResume).mockRejectedValue(new TypeError('Disconnected'));
    vi.mocked(requestJourneyApi.list).mockResolvedValue([draft] as never);
    startAt(`/municipe/pedidos/iniciar/${serviceId}`);
    fireEvent.click(await screen.findByRole('button', { name: 'Iniciar ou retomar rascunho' }));
    expect(await screen.findByText('Resultado ainda por confirmar')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Consultar rascunho guardado' })).toHaveAttribute('href', `/municipe/pedidos/rascunhos/${draftId}`);
    expect(requestJourneyApi.createOrResume).toHaveBeenCalledOnce();
    expect(requestJourneyApi.list).toHaveBeenCalledOnce();
  });
  it('handles a 401 after POST as an uncertain result without a second mutation', async () => {
    vi.mocked(requestJourneyApi.createOrResume).mockRejectedValue(new ApiError(401, 'Unauthorized'));
    startAt(`/municipe/pedidos/iniciar/${serviceId}`);
    fireEvent.click(await screen.findByRole('button', { name: 'Iniciar ou retomar rascunho' }));
    expect(await screen.findByText('Resultado ainda por confirmar')).toBeInTheDocument();
    expect(requestJourneyApi.list).toHaveBeenCalledOnce();
    expect(requestJourneyApi.createOrResume).toHaveBeenCalledOnce();
  });
  it('shows unavailable on a conclusive 404 instead of claiming creation', async () => {
    vi.mocked(requestJourneyApi.createOrResume).mockRejectedValue(new ApiError(404, 'Not Found'));
    startAt(`/municipe/pedidos/iniciar/${serviceId}`);
    fireEvent.click(await screen.findByRole('button', { name: 'Iniciar ou retomar rascunho' }));
    expect(await screen.findByText('A submissão digital deste serviço não está disponível.')).toBeInTheDocument();
    expect(requestJourneyApi.createOrResume).toHaveBeenCalledOnce();
  });
  it('shows an honest empty state from the resumable list', async () => {
    startAt('/municipe/pedidos/rascunhos');
    expect(await screen.findByText('Não existem rascunhos disponíveis para retoma.')).toBeInTheDocument();
  });
  it('renders a list with server ordering and links to draft IDs', async () => {
    const other = { ...draft, id: '33333333-3333-4333-8333-333333333333' };
    vi.mocked(requestJourneyApi.list).mockResolvedValue([draft, other] as never);
    startAt('/municipe/pedidos/rascunhos');
    expect((await screen.findAllByRole('link', { name: 'Consultar rascunho' })).map(link => link.getAttribute('href'))).toEqual([
      `/municipe/pedidos/rascunhos/${draftId}`, `/municipe/pedidos/rascunhos/${other.id}`,
    ]);
  });
  it('does not render answers or a new schema for an old pinned draft', async () => {
    vi.mocked(requestJourneyApi.detail).mockResolvedValue({ draft, etag: '"4"' } as never);
    vi.mocked(requestJourneyApi.definition).mockResolvedValue({ ...definition, formVersionId: serviceId } as never);
    startAt(`/municipe/pedidos/rascunhos/${draftId}`);
    expect(await screen.findByText('Continuação indisponível')).toBeInTheDocument();
    expect(screen.queryByText('Continuação do pedido preparada', { exact: false })).not.toBeInTheDocument();
  });
  it('reports 404 generically without disclosing whether another citizen owns the ID', async () => {
    vi.mocked(requestJourneyApi.detail).mockRejectedValue({ status: 404 });
    startAt(`/municipe/pedidos/rascunhos/${draftId}`);
    expect(await screen.findByText('Este rascunho não está disponível ou não foi possível consultá-lo.')).toBeInTheDocument();
    expect(requestJourneyApi.definition).not.toHaveBeenCalled();
  });
  it('rejects invalid draft UUID before any API request', async () => {
    startAt('/municipe/pedidos/rascunhos/bad-id');
    expect(await screen.findByText('Endereço de rascunho inválido.')).toBeInTheDocument();
    await waitFor(() => expect(requestJourneyApi.detail).not.toHaveBeenCalled());
  });
});
