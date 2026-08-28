import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CitizenShell } from './CitizenShell';

describe('CitizenShell', () => {
  it('exposes the canonical F4 mobile navigation and marks nested request routes active', () => {
    render(<MemoryRouter initialEntries={['/municipe/pedidos/123']}><CitizenShell sidebar={<aside>Desktop</aside>} header={<header>Conta</header>}><p>Pedido</p></CitizenShell></MemoryRouter>);
    const navigation = screen.getByRole('navigation', { name: 'Navegação da área do munícipe' });
    expect(within(navigation).getAllByRole('link').map(link => link.textContent)).toEqual(['Início', 'Pedidos', 'Serviços', 'Alertas', 'Conta']);
    expect(within(navigation).getByRole('link', { name: 'Pedidos' })).toHaveAttribute('aria-current', 'page');
    expect(within(navigation).queryByText('Pagamentos')).not.toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });
});
