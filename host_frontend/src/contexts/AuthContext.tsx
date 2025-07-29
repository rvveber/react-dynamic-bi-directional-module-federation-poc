import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAuthStatusApi } from '../api/auth';

interface AuthContextType {
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const login = () => {
    // Simple login - just set a token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', `demo-token-${Date.now()}`);
    }
    
    // Invalidate the auth query to trigger a refetch
    queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });
  };

  const logout = () => {
    // Clear auth data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    
    // Invalidate the auth query to trigger a refetch
    queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });
  };

  const value: AuthContextType = {
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Simple React Query hook for authentication status.
 * This can be used by any component in the host application.
 */
export function useAuthQuery() {
  return useQuery({
    queryKey: ['auth', 'status'],
    queryFn: getAuthStatusApi,
    staleTime: 0, // Always fresh for demo purposes
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
