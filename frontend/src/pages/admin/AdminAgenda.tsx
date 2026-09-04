import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OperationalEmpty, OperationalError, OperationalLoading } from '@/design-system/components/operational-state';
import { assistedCheckIn, listAdminAppointments } from '@/features/queue-admin/queue-admin.api';
import { formatDate, formatTime } from '@/lib/formatters';

const appointmentLabel: Record<string, string> = {
  SCHEDULED: 'Agendado', CONFIRMED: 'Confirmado', CHECKED_IN: 'Check-in feito', WAITING: 'A aguardar',
  CALLED: 'Chamado', IN_SERVICE: 'Em atendimento', COMPLETED: 'Concluído', CANCELLED: 'Cancelado',
  NO_SHOW: 'Não compareceu', EXPIRED: 'Expirado', RESCHEDULED: 'Reagendado',
};

export default function AdminAgenda() {
  const appointments = useQuery({ queryKey: ['admin-appointments'], queryFn: listAdminAppointments, refetchInterval: () => document.hidden ? false : 20_000 });
  const checkIn = useMutation({ mutationFn: assistedCheckIn, onSuccess: () => appointments.refetch() });
  const ordered = [...(appointments.data || [])].sort((a, b) => Date.parse(a.startTime || '') - Date.parse(b.startTime || ''));
  return <AdminLayout title="Agenda de atendimento" subtitle="Agendamentos e check-in assistido" shell="operations"><div className="mx-auto max-w-[1100px] space-y-6"><header className="border-b pb-5"><p className="text-sm font-medium text-primary">Agenda operacional</p><h2 className="mt-1 text-2xl font-semibold">Quem está previsto para atendimento?</h2><p className="mt-2 text-sm text-muted-foreground">Use o check-in assistido apenas quando o munícipe estiver fisicamente presente.</p></header>{appointments.isLoading && <OperationalLoading label="A carregar agenda de atendimento…" />}{appointments.isError && <OperationalError title="Agenda indisponível" description="Não foi possível obter os agendamentos atribuídos ao seu âmbito operacional." retry={() => void appointments.refetch()} />}{appointments.data?.length === 0 && <OperationalEmpty title="Sem agendamentos registados" description="Não existem atendimentos visíveis no seu âmbito atual." />}{ordered.length > 0 && <section aria-labelledby="agenda-list-title"><div className="mb-3 flex items-center justify-between gap-4"><h3 id="agenda-list-title" className="font-semibold">Agenda cronológica</h3><span className="text-xs text-muted-foreground">{ordered.length} {ordered.length === 1 ? 'agendamento' : 'agendamentos'}</span></div><div className="divide-y rounded-lg border bg-card">{ordered.map((item) => <article key={item.id} className="grid min-h-16 gap-3 px-4 py-3 xsm:grid-cols-[5rem_minmax(0,1fr)_auto] xsm:items-center"><div><p className="text-lg font-semibold tabular-nums">{formatTime(item.startTime)}</p><p className="text-xs text-muted-foreground">{formatDate(item.startTime)}</p></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{item.serviceName || item.departmentName || 'Atendimento municipal'}</p><Badge variant="outline">{appointmentLabel[item.status] || item.status}</Badge></div><p className="mt-1 truncate text-sm text-muted-foreground">{item.appointmentNumber} · {item.locationName || item.locationCode || 'Local por confirmar'}</p></div>{item.status === 'CONFIRMED' && <Button className="w-full xsm:w-auto" disabled={checkIn.isPending} onClick={() => checkIn.mutate(item.id)}><CheckCircle2 className="mr-2 size-4" />Check-in assistido</Button>}</article>)}</div></section>}{checkIn.isError && <OperationalError title="Check-in não concluído" description="Confirme presença, horário e estado do agendamento antes de repetir." />}</div></AdminLayout>;
}
