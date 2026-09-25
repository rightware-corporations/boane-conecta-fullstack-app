import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';

import { RequestJourneyShell } from './RequestJourneyShell';

vi.mock('@/components/citizen/CitizenLayout', () => ({ CitizenLayout: ({ children, title }: { children: React.ReactNode; title: string }) => <main id="main-content" tabIndex={-1}><h1>{title}</h1>{children}</main> }));

function ChangePage() {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/municipe/pedidos/rascunhos')}>Abrir rascunhos</button>;
}

describe('FE-03a journey focus', () => {
  it('focuses the main landmark after navigation', async () => {
    render(<MemoryRouter initialEntries={['/from']}><ChangePage /><Routes>
      <Route path="/municipe/pedidos/rascunhos" element={<RequestJourneyShell title="Meus rascunhos">Conteúdo</RequestJourneyShell>} />
    </Routes></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir rascunhos' }));
    await waitFor(() => expect(document.activeElement).toHaveAttribute('id', 'main-content'));
  });
});
