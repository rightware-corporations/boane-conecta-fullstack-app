import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SearchX } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Container, Section } from '@/design-system/primitives/layout';
import { Layout } from '@/components/layout/Layout';

import { serviceCatalogQuery } from './api/service-catalog.queries';
import { DesktopServiceFilters, MobileServiceFilters } from './components/ServiceFilters';
import { ServiceRow } from './components/ServiceRow';
import { ALL_FILTER, filterServices } from './lib/service-catalog';
import type { ServiceCatalogFilters } from './types';

const filterKeys = ['category', 'channel', 'audience', 'availability'] as const;

export function ServiceCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: services = [], isLoading, isError, refetch } = useQuery(serviceCatalogQuery);
  const filters: ServiceCatalogFilters = useMemo(() => ({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || ALL_FILTER,
    channel: searchParams.get('channel') || ALL_FILTER,
    audience: searchParams.get('audience') || ALL_FILTER,
    availability: searchParams.get('availability') || ALL_FILTER,
  }), [searchParams]);
  const filteredServices = useMemo(() => filterServices(services, filters), [filters, services]);
  const activeFilterCount = filterKeys.filter((key) => filters[key] !== ALL_FILTER).length;

  function updateParam(key: keyof ServiceCatalogFilters, value: string) {
    const next = new URLSearchParams(searchParams);
    if (!value || value === ALL_FILTER) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  }

  function clearFilters() {
    const next = new URLSearchParams(searchParams);
    filterKeys.forEach((key) => next.delete(key));
    setSearchParams(next, { replace: true });
  }

  const filterProps = {
    services,
    filters,
    onChange: updateParam,
    onClear: clearFilters,
    activeCount: activeFilterCount,
  };

  return (
    <Layout>
      <Section spacing="sm" className="border-b border-border bg-surface-subtle">
        <Container>
          <nav aria-label="Navegação estrutural" className="mb-5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Início</Link>
            <span aria-hidden="true" className="px-2">/</span>
            <span aria-current="page" className="text-foreground">Serviços</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">Serviços municipais</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Como podemos ajudar?</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Pesquise um serviço e consulte requisitos, taxas e prazos antes de iniciar qualquer pedido.
            </p>
          </div>
          <div role="search" className="relative mt-7 block max-w-4xl" aria-label="Pesquisar serviços municipais">
            <label htmlFor="service-search" className="sr-only">Pesquisar por nome, descrição ou categoria</label>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="service-search"
              type="search"
              value={filters.search}
              onChange={(event) => updateParam('search', event.target.value)}
              placeholder="Ex.: licença, certidão, construção…"
              className="h-14 bg-background pl-12 text-base shadow-none"
            />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <MobileServiceFilters {...filterProps} />
          <div className="mt-7 grid gap-8 lg:mt-0 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
            <DesktopServiceFilters {...filterProps} />
            <div aria-live="polite" aria-busy={isLoading}>
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {isLoading ? 'A carregar serviços…' : `${filteredServices.length} ${filteredServices.length === 1 ? 'resultado' : 'resultados'}`}
                  </p>
                  {(filters.search || activeFilterCount > 0) && !isLoading && (
                    <p className="mt-1 text-sm text-muted-foreground">Resultados atualizados pelos filtros selecionados.</p>
                  )}
                </div>
                {(filters.search || activeFilterCount > 0) && (
                  <Button
                    variant="link"
                    className="h-auto min-h-11 px-0"
                    onClick={() => setSearchParams({}, { replace: true })}
                  >
                    Limpar pesquisa e filtros
                  </Button>
                )}
              </div>

              {isLoading && <CatalogSkeleton />}
              {isError && (
                <CatalogMessage
                  title="Não foi possível carregar os serviços"
                  description="Verifique a ligação e tente novamente. Nenhum dado foi substituído por conteúdo fictício."
                  action={<Button onClick={() => refetch()}>Tentar novamente</Button>}
                />
              )}
              {!isLoading && !isError && filteredServices.map((service) => (
                <ServiceRow key={service.id} service={service} />
              ))}
              {!isLoading && !isError && filteredServices.length === 0 && (
                <CatalogMessage
                  title="Nenhum serviço corresponde à pesquisa"
                  description="Tente usar menos palavras ou remover um dos filtros selecionados."
                  action={<Button variant="outline" onClick={() => setSearchParams({}, { replace: true })}>Limpar pesquisa</Button>}
                />
              )}
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
}

function CatalogSkeleton() {
  return (
    <div className="divide-y divide-border border-b border-border" aria-hidden="true">
      {[0, 1, 2].map((item) => (
        <div key={item} className="animate-pulse py-6">
          <div className="h-3 w-32 rounded-sm bg-muted" />
          <div className="mt-3 h-6 w-2/3 rounded-sm bg-muted" />
          <div className="mt-3 h-4 w-full max-w-xl rounded-sm bg-muted" />
          <div className="mt-4 h-4 w-52 rounded-sm bg-muted" />
        </div>
      ))}
    </div>
  );
}

function CatalogMessage({ title, description, action }: { title: string; description: string; action: React.ReactNode }) {
  return (
    <div className="flex min-h-72 flex-col items-start justify-center border-b border-border py-12">
      <SearchX className="size-8 text-muted-foreground" aria-hidden="true" />
      <h2 className="mt-4 text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{description}</p>
      <div className="mt-5">{action}</div>
    </div>
  );
}
