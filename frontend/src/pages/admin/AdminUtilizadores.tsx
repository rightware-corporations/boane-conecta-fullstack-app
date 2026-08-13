import { AdminLayout } from '@/components/admin/AdminLayout';
import { Shield, Users } from 'lucide-react';

export default function AdminUtilizadores() {
  return (
    <AdminLayout title="Gestão de Utilizadores" subtitle="Módulo administrativo">
      <div className="bg-card rounded-xl shadow-soft p-8 text-center">
        <Users className="h-12 w-12 mx-auto text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">Gestão de utilizadores em preparação</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
          A autenticação, roles e bootstrap administrativo já são geridos pelo backend Spring Boot.
          Esta página foi desligada do Supabase e será ligada aos endpoints administrativos de utilizadores quando o CRUD de utilizadores for exposto no backend.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          Sem Supabase, sem mock, sem acesso directo à base de dados
        </div>
      </div>
    </AdminLayout>
  );
}
