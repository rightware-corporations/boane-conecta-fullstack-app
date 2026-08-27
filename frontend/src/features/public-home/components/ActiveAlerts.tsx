import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Container, Section } from '@/design-system/primitives/layout';
import { useActiveAlerts } from '@/features/public-home/api/public-home.queries';
import { formatPublicDate } from '@/features/public-home/lib/format-public-data';
import { HomeSectionError, HomeSectionLoading } from './HomeSectionState';

export function ActiveAlerts() {
  const query = useActiveAlerts();

  if (query.isPending) {
    return (
      <Section spacing="sm" aria-labelledby="active-alerts-title">
        <Container>
          <h2 id="active-alerts-title" className="mb-4 text-lg font-bold">Avisos ativos</h2>
          <HomeSectionLoading label="A carregar avisos ativos" />
        </Container>
      </Section>
    );
  }

  if (query.isError) {
    return (
      <Section spacing="sm" aria-labelledby="active-alerts-title">
        <Container>
          <h2 id="active-alerts-title" className="mb-4 text-lg font-bold">Avisos ativos</h2>
          <HomeSectionError message="Não foi possível verificar os avisos municipais neste momento." retry={() => query.refetch()} />
        </Container>
      </Section>
    );
  }

  if (!query.data.length) return null;

  return (
    <Section spacing="sm" aria-labelledby="active-alerts-title">
      <Container>
        <div className="border-l-4 border-warning bg-warning/10 px-4 py-5 tb:px-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 shrink-0 text-warning" aria-hidden="true" />
            <h2 id="active-alerts-title" className="text-lg font-bold">Avisos ativos</h2>
          </div>
          <div className="mt-4 divide-y divide-warning/25">
            {query.data.map((alert) => {
              const date = formatPublicDate(alert.published_at);
              return (
                <article key={alert.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col gap-2 tb:flex-row tb:items-start tb:justify-between">
                    <div>
                      <h3 className="text-base font-bold">{alert.title}</h3>
                      {alert.description && <p className="mt-1 max-w-3xl text-sm leading-6 text-foreground/75">{alert.description}</p>}
                      {date && <p className="mt-2 text-xs font-medium text-muted-foreground">Publicado em {date}</p>}
                    </div>
                    <Link to="/avisos" className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start font-semibold text-primary underline-offset-4 hover:underline">
                      Ver aviso
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
