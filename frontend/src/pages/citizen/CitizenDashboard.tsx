import { useEffect, useState } from 'react';
import { CitizenLayout } from '@/components/citizen/CitizenLayout';
import { useAuth } from '@/hooks/use-auth';
import { citizenService } from '@/services/citizen.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ClipboardList,
  CreditCard,
  Shield,
  Calendar,
  Bell,
  FileText,
  ArrowRight,
  User,
  Clock,
} from 'lucide-react';
import type { CitizenDashboard as DashboardData } from '@/types';

export default function CitizenDashboard() {
  const { profile } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      const { data, error } = await citizenService.getDashboard();
      if (error) {
        setError(error);
      } else if (data) {
        setDashboard(data);
      }
      setLoading(false);
    }
    fetchDashboard();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const quickLinks = [
    { title: 'Meus Pedidos', icon: ClipboardList, href: '/municipe/pedidos', color: 'text-blue-600 bg-blue-100' },
    { title: 'Pagamentos', icon: CreditCard, href: '/municipe/pagamentos', color: 'text-emerald-600 bg-emerald-100' },
    { title: 'Licenças', icon: Shield, href: '/municipe/licencas', color: 'text-amber-600 bg-amber-100' },
    { title: 'Documentos', icon: FileText, href: '/municipe/documentos', color: 'text-purple-600 bg-purple-100' },
    { title: 'Agendamentos', icon: Calendar, href: '/municipe/agendamentos', color: 'text-cyan-600 bg-cyan-100' },
    { title: 'Notificações', icon: Bell, href: '/municipe/notificacoes', color: 'text-rose-600 bg-rose-100' },
  ];

  return (
    <CitizenLayout title="Painel do Munícipe" subtitle="Resumo da sua actividade">
      {/* Greeting */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {greeting()}, {profile?.full_name || 'Munícipe'}!
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Bem-vindo à sua área pessoal no portal do Conselho Municipal de Boane.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-10" />
              </CardContent>
            </Card>
          ))
        ) : dashboard ? (
          <>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Pedidos em Curso</p>
                <p className="text-2xl font-bold text-foreground">{dashboard.stats.pending_requests}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Pagamentos Pendentes</p>
                <p className="text-2xl font-bold text-foreground">{dashboard.stats.pending_payments}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Licenças Activas</p>
                <p className="text-2xl font-bold text-foreground">{dashboard.stats.active_licenses}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Agendamentos</p>
                <p className="text-2xl font-bold text-foreground">{dashboard.stats.upcoming_appointments}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Notificações</p>
                <p className="text-2xl font-bold text-foreground">{dashboard.stats.unread_notifications}</p>
              </CardContent>
            </Card>
          </>
        ) : error ? (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">{error}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {quickLinks.map((link) => (
          <Link key={link.href} to={link.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div className={cn('p-3 rounded-xl', link.color)}>
                  <link.icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-foreground">{link.title}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity & Notifications */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Actividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 py-3 border-b last:border-0">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
            ) : dashboard?.recent_activity?.length ? (
              dashboard.recent_activity.slice(0, 5).map((item) => (
                <div key={item.id} className="flex gap-3 py-3 border-b border-border last:border-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    {item.type === 'service_request' && <ClipboardList className="h-4 w-4 text-muted-foreground" />}
                    {item.type === 'payment' && <CreditCard className="h-4 w-4 text-muted-foreground" />}
                    {item.type === 'appointment' && <Calendar className="h-4 w-4 text-muted-foreground" />}
                    {item.type === 'license' && <Shield className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(item.date).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  {item.status && <Badge variant="secondary" className="text-[10px] h-5 self-center">{item.status}</Badge>}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">Sem actividade recente</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="py-3 border-b last:border-0">
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            ) : dashboard?.recent_notifications?.length ? (
              dashboard.recent_notifications.slice(0, 5).map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "py-3 border-b border-border last:border-0",
                    !notif.read && "bg-primary/5 -mx-4 px-4 rounded"
                  )}
                >
                  <div className="flex items-start gap-2">
                    {!notif.read && <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(notif.created_at).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">Sem notificações</p>
            )}
            <Link to="/municipe/notificacoes">
              <Button variant="ghost" size="sm" className="w-full mt-2">
                Ver todas <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </CitizenLayout>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}