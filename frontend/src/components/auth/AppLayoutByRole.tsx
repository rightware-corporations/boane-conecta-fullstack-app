import { ReactNode } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useUserRole } from '@/hooks/useUserRole';
import type { UserRole } from '@/types';

interface AppLayoutByRoleProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  roles: UserRole[];
}

export function AppLayoutByRole({ children, title, subtitle, roles }: AppLayoutByRoleProps) {
  const { role, canAccessAdmin } = useUserRole();

  // Check if user has required role
  if (!role || !roles.includes(role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Acesso Negado</h1>
          <p className="text-muted-foreground mt-2">
            Não tem permissão para aceder a esta área.
          </p>
        </div>
      </div>
    );
  }

  // Use AdminLayout for admin roles
  if (canAccessAdmin) {
    return (
      <AdminLayout title={title} subtitle={subtitle}>
        {children}
      </AdminLayout>
    );
  }

  // For citizen role, we'll create CitizenLayout later in Phase 4
  // For now, just render children without layout
  return <>{children}</>;
}