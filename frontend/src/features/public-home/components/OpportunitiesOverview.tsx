import { ArrowRight, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useOpportunities } from '@/features/public-home/api/public-home.queries';
import { formatPublicDate } from '@/features/public-home/lib/format-public-data';
import { HomeSectionError, HomeSectionLoading } from './HomeSectionState';

export function OpportunitiesOverview() {
  const query = useOpportunities();

  if (query.data && query.data.length === 0) return null;

  return (
    <section aria-labelledby="opportunities-title" className="bg-primary-subtle px-5 py-6 tb:px-6 lg:px-8 lg:py-8">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Oportunidades</p>
      <div className="mt-2 flex items-end justify-between gap-4">
        <h2 id="opportunities-title" className="text-2xl font-bold">Concursos e oportunidades</h2>
        <Link to="/concursos" aria-label="Ver todos os concursos e oportunidades" className="hidden min-h-11 items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline xsm:inline-flex">
          Ver todos <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-6">
        {query.isPending && <HomeSectionLoading label="A carregar oportunidades" />}
        {query.isError && <HomeSectionError message="Não foi possível carregar as oportunidades neste momento." retry={() => query.refetch()} />}
        {query.data && query.data.length > 0 && (
          <ul className="divide-y divide-primary/20 border-y border-primary/20">
            {query.data.map((item) => {
              const deadline = formatPublicDate(item.deadline);
              return (
                <li key={item.id} className="py-4">
                  <Link to="/concursos" className="group block">
                    <h3 className="font-bold leading-6 group-hover:text-primary">{item.title}</h3>
                    {deadline && (
                      <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="size-4" aria-hidden="true" />
                        Prazo: {deadline}
                      </p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
