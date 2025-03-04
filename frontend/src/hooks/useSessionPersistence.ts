import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api';

export function useSessionPersistence() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      // Set up API client with token
      apiClient.setAuthToken(session.accessToken);

      // Set up token refresh
      const tokenExpiry = new Date(session.expires);
      const now = new Date();
      const timeUntilExpiry = tokenExpiry.getTime() - now.getTime();

      // Refresh token 5 minutes before expiry
      const refreshTimeout = setTimeout(async () => {
        try {
          const response = await apiClient.refreshToken();
          apiClient.setAuthToken(response.access_token);
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }, timeUntilExpiry - 5 * 60 * 1000);

      return () => clearTimeout(refreshTimeout);
    } else if (status === 'unauthenticated') {
      // Clear token on logout
      apiClient.removeAuthToken();
    }
  }, [session, status]);
} 