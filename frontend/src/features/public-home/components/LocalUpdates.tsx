import { ArrowRight, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Container, Section } from '@/design-system/primitives/layout';
import { useLocalUpdates } from '@/features/public-home/api/public-home.queries';
import { formatPublicDate } from '@/features/public-home/lib/format-public-data';
import { HomeSectionHeading } from './HomeSectionHeading';
import { HomeSectionError, HomeSectionLoading } from './HomeSectionState';

export function LocalUpdates() {
  const query = useLocalUpdates();

  if (query.data && query.data.length === 0) return null;

  return (
    <Section aria-labelledby="local-updates-title" className="bg-surface">
      <Container>
        <HomeSectionHeading
          eyebrow="Atualidade"
          title="Notícias e atualizações"
          description="Informação pública recentemente publicada no portal."
          link={{ label: 'Todas as notícias', href: '/noticias' }}
        />

        {query.isPending && <HomeSectionLoading label="A carregar notícias e atualizações" />}
        {query.isError && <HomeSectionError message="Não foi possível carregar as notícias neste momento." retry={() => query.refetch()} />}
        {query.data && query.data.length > 0 && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
            <article className="border-b border-border pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-primary">
                <Newspaper className="size-4" aria-hidden="true" />
                {query.data[0].category}
              </p>
              <h3 className="mt-4 text-2xl font-bold leading-tight tb:text-3xl">
                <Link to={`/noticias/${query.data[0].id}`} className="hover:text-primary">{query.data[0].title}</Link>
              </h3>
              {query.data[0].excerpt && <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{query.data[0].excerpt}</p>}
              <div className="mt-5 flex flex-wrap items-center gap-4">
                {formatPublicDate(query.data[0].published_at) && (
                  <time dateTime={query.data[0].published_at} className="text-sm text-muted-foreground">
                    {formatPublicDate(query.data[0].published_at)}
                  </time>
                )}
                <Link to={`/noticias/${query.data[0].id}`} className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline">
                  Ler notícia <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>

            {query.data.length > 1 && (
              <ol className="divide-y divide-border">
                {query.data.slice(1).map((item) => (
                  <li key={item.id} className="py-4 first:pt-0">
                    <article>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">{item.category}</p>
                      <h3 className="mt-2 text-base font-bold leading-6">
                        <Link to={`/noticias/${item.id}`} className="hover:text-primary">{item.title}</Link>
                      </h3>
                      {formatPublicDate(item.published_at) && (
                        <time dateTime={item.published_at} className="mt-2 block text-xs text-muted-foreground">
                          {formatPublicDate(item.published_at)}
                        </time>
                      )}
                    </article>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </Container>
    </Section>
  );
}
