import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { CitizenSidebar } from './CitizenSidebar';
import { Menu } from 'lucide-react';

interface CitizenLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function CitizenLayout({ children, title, subtitle }: CitizenLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <CitizenSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 sm:h-16 border-b border-border bg-background flex items-center justify-between px-3 sm:px-4 lg:px-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <SidebarTrigger className="lg:hidden">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <div>
                <h1 className="text-sm sm:text-lg font-semibold text-foreground">{title}</h1>
                {subtitle && <p className="text-[11px] sm:text-sm text-muted-foreground">{subtitle}</p>}
              </div>
            </div>
          </header>
          <main className="flex-1 p-3 sm:p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}