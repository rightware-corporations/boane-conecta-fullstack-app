import { ArrowRight, Building2, CalendarClock } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Container, Section } from '@/design-system/primitives/layout';
import { useFeaturedServices } from '@/features/public-home/api/public-home.queries';
import { HomeSectionHeading } from './HomeSectionHeading';
import { HomeSectionError, HomeSectionLoading } from './HomeSectionState';

export function FeaturedServices() {
  const query = useFeaturedServices();

  return (
    <Section aria-labelledby="featured-services-title" className="bg-surface">
      <Container>
        <HomeSectionHeading
          eyebrow="Serviços"
          title="Serviços em destaque"
          description="Comece pelo serviço de que precisa e consulte os requisitos antes de avançar."
          link={{ label: 'Ver todos os serviços', href: '/servicos' }}
        />

        {query.isPending && <HomeSectionLoading label="A carregar serviços em destaque" />}
        {query.isError && (
          <HomeSectionError message="Não foi possível carregar os serviços neste momento." retry={() => query.refetch()} />
        )}
        {query.data && query.data.length === 0 && (
          <p className="text-sm text-muted-foreground">Ainda não existem serviços públicos disponíveis para apresentar.</p>
        )}
        {query.data && query.data.length > 0 && (
          <ul className="grid border-y border-border tb:grid-cols-2 lg:grid-cols-3">
            {query.data.map((service, index) => (
              <li
                key={service.id}
                className={
                  index > 0
                    ? 'border-t border-border tb:[&:nth-child(2)]:border-t-0 tb:[&:nth-child(even)]:border-l lg:[&:nth-child(3)]:border-t-0 lg:[&:nth-child(3n)]:border-l'
                    : undefined
                }
              >
                <Link to="/servicos" className="group flex h-full min-h-36 flex-col px-1 py-5 tb:px-5 lg:py-6">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-primary">
                    <Building2 className="size-4" aria-hidden="true" />
                    {service.category}
                  </div>
                  <h3 className="mt-3 text-lg font-bold leading-6 group-hover:text-primary">{service.name}</h3>
                  {service.description && <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{service.description}</p>}
                  <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                    {service.duration ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarClock className="size-4" aria-hidden="true" />
                        {service.duration}
                      </span>
                    ) : <span />}
                    <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
