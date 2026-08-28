import { Bell, CircleUserRound, ClipboardList, FileText, House, Landmark, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { LogoImage } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

const items = [
  { label: 'Início', href: '/municipe', icon: House },
  { label: 'Meus pedidos', href: '/municipe/pedidos', icon: ClipboardList },
  { label: 'Documentos', href: '/municipe/documentos', icon: FileText },
  { label: 'Notificações', href: '/municipe/notificacoes', icon: Bell },
  { label: 'Conta', href: '/municipe/perfil', icon: CircleUserRound },
];

export function CitizenSidebar() {
  const { pathname } = useLocation();
  const { user, profile, logout } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-border bg-surface" aria-label="Área do munícipe">
      <Link to="/municipe" className="flex min-h-20 items-center gap-3 border-b border-border px-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
        <LogoImage className="size-10" />
        <span>
          <span className="block text-sm font-semibold text-foreground">Área do Munícipe</span>
          <span className="block text-xs text-muted-foreground">Município de Boane</span>
        </span>
      </Link>

      <nav className="flex-1 px-3 py-5" aria-label="Navegação principal do munícipe">
        <ul className="space-y-1">
          {items.map(({ label, href, icon: Icon }) => {
            const active = href === '/municipe' ? pathname === href : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  to={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
                    active ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted',
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 border-t border-border pt-4">
          <Link to="/servicos" className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-foreground hover:bg-muted">
            <Landmark className="size-5" aria-hidden="true" />
            Consultar serviços
          </Link>
        </div>
      </nav>

      <div className="border-t border-border p-4">
        <p className="truncate text-sm font-medium text-foreground">{profile?.full_name || 'Munícipe'}</p>
        <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        <Button variant="outline" size="sm" className="mt-3 w-full" onClick={logout}>
          <LogOut className="mr-2 size-4" aria-hidden="true" />
          Terminar sessão
        </Button>
      </div>
    </aside>
  );
}
