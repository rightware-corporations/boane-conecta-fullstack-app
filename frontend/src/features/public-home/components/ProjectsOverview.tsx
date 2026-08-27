import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Container, Section } from '@/design-system/primitives/layout';
import { usePublicProjects } from '@/features/public-home/api/public-home.queries';
import { HomeSectionHeading } from './HomeSectionHeading';
import { HomeSectionError, HomeSectionLoading } from './HomeSectionState';

export function ProjectsOverview() {
  const query = usePublicProjects();

  if (query.data && query.data.length === 0) return null;

  return (
    <Section aria-labelledby="projects-title">
      <Container>
        <HomeSectionHeading
          eyebrow="Desenvolvimento"
          title="Projectos municipais"
          description="Acompanhe os projectos disponibilizados publicamente pelo município."
          link={{ label: 'Ver todos os projectos', href: '/projetos' }}
        />

        {query.isPending && <HomeSectionLoading label="A carregar projectos municipais" />}
        {query.isError && <HomeSectionError message="Não foi possível carregar os projectos neste momento." retry={() => query.refetch()} />}
        {query.data && query.data.length > 0 && (
          <ol className="divide-y divide-border border-y border-border">
            {query.data.map((project, index) => (
              <li key={project.id}>
                <Link to="/projetos" className="group grid gap-3 py-5 tb:grid-cols-[3rem_minmax(0,1fr)_auto] tb:items-center lg:py-6">
                  <span className="text-sm font-bold tabular-nums text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="block text-lg font-bold group-hover:text-primary">{project.name}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span>{project.category}</span>
                      {project.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-4" aria-hidden="true" />
                          {project.location}
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="inline-flex min-h-11 items-center gap-2 self-start font-semibold text-primary tb:self-auto">
                    Consultar <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </Container>
    </Section>
  );
}
