import { useAuth } from './useAuth';
import type { UserRole } from '@/types';

export function useUserRole() {
  const { profile, role, permissions, isLoading } = useAuth();

  // Role checkers
  const isSuperAdmin = role === 'super_admin';
  const isAdmin = role === 'admin';
  const isEditor = role === 'editor';
  const isFuncionario = role === 'funcionario';
  const isGestor = role === 'gestor';
  const isMunicipe = role === 'municipe';

  // Permission checker
  const hasPermission = (permission: string): boolean => {
    if (permissions.includes('*')) return true; // Super admin has all permissions
    return permissions.includes(permission);
  };

  // Module-specific permissions
  const canManageNews = hasPermission('admin.news.manage');
  const canManageServices = hasPermission('admin.services.manage');
  const canManageProjects = hasPermission('admin.projects.manage');
  const canManageUsers = hasPermission('admin.users.manage');
  const canManageRequests = hasPermission('admin.requests.manage');
  const canViewDashboard = hasPermission('admin.dashboard.view');
  const canViewReports = hasPermission('admin.reports.view');

  // Citizen permissions
  const canEditProfile = hasPermission('citizen.profile.edit');
  const canCreateRequests = hasPermission('citizen.requests.create');
  const canViewPayments = hasPermission('citizen.payments.view');
  const canUploadDocuments = hasPermission('citizen.documents.upload');

  // Legacy compatibility
  const canEdit = isAdmin || isEditor || isFuncionario || isGestor;
  const canDelete = isAdmin || isSuperAdmin;

  // Admin area access
  const canAccessAdmin = isAdmin || isSuperAdmin || isEditor || isFuncionario || isGestor;

  // Get default redirect path after login based on role
  const getDefaultRedirect = (): string => {
    switch (role) {
      case 'super_admin':
      case 'admin':
        return '/admin';
      case 'editor':
        return '/admin/noticias';
      case 'funcionario':
        return '/admin/pedidos';
      case 'gestor':
        return '/admin/projectos';
      case 'municipe':
        return '/municipe';
      default:
        return '/';
    }
  };

  return {
    // Role info
    role,
    permissions,
    loading: isLoading,
    
    // Role checks
    isSuperAdmin,
    isAdmin,
    isEditor,
    isFuncionario,
    isGestor,
    isMunicipe,

    // Permission checks
    hasPermission,
    canManageNews,
    canManageServices,
    canManageProjects,
    canManageUsers,
    canManageRequests,
    canViewDashboard,
    canViewReports,
    canEditProfile,
    canCreateRequests,
    canViewPayments,
    canUploadDocuments,

    // Access control
    canAccessAdmin,
    canEdit, // Legacy
    canDelete,

    // Utilities
    getDefaultRedirect,
  };
}
