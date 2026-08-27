import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { SkipLink, SystemAlertRegion } from '@/design-system/components/accessibility';
import { PublicFooter } from '@/shells/public/PublicFooter';
import { PublicHeader } from '@/shells/public/PublicHeader';

export function PublicShell({ children, systemAlert }: { children: ReactNode; systemAlert?: ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <PublicHeader />
      <SystemAlertRegion>{systemAlert}</SystemAlertRegion>
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
