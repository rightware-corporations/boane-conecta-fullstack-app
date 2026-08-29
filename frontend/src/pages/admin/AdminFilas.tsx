import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AlertCircle, BellRing, CheckCircle2, DoorClosed, DoorOpen, RefreshCw, UserRoundX } from 'lucide-react';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  callNext, closeDesk, completeService, getQueueSnapshots, markNoShow, openDesk,
  recallTicket, startService, transferTicket,
} from '@/features/queue-operations/api/queue-operations.api';
import type { StaffQueueDesk, StaffQueueSnapshot } from '@/features/queue-operations/types';
import { useAuth } from '@/hooks/use-auth';

const queueLabel: Record<string, string> = { OPEN: 'Aberta', PAUSED: 'Pausada', CLOSED: 'Encerrada' };
const deskLabel: Record<string, string> = { OPEN: 'Disponível', SERVING: 'Em atendimento', PAUSED: 'Pausado', CLOSED: 'Fechado' };

export default function AdminFilas() {
  const { user } = useAuth();
  const [queueId, setQueueId] = useState('');
  const [deskId, setDeskId] = useState('');
  const [outcome, setOutcome] = useState('CONCLUIDO');
  const [destination, setDestination] = useState('');
  const [transferReason, setTransferReason] = useState('Encaminhamento para o serviço competente');

  const snapshots = useQuery({
    queryKey: ['staff-queue-snapshots'], queryFn: getQueueSnapshots,
    refetchInterval: () => document.hidden ? false : 10_000,
    refetchOnWindowFocus: true, refetchOnReconnect: true,
  });
  useEffect(() => {
    if (!queueId && snapshots.data?.[0]) setQueueId(snapshots.data[0].queueId);
  }, [queueId, snapshots.data]);
  const queue = snapshots.data?.find((item) => item.queueId === queueId) || null;
  useEffect(() => {
    if (queue && !queue.desks.some((desk) => desk.id === deskId)) setDeskId(queue.desks[0]?.id || '');
  }, [deskId, queue]);
  const desk = queue?.desks.find((item) => item.id === deskId) || null;
  const ownsDesk = Boolean(desk?.currentStaffUserId && desk.currentStaffUserId === user?.id);

  const command = useMutation({
    mutationFn: async (action: () => Promise<unknown>) => action(),
    onSuccess: () => snapshots.refetch(),
  });
  const alternatives = useMemo(() => (snapshots.data || []).filter((item) => item.queueId !== queueId && item.queueStatus === 'OPEN'), [queueId, snapshots.data]);

  function run(action: () => Promise<unknown>) { command.mutate(action); }

  return <AdminLayout title="Operação de filas" subtitle="Atendimento presencial em tempo real">
    <div className="mx-auto max-w-[1280px] space-y-6">
      <header className="border-b pb-5">
        <p className="text-sm font-medium text-primary">Operação do balcão</p>
        <h2 className="mt-1 text-2xl font-semibold">Quem deve ser atendido agora?</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Selecione a fila e o seu balcão. As ações disponíveis dependem do estado operacional atual.</p>
      </header>

      {snapshots.isLoading && <div className="space-y-3"><Skeleton className="h-12" /><Skeleton className="h-64" /></div>}
      {snapshots.isError && <Alert variant="destructive"><AlertCircle className="size-4" /><AlertTitle>Não foi possível carregar as filas</AlertTitle><AlertDescription><Button className="mt-3" variant="outline" onClick={() => snapshots.refetch()}><RefreshCw className="mr-2 size-4" />Tentar novamente</Button></AlertDescription></Alert>}
      {snapshots.data?.length === 0 && <div className="rounded-lg border border-dashed p-8 text-center"><h3 className="font-semibold">Nenhuma fila configurada</h3><p className="mt-2 text-sm text-muted-foreground">Um administrador deve configurar a fila e os balcões antes da operação.</p></div>}

      {queue && <>
        <div className="grid gap-4 tb:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="queue">Fila</Label><select id="queue" className="min-h-11 w-full rounded-md border bg-background px-3 text-sm" value={queueId} onChange={(event) => { setQueueId(event.target.value); setDeskId(''); }} disabled={command.isPending}>{snapshots.data?.map((item) => <option key={item.queueId} value={item.queueId}>{item.queueName} — {item.locationCode}</option>)}</select></div>
          <div className="space-y-2"><Label htmlFor="desk">Balcão</Label><select id="desk" className="min-h-11 w-full rounded-md border bg-background px-3 text-sm" value={deskId} onChange={(event) => setDeskId(event.target.value)} disabled={command.isPending}><option value="">Selecione um balcão</option>{queue.desks.map((item) => <option key={item.id} value={item.id}>{item.displayName} — {deskLabel[item.status] || item.status}</option>)}</select></div>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-4">
          <div className="mr-auto"><p className="font-semibold">{queue.queueName}</p><p className="text-sm text-muted-foreground">Estado da fila: {queueLabel[queue.queueStatus] || queue.queueStatus}</p></div>
          <Badge variant={queue.queueStatus === 'OPEN' ? 'secondary' : 'outline'}>{queueLabel[queue.queueStatus] || queue.queueStatus}</Badge>
          <span className="text-xs text-muted-foreground">Atualizado {new Date(queue.generatedAt).toLocaleTimeString('pt-MZ')}</span>
        </div>

        {desk && <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,.72fr)]">
          <section className="space-y-5 rounded-lg border bg-card p-5" aria-labelledby="desk-title">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm text-muted-foreground">O seu posto</p><h3 id="desk-title" className="text-xl font-semibold">{desk.displayName}</h3></div><Badge variant="outline">{deskLabel[desk.status] || desk.status}</Badge></div>

            {!desk.currentStaffUserId && <div className="rounded-md border border-dashed p-5"><p className="font-medium">Balcão sem funcionário</p><p className="mt-1 text-sm text-muted-foreground">Abra o balcão para assumir este posto.</p><Button className="mt-4" disabled={queue.queueStatus !== 'OPEN' || command.isPending} onClick={() => run(() => openDesk(queue.queueId, desk.id))}><DoorOpen className="mr-2 size-4" />Abrir balcão</Button></div>}
            {desk.currentStaffUserId && !ownsDesk && <Alert><AlertCircle className="size-4" /><AlertTitle>Balcão atribuído a outro funcionário</AlertTitle><AlertDescription>Escolha outro balcão disponível. Não é permitido operar em nome de outro funcionário.</AlertDescription></Alert>}

            {ownsDesk && !desk.currentTicket && <div className="rounded-md border p-5"><p className="font-medium">Nenhuma senha em atendimento</p><p className="mt-1 text-sm text-muted-foreground">Existem {queue.waiting.length} senhas a aguardar.</p><div className="mt-4 flex flex-wrap gap-3"><Button disabled={!queue.waiting.length || desk.status !== 'OPEN' || command.isPending} onClick={() => run(() => callNext(queue.queueId, desk.id))}><BellRing className="mr-2 size-4" />Chamar próxima senha</Button><Button variant="outline" disabled={command.isPending} onClick={() => run(() => closeDesk(queue.queueId, desk.id))}><DoorClosed className="mr-2 size-4" />Fechar balcão</Button></div></div>}

            {ownsDesk && desk.currentTicket && <CurrentTicket queue={queue} desk={desk} outcome={outcome} setOutcome={setOutcome} destination={destination} setDestination={setDestination} transferReason={transferReason} setTransferReason={setTransferReason} alternatives={alternatives} pending={command.isPending} run={run} />}
            {command.isError && <Alert variant="destructive"><AlertCircle className="size-4" /><AlertTitle>A operação não foi concluída</AlertTitle><AlertDescription>O estado pode ter mudado noutro posto. Atualize a fila antes de repetir.<Button variant="outline" className="mt-3 block" onClick={() => snapshots.refetch()}>Atualizar estado</Button></AlertDescription></Alert>}
          </section>

          <section className="rounded-lg border bg-card" aria-labelledby="waiting-title"><div className="border-b p-4"><h3 id="waiting-title" className="font-semibold">Fila de espera</h3><p className="text-sm text-muted-foreground">Ordem calculada pelo motor da fila</p></div>{queue.waiting.length ? <ol className="divide-y">{queue.waiting.map((ticket, index) => <li key={ticket.id} className="flex items-center justify-between gap-4 p-4"><div><p className="font-semibold">{ticket.code}</p><p className="text-xs text-muted-foreground">Chegada {new Date(ticket.createdAt).toLocaleTimeString('pt-MZ')}</p></div><span className="text-sm text-muted-foreground">{index + 1}º</span></li>)}</ol> : <p className="p-6 text-center text-sm text-muted-foreground">Não há senhas a aguardar.</p>}</section>
        </div>}
      </>}
    </div>
  </AdminLayout>;
}

type CurrentProps = { queue: StaffQueueSnapshot; desk: StaffQueueDesk; outcome: string; setOutcome: (value: string) => void; destination: string; setDestination: (value: string) => void; transferReason: string; setTransferReason: (value: string) => void; alternatives: StaffQueueSnapshot[]; pending: boolean; run: (action: () => Promise<unknown>) => void };
function CurrentTicket({ desk, outcome, setOutcome, destination, setDestination, transferReason, setTransferReason, alternatives, pending, run }: CurrentProps) {
  const ticket = desk.currentTicket;
  if (!ticket) return null;
  return <div className="space-y-5 rounded-md border border-primary/30 p-5"><div><p className="text-sm text-muted-foreground">Senha atual</p><p className="mt-1 text-4xl font-bold tracking-tight">{ticket.code}</p><Badge className="mt-3" variant="secondary">{ticket.status === 'CALLED' ? 'Chamada' : 'Em atendimento'}</Badge></div>
    {ticket.status === 'CALLED' && <div className="flex flex-wrap gap-3"><Button disabled={pending} onClick={() => run(() => startService(ticket.id))}><CheckCircle2 className="mr-2 size-4" />Iniciar atendimento</Button><Button variant="outline" disabled={pending} onClick={() => run(() => recallTicket(ticket.id))}><BellRing className="mr-2 size-4" />Rechamar</Button><Button variant="outline" disabled={pending} onClick={() => run(() => markNoShow(ticket.id))}><UserRoundX className="mr-2 size-4" />Não compareceu</Button></div>}
    {ticket.status === 'SERVING' && desk.activeSessionId && <div className="space-y-3"><Label htmlFor="outcome">Resultado do atendimento</Label><Input id="outcome" value={outcome} maxLength={80} onChange={(event) => setOutcome(event.target.value)} /><Button disabled={!outcome.trim() || pending} onClick={() => run(() => completeService(desk.activeSessionId as string, outcome))}>Concluir atendimento</Button></div>}
    {ticket.status === 'CALLED' && alternatives.length > 0 && <div className="space-y-3 border-t pt-4"><Label htmlFor="destination">Transferir para outra fila</Label><select id="destination" className="min-h-11 w-full rounded-md border bg-background px-3 text-sm" value={destination} onChange={(event) => setDestination(event.target.value)}><option value="">Selecione a fila de destino</option>{alternatives.map((item) => <option key={item.queueId} value={item.queueId}>{item.queueName}</option>)}</select><Textarea aria-label="Motivo da transferência" value={transferReason} maxLength={500} onChange={(event) => setTransferReason(event.target.value)} /><Button variant="outline" disabled={!destination || !transferReason.trim() || pending} onClick={() => run(() => transferTicket(ticket.id, destination, transferReason))}>Transferir senha</Button></div>}
  </div>;
}
