import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function SkipLink({ targetId = 'main-content' }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-foreground px-4 py-3 font-semibold text-background shadow-md transition-transform focus:translate-y-0"
    >
      Saltar para o conteúdo principal
    </a>
  );
}

export function SystemAlertRegion({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div id="system-alert-region" aria-live="polite" aria-atomic="true" className={cn(className)}>
      {children}
    </div>
  );
}
