import { ReactNode } from 'react';

import { PublicShell } from '@/shells/public/PublicShell';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return <PublicShell>{children}</PublicShell>;
}
