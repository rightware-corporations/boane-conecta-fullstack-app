import type { UserRole } from '@/types';
import { isUuid } from '@/features/request-journey/types';

export function defaultRoute(role: UserRole | null): string {
  if (role === 'municipe') return '/municipe';
  if (role && ['super_admin', 'admin', 'editor', 'funcionario', 'gestor'].includes(role)) return '/admin';
  return '/';
}

// Only known, protected destinations may survive authentication. Never accept
// an absolute URL, encoded slash, or a path for a different role.
export function destinationAfterLogin(role: UserRole | null, requested: unknown): string {
  const fallback = defaultRoute(role);
  if (typeof requested !== 'string' || !requested.startsWith('/') || requested.startsWith('//') ||
      requested.includes('\\') || /%2f|%5c/i.test(requested) ||
      [...requested].some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) return fallback;
  const path = requested.split(/[?#]/, 1)[0];
  if (role === 'municipe') {
    const start = /^\/municipe\/pedidos\/iniciar\/([^/]+)$/.exec(path);
    const draft = /^\/municipe\/pedidos\/rascunhos\/([^/]+)$/.exec(path);
    if (start || draft) return isUuid((start || draft)![1]) && requested === path ? requested : fallback;
    if (path === '/municipe/pedidos/rascunhos' && requested === path) return requested;
    if (/^\/municipe(?:\/(?:perfil|pedidos(?:\/(?!iniciar$|rascunhos$)[^/]+)?|documentos|licencas|pagamentos|agendamentos|notificacoes))?$/.test(path)) return requested;
  }
  const allStaff = ['super_admin', 'admin', 'editor', 'funcionario', 'gestor'];
  if (role && allStaff.includes(role)) {
    if (path === '/admin') return requested;
    if (['/admin/filas', '/admin/agenda'].includes(path) && role !== 'editor') return requested;
    if (path === '/admin/servicos' && ['super_admin', 'admin', 'gestor'].includes(role)) return requested;
    if (path === '/admin/filas/configuracao' && ['super_admin', 'admin'].includes(role)) return requested;
    if (path === '/admin/noticias' && ['super_admin', 'admin', 'editor'].includes(role)) return requested;
    if (path === '/admin/projectos' && ['super_admin', 'admin', 'gestor'].includes(role)) return requested;
    if (path === '/admin/utilizadores' && ['super_admin', 'admin'].includes(role)) return requested;
    if (path === '/admin/pedidos' && ['super_admin', 'admin', 'funcionario'].includes(role)) return requested;
  }
  return fallback;
}
