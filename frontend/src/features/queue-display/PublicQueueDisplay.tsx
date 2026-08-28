import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, MonitorUp } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { getPublicQueueDisplay } from './queue-display.api';

export default function PublicQueueDisplay() {
  const { queueId = '' } = useParams();
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update); window.addEventListener('offline', update);
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); };
  }, []);
  const calls = useQuery({ queryKey: ['public-queue-display', queueId], queryFn: () => getPublicQueueDisplay(queueId), enabled: Boolean(queueId), refetchInterval: () => document.hidden || !online ? false : 5_000, refetchOnWindowFocus: true, refetchOnReconnect: true });

  return <main className="min-h-screen bg-foreground px-5 py-8 text-background tb:px-10 lg:px-16" aria-live="polite">
    <header className="flex items-center justify-between gap-6 border-b border-background/20 pb-6"><div><p className="text-sm font-semibold uppercase tracking-[.18em] text-background/70">Conselho Municipal de Boane</p><h1 className="mt-2 text-2xl font-semibold tb:text-4xl">Chamadas para atendimento</h1></div><MonitorUp className="size-9 text-background/70" aria-hidden="true" /></header>
    {!online && <div className="mt-6 flex items-center gap-3 rounded-md border border-amber-300/60 bg-amber-300/10 p-4 text-amber-100"><AlertCircle className="size-5" /><p>Sem ligação. As chamadas apresentadas podem estar desatualizadas.</p></div>}
    {calls.isError && <div className="mt-10 rounded-lg border border-red-300/50 p-6 text-center"><p className="text-xl font-semibold">Não foi possível atualizar o painel</p><p className="mt-2 text-background/70">A operação interna da fila continua disponível.</p></div>}
    {calls.isLoading && <div className="mt-12 grid gap-5 tb:grid-cols-2"><div className="h-56 animate-pulse rounded-lg bg-background/10" /><div className="h-56 animate-pulse rounded-lg bg-background/10" /></div>}
    {calls.data && calls.data.length === 0 && <div className="flex min-h-[60vh] items-center justify-center text-center"><div><p className="text-3xl font-semibold tb:text-5xl">Aguarde a sua senha</p><p className="mt-4 text-xl text-background/65">As próximas chamadas aparecerão neste painel.</p></div></div>}
    {calls.data && calls.data.length > 0 && <ol className="mt-10 grid gap-5 tb:grid-cols-2 xl:grid-cols-3">{calls.data.map((call, index) => <li key={`${call.ticketCode}-${call.calledAt}`} className={index === 0 ? 'rounded-lg border-2 border-background bg-background p-7 text-foreground tb:col-span-2 xl:col-span-2' : 'rounded-lg border border-background/30 p-7'}><p className="text-sm font-semibold uppercase tracking-[.16em] opacity-70">Senha</p><p className="mt-2 text-5xl font-bold tracking-tight tb:text-7xl">{call.ticketCode}</p><p className="mt-8 text-sm font-semibold uppercase tracking-[.16em] opacity-70">Balcão</p><p className="mt-2 text-2xl font-semibold tb:text-4xl">{call.deskDisplayName}</p><p className="mt-6 text-sm opacity-70">{call.callState === 'CALLED' ? 'Dirija-se ao balcão indicado' : 'Atendimento iniciado'}</p></li>)}</ol>}
  </main>;
}
