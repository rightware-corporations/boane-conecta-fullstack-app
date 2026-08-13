import { AdminLayout } from '@/components/admin/AdminLayout';
import { FolderKanban } from 'lucide-react';

export default function AdminProjectos() {
  return (
    <AdminLayout title="Gestão de Projectos" subtitle="Módulo pendente de API backend">
      <div className="text-center py-16 bg-card rounded-xl">
        <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Módulo de projectos ainda não exposto no backend.</p>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
          Esta página não usa Supabase, não usa mock e não acede directamente à base de dados.
          Quando o módulo real de projectos for aprovado, será implementado no backend Spring Boot e ligado aqui.
        </p>
      </div>
    </AdminLayout>
  );
}
