import { ArrowUpRight, BarChart3, FileText, FolderOpen, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Container, Section } from '@/design-system/primitives/layout';
import { HomeSectionHeading } from './HomeSectionHeading';

const transparencyLinks = [
  { label: 'Planos e estratégias', href: '/plano-desenvolvimento', icon: Landmark },
  { label: 'Documentos públicos', href: '/documentos', icon: FileText },
  { label: 'Projectos', href: '/projetos', icon: BarChart3 },
  { label: 'Concursos públicos', href: '/concursos', icon: FolderOpen },
];

export function TransparencyLinks() {
  return (
    <Section aria-labelledby="transparency-title" className="bg-surface-subtle">
      <Container>
        <HomeSectionHeading
          eyebrow="Transparência"
          title="Informação pública organizada"
          description="Consulte as áreas públicas disponibilizadas para acompanhamento da actividade municipal."
        />
        <nav aria-label="Áreas de transparência">
          <ul className="grid border-y border-border tb:grid-cols-2">
            {transparencyLinks.map(({ label, href, icon: Icon }, index) => (
              <li key={href} className={index > 0 ? 'border-t border-border tb:[&:nth-child(2)]:border-t-0 tb:[&:nth-child(even)]:border-l' : undefined}>
                <Link to={href} className="group flex min-h-16 items-center gap-3 bg-surface px-4 py-4 hover:bg-primary-subtle">
                  <Icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="flex-1 font-bold">{label}</span>
                  <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </Section>
  );
}
