
/**
 * Mock API functions for authentication demo
 * Simplified to just demonstrate React Query integration
 */

export interface AuthStatus {
  authenticated: boolean;
  message: string;
}

// Simple mock API that just returns authentication status
export const getAuthStatusApi = async (): Promise<AuthStatus> => {
  // Simulate network delay - very long to definitely see loading
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Handle SSR/SSG case - return consistent default
  if (typeof window === 'undefined') {
    return { authenticated: false, message: 'Server-side render' };
  }
  
  const token = localStorage.getItem('auth_token');
  return {
    authenticated: !!token,
    message: token ? 'User is authenticated' : 'No authentication token found'
  };
};
