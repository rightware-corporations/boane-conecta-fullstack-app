import { useEffect, useState } from 'react';
import { CitizenLayout } from '@/components/citizen/CitizenLayout';
import { citizenService } from '@/services/citizen.service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, CheckCheck, ClipboardList, CreditCard, Shield, Calendar, Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import type { Notification } from '@/types';

const typeIcons: Record<string, typeof Bell> = {
  service_request: ClipboardList,
  payment: CreditCard,
  license: Shield,
  appointment: Calendar,
  general: Info,
};

const typeColors: Record<string, string> = {
  info: 'bg-blue-100 text-blue-600',
  warning: 'bg-amber-100 text-amber-600',
  success: 'bg-emerald-100 text-emerald-600',
  error: 'bg-red-100 text-red-600',
};

export default function CitizenNotificacoes() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await citizenService.getNotifications();
      if (data) setNotifications(data);
      setLoading(false);
    }
    fetch();
  }, []);

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => citizenService.markNotificationRead(n.id)));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleMarkRead = async (id: string) => {
    await citizenService.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <CitizenLayout title="Notificações" subtitle={`${unreadCount} não lida(s)`}>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">{notifications.length} notificação(ões)</p>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="h-4 w-4 mr-1" /> Marcar todas como lidas
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Sem notificações.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map(notif => {
            const Icon = typeIcons[notif.category] || Bell;
            const colorClass = typeColors[notif.type] || typeColors.info;
            return (
              <Card
                key={notif.id}
                className={!notif.read ? 'border-l-4 border-l-primary' : 'opacity-80'}
                onClick={() => !notif.read && handleMarkRead(notif.id)}
              >
                <CardContent className="p-4 flex items-start gap-3 cursor-pointer">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0 ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{notif.title}</p>
                      {!notif.read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(notif.created_at).toLocaleDateString('pt-PT', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </CitizenLayout>
  );
}