import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { InternalShell } from './InternalShell';
import { navigationForRole } from './internal-navigation';

describe('InternalShell', () => {
  it('renders supported operations navigation and marks the current route active', () => {
    render(
      <MemoryRouter initialEntries={['/admin/filas']}>
        <InternalShell
          title="Operação de filas"
          subtitle="Atendimento presencial"
          role="funcionario"
          navigation={navigationForRole('funcionario')}
          userName="Ana Operadora"
          userEmail="ana@boane.gov.mz"
          onLogout={vi.fn()}
        >
          <p>Conteúdo da fila</p>
        </InternalShell>
      </MemoryRouter>,
    );

    const desktopNavigation = screen.getAllByRole('navigation', { name: 'Navegação de operações' })[0];
    expect(within(desktopNavigation).getByRole('link', { name: 'Início interno' })).not.toHaveAttribute('aria-current');
    expect(within(desktopNavigation).getByRole('link', { name: 'Filas' })).toHaveAttribute('aria-current', 'page');
    expect(within(desktopNavigation).getByRole('link', { name: 'Agenda' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Saltar para o conteúdo principal' })).toHaveAttribute('href', '#main-content');
    expect(screen.getByRole('heading', { name: 'Operação de filas', level: 1 })).toBeInTheDocument();
  });

  it('opens an accessible navigation drawer on compact viewports', () => {
    render(
      <MemoryRouter initialEntries={['/admin/agenda']}>
        <InternalShell
          title="Agenda"
          role="gestor"
          navigation={navigationForRole('gestor')}
          userName="Gestor Municipal"
          onLogout={vi.fn()}
        >
          <p>Agenda</p>
        </InternalShell>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Abrir navegação' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Navegação de operações' })).toBeInTheDocument();
  });

  it('does not present unsupported operational navigation to an editor', () => {
    expect(navigationForRole('editor').map((item) => item.href)).toEqual(['/admin']);
    expect(navigationForRole(null)).toEqual([]);
  });

  it('presents Services to Super Admin', () => {
    expect(navigationForRole('super_admin').map((item) => item.href)).toContain('/admin/servicos');
  });

  it('presents Services to Admin', () => {
    expect(navigationForRole('admin').map((item) => item.href)).toContain('/admin/servicos');
  });

  it('presents Services to Gestor', () => {
    expect(navigationForRole('gestor').map((item) => item.href)).toContain('/admin/servicos');
  });

  it('does not present Services to Funcionario, Editor or Munícipe', () => {
    for (const role of ['funcionario', 'editor', 'municipe'] as const) {
      expect(navigationForRole(role).map((item) => item.href)).not.toContain('/admin/servicos');
    }
  });

  it('marks Services as current without marking the internal landing', () => {
    render(
      <MemoryRouter initialEntries={['/admin/servicos']}>
        <InternalShell
          title="Serviços municipais"
          role="gestor"
          navigation={navigationForRole('gestor')}
          userName="Gestor Municipal"
          onLogout={vi.fn()}
        >
          <p>Catálogo</p>
        </InternalShell>
      </MemoryRouter>,
    );

    const desktopNavigation = screen.getAllByRole('navigation', { name: 'Navegação de operações' })[0];
    expect(within(desktopNavigation).getByRole('link', { name: 'Serviços' })).toHaveAttribute('aria-current', 'page');
    expect(within(desktopNavigation).getByRole('link', { name: 'Início interno' })).not.toHaveAttribute('aria-current');
  });

  it('groups the real Services destination under Conteúdo', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <InternalShell
          title="Área interna"
          role="admin"
          navigation={navigationForRole('admin')}
          userName="Administrador"
          onLogout={vi.fn()}
        >
          <p>Início</p>
        </InternalShell>
      </MemoryRouter>,
    );

    expect(screen.getAllByText('Conteúdo').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Serviços' }).length).toBeGreaterThan(0);
  });
});
