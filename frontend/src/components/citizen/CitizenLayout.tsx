import type { ReactNode } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

import { CitizenSidebar } from './CitizenSidebar';
import { CitizenShell } from '@/shells/citizen/CitizenShell';

interface CitizenLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function CitizenLayout({ children, title, subtitle }: CitizenLayoutProps) {
  const header = (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/90">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 xsm:px-5 tb:px-6 lg:px-8">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="truncate text-xs text-muted-foreground tb:text-sm">{subtitle}</p>}
        </div>
        <Link
          to="/municipe/notificacoes"
          aria-label="Abrir notificações"
          className="hidden min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground tb:flex"
        >
          <Bell className="size-5" aria-hidden="true" />
        </Link>
      </div>
    </header>
  );

  return (
    <CitizenShell sidebar={<CitizenSidebar />} header={header}>
      <div className="mx-auto w-full max-w-[1280px]">{children}</div>
    </CitizenShell>
  );
}
