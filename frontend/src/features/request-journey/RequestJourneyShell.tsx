import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { CitizenLayout } from '@/components/citizen/CitizenLayout';

export function RequestJourneyShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const { pathname } = useLocation();
  useEffect(() => { document.getElementById('main-content')?.focus(); }, [pathname]);

  return <CitizenLayout title={title} subtitle={subtitle} wrapTitle>
    <div className="mx-auto max-w-[720px] min-w-0">
      <nav aria-label="Navegação da jornada" className="mb-6 flex flex-wrap gap-x-3 gap-y-2 text-sm">
        <Link to="/servicos" className="text-primary underline-offset-4 hover:underline focus-visible:underline">Serviços</Link>
        <span aria-hidden="true">/</span>
        <Link to="/municipe/pedidos/rascunhos" className="text-primary underline-offset-4 hover:underline focus-visible:underline">Rascunhos</Link>
      </nav>
      {children}
    </div>
  </CitizenLayout>;
}
