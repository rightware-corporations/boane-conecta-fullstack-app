import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowRight, Bell, CalendarDays, ClipboardList, FileText, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

import { CitizenLayout } from '@/components/citizen/CitizenLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { citizenService } from '@/services/citizen.service';
import type { CitizenDashboard as DashboardData } from '@/types';

export default function CitizenDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const result = await citizenService.getDashboard();
    setDashboard(result.data ?? null);
    setError(result.error ?? null);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  return (
    <CitizenLayout title="Início" subtitle="O que precisa da sua atenção">
      {loading && <DashboardSkeleton />}
      {!loading && error && !dashboard && <LoadError message={error} retry={load} />}
      {!loading && dashboard && <DashboardContent dashboard={dashboard} />}
    </CitizenLayout>
  );
}

function DashboardContent({ dashboard }: { dashboard: DashboardData }) {
  const greeting = new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';
  return (
    <div className="space-y-8">
      <section aria-labelledby="citizen-greeting">
        <p className="text-sm font-medium text-primary">{greeting}</p>
        <h2 id="citizen-greeting" className="mt-1 text-2xl font-semibold tracking-tight text-foreground tb:text-3xl">
          {dashboard.profile.full_name}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Consulte primeiro as ações necessárias e depois acompanhe os seus pedidos em curso.
        </p>
      </section>

      <section aria-labelledby="actions-title">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Prioridade</p>
            <h2 id="actions-title" className="mt-1 text-xl font-semibold text-foreground">Ação necessária</h2>
          </div>
        </div>
        {dashboard.action_required.length ? (
          <div className="divide-y divide-border rounded-lg border border-border bg-surface">
            {dashboard.action_required.map((action) => (
              <div key={`${action.kind}-${action.related_id}`} className="flex flex-col gap-4 p-4 tb:flex-row tb:items-center tb:justify-between tb:p-5">
                <div>
                  <h3 className="font-semibold text-foreground">{action.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
                </div>
                <Button asChild className="self-start tb:self-center">
                  <Link to={action.href}>Resolver agora <ArrowRight className="ml-2 size-4" /></Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-border bg-surface p-5 text-sm text-muted-foreground">Não há ações pendentes neste momento.</p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <HomeSection title="Pedidos ativos" icon={ClipboardList} href="/municipe/pedidos" linkLabel="Ver todos os pedidos">
          {dashboard.active_requests.length ? dashboard.active_requests.map((request) => (
            <Link key={request.id} to={`/municipe/pedidos/${request.id}`} className="block border-b border-border py-4 last:border-0 hover:bg-muted/40">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{request.serviceTitle || request.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{request.reference} · {formatDate(request.submittedAt)}</p>
                </div>
                <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-foreground">{request.statusLabel}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{request.nextAction}</p>
            </Link>
          )) : <EmptyLine>Não existem pedidos ativos.</EmptyLine>}
        </HomeSection>

        <HomeSection title="Rascunhos" icon={FileText} href="/municipe/pedidos" linkLabel="Gerir rascunhos">
          {dashboard.drafts.length ? dashboard.drafts.map((draft) => (
            <Link key={draft.id} to={`/municipe/pedidos/rascunhos/${draft.id}`} className="flex items-center justify-between gap-4 border-b border-border py-4 last:border-0 hover:bg-muted/40">
              <div>
                <p className="font-medium text-foreground">{draft.serviceTitle}</p>
                <p className="mt-1 text-xs text-muted-foreground">Guardado {draft.lastSavedAt ? formatDate(draft.lastSavedAt) : 'recentemente'}</p>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
            </Link>
          )) : <EmptyLine>Não existem rascunhos guardados.</EmptyLine>}
        </HomeSection>

        <HomeSection title="Próximo agendamento" icon={CalendarDays}>
          {dashboard.next_appointment ? (
            <div className="py-4">
              <p className="font-medium text-foreground">{formatDateTime(dashboard.next_appointment.startsAt)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{dashboard.next_appointment.departmentName || 'Atendimento municipal'}</p>
              <p className="mt-2 text-xs text-muted-foreground">Referência {dashboard.next_appointment.reference}</p>
            </div>
          ) : <EmptyLine>Não existe agendamento futuro.</EmptyLine>}
        </HomeSection>

        <HomeSection title={`Notificações${dashboard.unread_notifications ? ` (${dashboard.unread_notifications})` : ''}`} icon={Bell} href="/municipe/notificacoes" linkLabel="Ver notificações">
          {dashboard.recent_notifications.length ? dashboard.recent_notifications.map((notification) => (
            <div key={notification.id} className="border-b border-border py-4 last:border-0">
              <div className="flex gap-2">
                {!notification.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-label="Não lida" />}
                <div>
                  <p className="font-medium text-foreground">{notification.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{notification.message}</p>
                </div>
              </div>
            </div>
          )) : <EmptyLine>Não existem notificações.</EmptyLine>}
        </HomeSection>
      </div>
    </div>
  );
}

function HomeSection({ title, icon: Icon, href, linkLabel, children }: { title: string; icon: typeof Bell; href?: string; linkLabel?: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-4 tb:p-5" aria-label={title}>
      <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground"><Icon className="size-4 text-primary" />{title}</h2>
        {href && <Link to={href} className="text-xs font-semibold text-primary hover:underline">{linkLabel}</Link>}
      </div>
      {children}
    </section>
  );
}

function EmptyLine({ children }: { children: ReactNode }) { return <p className="py-6 text-sm text-muted-foreground">{children}</p>; }
function DashboardSkeleton() { return <div className="space-y-6" aria-busy="true"><Skeleton className="h-20 w-full max-w-xl" /><Skeleton className="h-32 w-full" /><div className="grid gap-6 lg:grid-cols-2"><Skeleton className="h-64" /><Skeleton className="h-64" /></div></div>; }
function LoadError({ message, retry }: { message: string; retry: () => void }) { return <div role="alert" className="rounded-lg border border-destructive/40 bg-surface p-6"><h2 className="font-semibold text-foreground">Não foi possível carregar a sua área</h2><p className="mt-2 text-sm text-muted-foreground">{message}</p><Button variant="outline" className="mt-4" onClick={retry}><RefreshCw className="mr-2 size-4" />Tentar novamente</Button></div>; }
function formatDate(value: string) { return new Intl.DateTimeFormat('pt-MZ', { dateStyle: 'medium' }).format(new Date(value)); }
function formatDateTime(value: string) { return new Intl.DateTimeFormat('pt-MZ', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); }
