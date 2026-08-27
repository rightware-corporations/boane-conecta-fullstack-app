import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { PublicHeader } from '@/shells/public/PublicHeader';

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ user: null }),
}));

describe('PublicHeader', () => {
  it('renders the frozen public information architecture without an admin entry', () => {
    render(
      <MemoryRouter initialEntries={['/servicos']}>
        <PublicHeader />
      </MemoryRouter>,
    );

    const navigation = screen.getByRole('navigation', { name: 'Navegação pública principal' });
    expect(navigation).toHaveTextContent('Serviços');
    expect(navigation).toHaveTextContent('Município');
    expect(navigation).toHaveTextContent('Viver em Boane');
    expect(navigation).toHaveTextContent('Desenvolvimento');
    expect(navigation).toHaveTextContent('Transparência');
    expect(navigation).toHaveTextContent('Notícias');
    expect(screen.queryByText('Área Administrativa')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir menu principal' })).toBeInTheDocument();
  });

  it('marks the current public section', () => {
    render(
      <MemoryRouter initialEntries={['/noticias/123']}>
        <PublicHeader />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Notícias' })).toHaveAttribute('aria-current', 'page');
  });

  it('closes the mobile menu with Escape and returns focus to its trigger', async () => {
    render(
      <MemoryRouter>
        <PublicHeader />
      </MemoryRouter>,
    );

    const trigger = screen.getByRole('button', { name: 'Abrir menu principal' });
    fireEvent.click(trigger);
    expect(screen.getByRole('navigation', { name: 'Menu público' })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('navigation', { name: 'Menu público' })).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });
});
