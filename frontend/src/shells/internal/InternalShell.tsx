import { useEffect, useRef, type ReactNode } from 'react';
import { ChevronDown, LogOut, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { LogoImage } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SkipLink, SystemAlertRegion } from '@/design-system/components/accessibility';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';

import type { InternalNavigationItem } from './internal-navigation';

type InternalShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  role: UserRole | null;
  navigation: InternalNavigationItem[];
  userName: string;
  userEmail?: string | null;
  onLogout: () => void | Promise<void>;
  systemAlert?: ReactNode;
};

const roleLabels: Partial<Record<UserRole, string>> = {
  super_admin: 'Super administrador',
  admin: 'Administrador',
  funcionario: 'Funcionário',
  gestor: 'Gestor',
  editor: 'Editor',
};

function Navigation({ items, closeOnSelect = false }: { items: InternalNavigationItem[]; closeOnSelect?: boolean }) {
  const { pathname } = useLocation();
  const groups = [
    { id: 'overview' as const, label: 'Área interna' },
    { id: 'operations' as const, label: 'Operações' },
    { id: 'content' as const, label: 'Conteúdo' },
  ];

  return (
    <nav aria-label="Navegação de operações" className="px-3 py-5">
      {groups.map((group) => {
        const groupItems = items.filter((item) => item.group === group.id);
        if (groupItems.length === 0) return null;
        return (
          <div key={group.id} className="not-first:mt-5">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{group.label}</p>
            <ul className="space-y-1">
              {groupItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          const exactActive = href === '/admin' ? pathname === href : active;
          const link = (
            <Link
              to={href}
              aria-current={exactActive ? 'page' : undefined}
              className={cn(
                'flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
                exactActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted',
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
          return <li key={href}>{closeOnSelect ? <SheetClose asChild>{link}</SheetClose> : link}</li>;
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function Identity() {
  return (
    <Link to="/admin" className="flex min-h-20 items-center gap-3 border-b px-5">
      <LogoImage className="size-10" />
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">Boane Conecta</span>
        <span className="block truncate text-xs text-muted-foreground">Operações municipais</span>
      </span>
    </Link>
  );
}

export function InternalShell({
  children,
  title,
  subtitle,
  role,
  navigation,
  userName,
  userEmail,
  onLogout,
  systemAlert,
}: InternalShellProps) {
  const { pathname } = useLocation();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  const roleLabel = role ? roleLabels[role] || role : 'Utilizador interno';

  return (
    <div className="min-h-screen bg-canvas">
      <SkipLink />
      <SystemAlertRegion>{systemAlert}</SystemAlertRegion>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r bg-surface lg:flex lg:flex-col" aria-label="Área de operações">
        <Identity />
        <div className="flex-1 overflow-y-auto">
          <Navigation items={navigation} />
        </div>
        <div className="border-t p-4">
          <p className="truncate text-sm font-medium">{userName}</p>
          <p className="truncate text-xs text-muted-foreground">{roleLabel}</p>
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 border-b bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/90">
          <div className="flex min-h-16 items-center gap-3 px-4 xsm:px-5 tb:px-6 lg:px-8">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 lg:hidden" aria-label="Abrir navegação">
                  <Menu className="size-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[min(20rem,88vw)] p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navegação de operações</SheetTitle>
                  <SheetDescription>Escolha uma área operacional.</SheetDescription>
                </SheetHeader>
                <Identity />
                <Navigation items={navigation} closeOnSelect />
              </SheetContent>
            </Sheet>

            <div className="min-w-0 flex-1">
              <h1 ref={headingRef} tabIndex={-1} className="truncate text-base font-semibold outline-none xsm:text-lg">
                {title}
              </h1>
              {subtitle && <p className="truncate text-xs text-muted-foreground tb:text-sm">{subtitle}</p>}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="max-w-[12rem] gap-2 px-2" aria-label="Abrir menu do utilizador">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-sm font-semibold text-primary">
                    {userName.charAt(0).toUpperCase() || 'U'}
                  </span>
                  <span className="hidden min-w-0 text-left tb:block">
                    <span className="block truncate text-sm font-medium">{userName}</span>
                    <span className="block truncate text-xs font-normal text-muted-foreground">{roleLabel}</span>
                  </span>
                  <ChevronDown className="hidden size-4 tb:block" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <span className="block truncate">{userName}</span>
                  {userEmail && <span className="block truncate text-xs font-normal text-muted-foreground">{userEmail}</span>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => void onLogout()} className="min-h-10">
                  <LogOut className="mr-2 size-4" aria-hidden="true" />
                  Terminar sessão
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="mx-auto min-h-[calc(100vh-4rem)] max-w-[1440px] px-4 py-5 outline-none xsm:px-5 tb:px-6 tb:py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
