import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { PublicHome } from '@/features/public-home/PublicHome';

const emptyQuery = {
  data: [],
  isPending: false,
  isError: false,
  refetch: vi.fn(),
};

vi.mock('@/features/public-home/api/public-home.queries', () => ({
  useActiveAlerts: () => emptyQuery,
  useFeaturedServices: () => emptyQuery,
  useOpportunities: () => emptyQuery,
  useLocalUpdates: () => emptyQuery,
  usePublicProjects: () => emptyQuery,
}));

describe('PublicHome', () => {
  it('keeps the canonical service-first section order when optional data is empty', () => {
    render(
      <MemoryRouter>
        <PublicHome />
      </MemoryRouter>,
    );

    const headings = screen.getAllByRole('heading').map((heading) => heading.textContent);
    expect(headings).toEqual([
      'Serviços municipais mais simples e próximos de si.',
      'Ações rápidas',
      'Serviços em destaque',
      'Informação local',
      'Informação pública organizada',
    ]);
    expect(screen.queryByRole('heading', { name: 'Contactos essenciais' })).not.toBeInTheDocument();
  });
});
