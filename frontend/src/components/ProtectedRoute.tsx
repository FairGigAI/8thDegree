import { useSession } from '@/hooks/useSession';
import { LoadingState } from './LoadingState';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useSession(true);

  if (isLoading) {
    return <LoadingState type="card" count={1} />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
} 