import type { ReactNode } from 'react';

import { SkipLink, SystemAlertRegion } from '@/design-system/components/accessibility';

type ExecutiveShellProps = {
  children: ReactNode;
  agendaNavigation: ReactNode;
  decisionHeader: ReactNode;
  systemAlert?: ReactNode;
};

export function ExecutiveShell({ children, agendaNavigation, decisionHeader, systemAlert }: ExecutiveShellProps) {
  return (
    <div className="min-h-screen bg-canvas">
      <SkipLink />
      <SystemAlertRegion>{systemAlert}</SystemAlertRegion>
      <header className="border-b bg-surface">{decisionHeader}</header>
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="hidden border-r bg-surface lg:block">{agendaNavigation}</aside>
        <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-4rem)] px-4 py-6 outline-none xsm:px-5 tb:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
