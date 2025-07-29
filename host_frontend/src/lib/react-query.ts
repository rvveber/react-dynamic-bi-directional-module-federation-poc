import { QueryClient } from '@tanstack/react-query';

/**
 * Global React Query client configuration
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5 minutes stale time
      staleTime: 5 * 60 * 1000,
      // 10 minutes cache time
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 2 times
      retry: 2,
      // Refetch on window focus for fresh data
      refetchOnWindowFocus: false,
    },
  },
});
