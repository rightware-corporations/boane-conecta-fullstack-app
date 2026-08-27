import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { HomeSearch } from '@/features/public-home/components/HomeSearch';

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}{location.search}</output>;
}

describe('HomeSearch', () => {
  it('routes a normalized query to the existing services route', () => {
    render(
      <MemoryRouter>
        <HomeSearch />
        <LocationProbe />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Pesquisar serviço ou informação municipal'), {
      target: { value: '  licença comercial  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Pesquisar' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/servicos?search=licen%C3%A7a%20comercial');
  });

  it('routes an empty search to the existing services route', () => {
    render(
      <MemoryRouter>
        <HomeSearch />
        <LocationProbe />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Pesquisar' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/servicos');
  });
});
