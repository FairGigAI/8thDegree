import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface LoadingStateProps {
  type?: 'card' | 'list' | 'profile';
  count?: number;
}

export function LoadingState({ type = 'card', count = 1 }: LoadingStateProps) {
  switch (type) {
    case 'card':
      return (
        <div className="space-y-4">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="bg-white shadow rounded-lg p-6">
              <Skeleton height={24} width="60%" className="mb-4" />
              <Skeleton height={16} width="80%" className="mb-2" />
              <Skeleton height={16} width="40%" />
            </div>
          ))}
        </div>
      );
    case 'list':
      return (
        <div className="space-y-2">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton circle width={40} height={40} />
              <div className="flex-1">
                <Skeleton height={16} width="60%" className="mb-2" />
                <Skeleton height={14} width="40%" />
              </div>
            </div>
          ))}
        </div>
      );
    case 'profile':
      return (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton circle width={100} height={100} />
            <div className="flex-1">
              <Skeleton height={24} width="40%" className="mb-2" />
              <Skeleton height={16} width="60%" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton height={16} width="100%" />
            <Skeleton height={16} width="80%" />
            <Skeleton height={16} width="60%" />
          </div>
        </div>
      );
    default:
      return null;
  }
} 