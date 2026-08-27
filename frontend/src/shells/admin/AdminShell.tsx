import type { ReactNode } from 'react';

import { SkipLink, SystemAlertRegion } from '@/design-system/components/accessibility';

type AdminShellProps = {
  children: ReactNode;
  taskSidebar: ReactNode;
  contextualHeader: ReactNode;
  systemAlert?: ReactNode;
};

export function AdminShell({ children, taskSidebar, contextualHeader, systemAlert }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-canvas">
      <SkipLink />
      <SystemAlertRegion>{systemAlert}</SystemAlertRegion>
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-surface lg:block">{taskSidebar}</aside>
      <div className="lg:pl-64">
        {contextualHeader}
        <main id="main-content" tabIndex={-1} className="mx-auto min-h-[calc(100vh-4rem)] max-w-[1440px] px-4 py-6 outline-none xsm:px-5 tb:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
