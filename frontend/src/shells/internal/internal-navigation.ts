import { BriefcaseBusiness, CalendarClock, House, Tickets, type LucideIcon } from 'lucide-react';

import { ADMIN_SERVICES_READ_ROLES } from '@/features/admin-services/admin-services.authorization';
import type { UserRole } from '@/types';

export type InternalNavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  group: 'overview' | 'operations' | 'content';
  presentationRoles: UserRole[];
  order: number;
};

// Presentation metadata only. Spring Security remains the authorization authority.
export const supportedOperationsNavigation: InternalNavigationItem[] = [
  {
    href: '/admin/filas',
    label: 'Filas',
    icon: Tickets,
    group: 'operations',
    presentationRoles: ['super_admin', 'admin', 'funcionario', 'gestor'],
    order: 10,
  },
  {
    href: '/admin/agenda',
    label: 'Agenda',
    icon: CalendarClock,
    group: 'operations',
    presentationRoles: ['super_admin', 'admin', 'funcionario', 'gestor'],
    order: 20,
  },
];

export const supportedContentNavigation: InternalNavigationItem[] = [
  {
    href: '/admin/servicos',
    label: 'Serviços',
    icon: BriefcaseBusiness,
    group: 'content',
    presentationRoles: ADMIN_SERVICES_READ_ROLES,
    order: 30,
  },
];

const internalLandingNavigation: InternalNavigationItem = {
  href: '/admin',
  label: 'Início interno',
  icon: House,
  group: 'overview',
  presentationRoles: ['super_admin', 'admin', 'editor', 'funcionario', 'gestor'],
  order: 0,
};

export function navigationForRole(role: UserRole | null): InternalNavigationItem[] {
  if (!role) return [];
  return [internalLandingNavigation, ...supportedOperationsNavigation, ...supportedContentNavigation]
    .filter((item) => item.presentationRoles.includes(role))
    .sort((left, right) => left.order - right.order);
}

export function landingActionsForRole(role: UserRole | null): InternalNavigationItem[] {
  if (!role) return [];
  return [...supportedOperationsNavigation, ...supportedContentNavigation]
    .filter((item) => item.presentationRoles.includes(role))
    .sort((left, right) => left.order - right.order);
}
