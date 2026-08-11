import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { dashboardService } from '@/services/dashboard.service';
import { Newspaper, Briefcase, FolderKanban, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DashboardMetrics } from '@/types';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      const { data } = await dashboardService.getAdminMetrics();
      if (data) setMetrics(data);
      setLoading(false);
    }
    fetchMetrics();
  }, []);

  const cards = [
    { title: 'Notícias', count: metrics?.overview?.total_services || 0, icon: Newspaper, href: '/admin/noticias', color: 'bg-blue-500' },
    { title: 'Serviços', count: metrics?.overview?.total_services || 0, icon: Briefcase, href: '/admin/servicos', color: 'bg-green-500' },
    { title: 'Projectos', count: metrics?.overview?.total_projects || 0, icon: FolderKanban, href: '/admin/projectos', color: 'bg-purple-500' },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Visão geral do portal">
      <div className="grid gap-3 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.href}
            className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-soft hover:shadow-elevated transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-0.5 sm:mt-1">
                  {loading ? '...' : card.count}
                </p>
              </div>
              <div className={`${card.color} p-2.5 sm:p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                <card.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-primary">
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
              Ver detalhes
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 sm:mt-8 grid gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-soft">
          <h3 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Acções Rápidas</h3>
          <div className="space-y-2 sm:space-y-3">
            <Link to="/admin/noticias" className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              <Newspaper className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-xs sm:text-sm font-medium">Criar nova notícia</span>
            </Link>
            <Link to="/admin/servicos" className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-xs sm:text-sm font-medium">Adicionar serviço</span>
            </Link>
            <Link to="/admin/projectos" className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              <FolderKanban className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-xs sm:text-sm font-medium">Registar projecto</span>
            </Link>
          </div>
        </div>

        <div className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-soft">
          <h3 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Informações do Sistema</h3>
          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-1.5 sm:py-2 border-b border-border">
              <span className="text-muted-foreground">Versão</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between py-1.5 sm:py-2 border-b border-border">
              <span className="text-muted-foreground">Último acesso</span>
              <span className="font-medium">{new Date().toLocaleDateString('pt-PT')}</span>
            </div>
            <div className="flex justify-between py-1.5 sm:py-2">
              <span className="text-muted-foreground">Estado</span>
              <span className="font-medium text-green-600">Activo</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
