import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, ArrowLeft, Check, Clock3, CreditCard, FileText, MapPin, Monitor, UserRound } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/design-system/components/status';
import { Container, Section } from '@/design-system/primitives/layout';

import { serviceDetailQuery } from './api/service-catalog.queries';
import { audienceLabels, channelLabels, formatFee } from './lib/service-catalog';
import type { MunicipalService } from './types';

const availabilityTone = { available: 'success', suspended: 'warning', unavailable: 'danger' } as const;

export function ServiceDetailPage() {
  const { slug = '' } = useParams();
  const { data: service, isLoading, isError, refetch } = useQuery(serviceDetailQuery(slug));

  return (
    <Layout>
      {isLoading && <DetailSkeleton />}
      {isError && (
        <Section>
          <Container size="reading">
            <DetailError onRetry={() => refetch()} />
          </Container>
        </Section>
      )}
      {service && <ServiceDetail service={service} />}
    </Layout>
  );
}

function ServiceDetail({ service }: { service: MunicipalService }) {
  const showOnline = service.availability === 'available' && service.channels.includes('online');
  const showAppointment = service.availability === 'available' && service.channels.includes('in_person');

  return (
    <>
      <Section spacing="sm" className="border-b border-border bg-surface-subtle">
        <Container>
          <nav aria-label="Navegação estrutural" className="mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Início</Link>
            <span aria-hidden="true" className="px-2">/</span>
            <Link to="/servicos" className="hover:text-primary">Serviços</Link>
            <span aria-hidden="true" className="px-2">/</span>
            <span aria-current="page" className="text-foreground">{service.title}</span>
          </nav>
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">{service.category}</p>
              <StatusBadge tone={availabilityTone[service.availability]}>{service.availabilityLabel}</StatusBadge>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{service.title}</h1>
            {service.description && <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">{service.description}</p>}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:gap-14">
            <main className="min-w-0 space-y-10">
              <InformationSection title="Sobre este serviço">
                <p>{service.description || 'A descrição detalhada deste serviço ainda não foi publicada.'}</p>
              </InformationSection>

              <InformationSection title="Elegibilidade e requisitos">
                {service.requirements.length > 0 ? (
                  <ul className="divide-y divide-border border-y border-border">
                    {service.requirements.map((requirement) => (
                      <li key={requirement.id} className="flex gap-3 py-4">
                        <Check className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
                        <div>
                          <p className="font-medium text-foreground">{requirement.title}</p>
                          {requirement.description && <p className="mt-1 text-sm leading-6 text-muted-foreground">{requirement.description}</p>}
                          {!requirement.required && <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Opcional</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : <MissingInformation />}
              </InformationSection>

              <ListSection title="Documentos necessários" icon={FileText} items={service.documents} />
              <NumberedSection title="Como funciona" items={service.process} />
              <ListSection title="Locais de atendimento" icon={MapPin} items={service.locations} />
              {service.legalReferences.length > 0 && <ListSection title="Referências legais" icon={FileText} items={service.legalReferences} />}
              {service.faq.length > 0 && (
                <InformationSection title="Perguntas frequentes">
                  <dl className="divide-y divide-border border-y border-border">
                    {service.faq.map((item) => (
                      <div key={item.question} className="py-4">
                        <dt className="font-semibold text-foreground">{item.question}</dt>
                        <dd className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</dd>
                      </div>
                    ))}
                  </dl>
                </InformationSection>
              )}
            </main>

            <aside className="order-first lg:order-none" aria-label="Resumo do serviço">
              <div className="border-t-2 border-primary bg-surface-subtle p-5 lg:sticky lg:top-24 lg:p-6">
                <h2 className="text-lg font-semibold text-foreground">Resumo prático</h2>
                <dl className="mt-5 divide-y divide-border border-y border-border">
                  <SummaryItem label="Disponibilidade" value={service.availabilityLabel} />
                  <SummaryItem label="Taxa" value={formatFee(service)} icon={CreditCard} />
                  <SummaryItem label="Prazo" value={service.processingTime || 'Prazo não publicado'} icon={Clock3} />
                  <SummaryItem
                    label="Canal"
                    value={service.channels.length > 0 ? service.channels.map((channel) => channelLabels[channel]).join(' · ') : 'Canal não publicado'}
                    icon={service.channels.includes('online') ? Monitor : UserRound}
                  />
                  {service.audiences.length > 0 && (
                    <SummaryItem label="Público" value={service.audiences.map((audience) => audienceLabels[audience]).join(' · ')} />
                  )}
                </dl>

                {service.availability !== 'available' && (
                  <div className="mt-5 flex gap-3 border-l-4 border-warning bg-warning/10 p-4 text-sm leading-6 text-foreground">
                    <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                    Este serviço permanece visível para consulta, mas não pode ser iniciado neste momento.
                  </div>
                )}

                {(showOnline || showAppointment) && (
                  <div className="mt-5 grid gap-3">
                    {showOnline && (
                      <Button asChild>
                        <Link to={`/municipe/servicos/${service.slug}/iniciar`}>Iniciar pedido</Link>
                      </Button>
                    )}
                    {showAppointment && (
                      <Button variant={showOnline ? 'outline' : 'default'} asChild>
                        <Link to="/municipe/agendamentos">Marcar atendimento</Link>
                      </Button>
                    )}
                  </div>
                )}

                {!showOnline && !showAppointment && service.availability === 'available' && (
                  <p className="mt-5 text-sm leading-6 text-muted-foreground">
                    Os canais de atendimento ainda não foram publicados. Consulte esta página novamente antes de se deslocar.
                  </p>
                )}
              </div>
            </aside>
          </div>

          <div className="mt-12 border-t border-border pt-6">
            <Button variant="ghost" asChild className="px-0">
              <Link to="/servicos"><ArrowLeft className="size-4" /> Voltar aos serviços</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}

function InformationSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <h2 id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`} className="text-xl font-semibold text-foreground sm:text-2xl">{title}</h2>
      <div className="mt-4 text-base leading-7 text-muted-foreground">{children}</div>
    </section>
  );
}

function MissingInformation() {
  return <p className="border-l-2 border-border pl-4 text-sm leading-6 text-muted-foreground">Esta informação ainda não foi publicada pelo município.</p>;
}

function ListSection({ title, icon: Icon, items }: { title: string; icon: typeof FileText; items: string[] }) {
  return (
    <InformationSection title={title}>
      {items.length > 0 ? (
        <ul className="divide-y divide-border border-y border-border">
          {items.map((item) => (
            <li key={item} className="flex gap-3 py-4 text-foreground"><Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />{item}</li>
          ))}
        </ul>
      ) : <MissingInformation />}
    </InformationSection>
  );
}

function NumberedSection({ title, items }: { title: string; items: string[] }) {
  return (
    <InformationSection title={title}>
      {items.length > 0 ? (
        <ol className="divide-y divide-border border-y border-border">
          {items.map((item, index) => (
            <li key={item} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 py-4 text-foreground">
              <span className="font-semibold text-primary">{String(index + 1).padStart(2, '0')}</span>{item}
            </li>
          ))}
        </ol>
      ) : <MissingInformation />}
    </InformationSection>
  );
}

function SummaryItem({ label, value, icon: Icon }: { label: string; value: string; icon?: typeof Clock3 }) {
  return (
    <div className="py-4">
      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {Icon && <Icon className="size-4" aria-hidden="true" />}{label}
      </dt>
      <dd className="mt-1.5 text-sm font-medium leading-6 text-foreground">{value}</dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <Section>
      <Container>
        <div className="animate-pulse">
          <div className="h-4 w-52 rounded-sm bg-muted" />
          <div className="mt-8 h-10 w-3/4 rounded-sm bg-muted" />
          <div className="mt-4 h-5 w-full max-w-2xl rounded-sm bg-muted" />
          <div className="mt-12 grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="h-96 rounded-sm bg-muted" />
            <div className="h-80 rounded-sm bg-muted" />
          </div>
        </div>
      </Container>
    </Section>
  );
}

function DetailError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="py-16 text-center">
      <AlertTriangle className="mx-auto size-9 text-warning-foreground" aria-hidden="true" />
      <h1 className="mt-5 text-2xl font-semibold text-foreground">Serviço não disponível</h1>
      <p className="mt-3 text-muted-foreground">Não foi possível encontrar ou carregar este serviço.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={onRetry}>Tentar novamente</Button>
        <Button variant="outline" asChild><Link to="/servicos">Voltar ao catálogo</Link></Button>
      </div>
    </div>
  );
}
