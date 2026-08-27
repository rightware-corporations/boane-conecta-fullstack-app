import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useUserRole } from '@/hooks/useUserRole';

interface PublicOnlyRouteProps {
  children: ReactNode;
}

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { getDefaultRedirect } = useUserRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">A carregar...</p>
      </div>
    );
  }

  // If user is authenticated, redirect to their default page
  if (isAuthenticated) {
    return <Navigate to={getDefaultRedirect()} replace />;
  }

  return <>{children}</>;
}