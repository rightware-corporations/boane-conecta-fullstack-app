import type { ReactNode } from 'react';
import { Bell, CircleUserRound, ClipboardList, House, Landmark } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { SkipLink, SystemAlertRegion } from '@/design-system/components/accessibility';
import { cn } from '@/lib/utils';

const mobileNavigation = [
  { label: 'Início', href: '/municipe', icon: House },
  { label: 'Pedidos', href: '/municipe/pedidos', icon: ClipboardList },
  { label: 'Serviços', href: '/servicos', icon: Landmark },
  { label: 'Alertas', href: '/municipe/notificacoes', icon: Bell },
  { label: 'Conta', href: '/municipe/perfil', icon: CircleUserRound },
];

function CitizenMobileNavigation() {
  const { pathname } = useLocation();

  return (
    <nav aria-label="Navegação da área do munícipe" className="fixed inset-x-0 bottom-0 z-40 border-t bg-surface tb:hidden">
      <ul className="grid grid-cols-5">
        {mobileNavigation.map(({ label, href, icon: Icon }) => {
          const active = href === '/municipe' ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                to={href}
                aria-current={active ? 'page' : undefined}
                className={cn('flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-[0.6875rem] font-medium', active ? 'text-primary' : 'text-muted-foreground')}
              >
                <Icon className="size-5" aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

type CitizenShellProps = {
  children: ReactNode;
  sidebar: ReactNode;
  header: ReactNode;
  systemAlert?: ReactNode;
};

export function CitizenShell({ children, sidebar, header, systemAlert }: CitizenShellProps) {
  return (
    <div className="min-h-screen bg-canvas">
      <SkipLink />
      <SystemAlertRegion>{systemAlert}</SystemAlertRegion>
      <div className="hidden tb:block">{sidebar}</div>
      <div className="tb:pl-64">
        {header}
        <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-4rem)] px-4 pb-20 pt-6 outline-none xsm:px-5 tb:px-6 tb:pb-8 lg:px-8">
          {children}
        </main>
      </div>
      <CitizenMobileNavigation />
    </div>
  );
}
