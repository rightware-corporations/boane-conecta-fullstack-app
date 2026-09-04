import type { UserRole } from '@/types';

export const ADMIN_SERVICES_READ_ROLES: UserRole[] = ['super_admin', 'admin', 'gestor'];

export function canReadAdminServices(role: UserRole | null): boolean {
  return role !== null && ADMIN_SERVICES_READ_ROLES.includes(role);
}
