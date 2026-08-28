import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, ArrowRight } from 'lucide-react';
import { CitizenLayout } from '@/components/citizen/CitizenLayout';
import { citizenService } from '@/services/citizen.service';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Notification } from '@/types';

export default function CitizenNotificacoes() {
  const [items, setItems] = useState<Notification[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string>(); const unread = items.filter(item => !item.read).length;
  useEffect(() => { citizenService.getNotifications().then(result => { setItems(result.data ?? []); setError(result.error); setLoading(false); }); }, []);
  const markOne = async (id: string) => { const result = await citizenService.markNotificationRead(id); if (!result.error) setItems(current => current.map(item => item.id === id ? { ...item, read: true } : item)); };
  const markAll = async () => { const result = await citizenService.markAllNotificationsRead(); if (!result.error) setItems(current => current.map(item => ({ ...item, read: true }))); };
  return <CitizenLayout title="Notificações" subtitle={unread ? `${unread} por ler` : 'Tudo em dia'}>
    <div className="mb-5 flex justify-end border-b border-border pb-5">{unread > 0 && <Button variant="outline" onClick={markAll}><CheckCheck className="mr-2 h-4 w-4" />Marcar todas como lidas</Button>}</div>
    {loading ? <div className="space-y-2">{[1,2,3].map(item => <Skeleton key={item} className="h-20" />)}</div> : error ? <div role="alert" className="border-l-4 border-destructive p-4">{error}</div> : items.length === 0 ? <div className="py-14 text-center"><Bell className="mx-auto mb-3 h-8 w-8 text-muted-foreground" /><h2 className="font-semibold">Sem notificações</h2><p className="mt-1 text-sm text-muted-foreground">As atualizações importantes dos seus pedidos surgirão aqui.</p></div> : <div className="divide-y divide-border border-y border-border">{items.map(item => <article key={item.id} className={`grid gap-2 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] ${item.read ? '' : 'border-l-4 border-l-primary pl-3'}`}><Bell className="mt-1 h-4 w-4 text-muted-foreground" /><div><h2 className="font-medium">{item.title}</h2><p className="mt-1 text-sm text-muted-foreground">{item.message}</p><time className="mt-2 block text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString('pt-PT')}</time></div><div className="flex items-center gap-2">{!item.read && <Button variant="ghost" size="sm" onClick={() => markOne(item.id)}>Marcar lida</Button>}{item.actionHref && <Button variant="ghost" size="sm" asChild><Link to={item.actionHref}>Abrir <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>}</div></article>)}</div>}
  </CitizenLayout>;
}
