import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Simple authentication - just set to true
    setIsAuthenticated(true);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    isLoading
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

// Additional hook that could be used for queries
export const useAuthQuery = () => {
  const { isAuthenticated } = useAuth();
  
  return {
    getCurrentUser: () => ({ authenticated: isAuthenticated }),
    isUserAdmin: () => isAuthenticated, // Simple: authenticated users are considered "admin"
    getUserPermissions: () => {
      return isAuthenticated 
        ? ['read', 'write', 'delete', 'admin'] 
        : [];
    },
    isAuthenticated
  };
};
