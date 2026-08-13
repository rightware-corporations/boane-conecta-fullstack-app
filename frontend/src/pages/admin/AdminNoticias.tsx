import { AdminLayout } from '@/components/admin/AdminLayout';
import { Newspaper } from 'lucide-react';

export default function AdminNoticias() {
  return (
    <AdminLayout title="Gestão de Notícias" subtitle="Módulo pendente de API backend">
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-soft">
        <Newspaper className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">Notícias sem integração legada</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
          A integração Supabase foi removida. Esta área ficará disponível quando o módulo real de notícias for exposto no backend Spring Boot.
        </p>
      </div>
    </AdminLayout>
  );
}
