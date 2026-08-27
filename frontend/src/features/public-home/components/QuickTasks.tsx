import { ArrowRight, CalendarDays, ClipboardList, FilePlus2, MessageSquareWarning } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Container } from '@/design-system/primitives/layout';

const tasks = [
  { label: 'Solicitar serviço', detail: 'Consulte os serviços disponíveis', href: '/servicos', icon: FilePlus2 },
  { label: 'Consultar pedido', detail: 'Acompanhe um pedido existente', href: '/servicos/pedidos', icon: ClipboardList },
  { label: 'Agendar atendimento', detail: 'Entre para gerir agendamentos', href: '/municipe/agendamentos', icon: CalendarDays },
  { label: 'Reportar problema', detail: 'Envie uma reclamação ou ocorrência', href: '/reclamacoes', icon: MessageSquareWarning },
];

export function QuickTasks() {
  return (
    <section aria-labelledby="quick-tasks-title" className="border-b border-border bg-surface">
      <Container className="py-6 tb:py-8">
        <h2 id="quick-tasks-title" className="sr-only">Ações rápidas</h2>
        <ul className="grid divide-y divide-border tb:grid-cols-2 tb:gap-x-8 tb:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {tasks.map(({ label, detail, href, icon: Icon }, index) => (
            <li key={href} className={index > 1 ? 'tb:border-t tb:border-border lg:border-t-0' : undefined}>
              <Link to={href} className="group flex min-h-20 items-center gap-3 py-4 lg:px-5 lg:first:pl-0">
                <Icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-foreground group-hover:text-primary">{label}</span>
                  <span className="mt-0.5 block text-sm leading-5 text-muted-foreground">{detail}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
