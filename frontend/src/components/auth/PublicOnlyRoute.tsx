import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { destinationAfterLogin } from '@/lib/auth-navigation';

interface PublicOnlyRouteProps {
  children: ReactNode;
}

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">A carregar...</p>
      </div>
    );
  }

  // If user is authenticated, redirect to their default page
  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname?: string; search?: string; hash?: string } } | null)?.from;
    const requested = from?.pathname ? `${from.pathname}${from.search || ''}${from.hash || ''}` : null;
    return <Navigate to={destinationAfterLogin(role, requested)} replace state={null} />;
  }

  return <>{children}</>;
}
