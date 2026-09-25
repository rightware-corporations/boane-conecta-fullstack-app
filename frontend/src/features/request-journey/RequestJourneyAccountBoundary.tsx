import { Fragment } from 'react';
import type { ReactNode } from 'react';

import { useAuth } from '@/hooks/use-auth';

// Remount the journey when the authenticated account changes so an earlier
// account's draft list or in-flight response cannot remain visible.
export function RequestJourneyAccountBoundary({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return <Fragment key={user?.id}>{children}</Fragment>;
}
