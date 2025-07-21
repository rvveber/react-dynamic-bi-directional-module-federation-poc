import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// French historic figure data
const FRENCH_HERO = {
  name: "Napoléon Bonaparte",
  title: "Empereur des Français",
  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg/256px-Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg",
  loginTime: null
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const loggedInUser = {
      ...FRENCH_HERO,
      loginTime: new Date().toISOString()
    };
    
    setUser(loggedInUser);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  };

  // Expose auth state globally for plugins to access
  React.useEffect(() => {
    window.hostAuthState = {
      data: user,
      isLoading,
      isAuthenticated: !!user
    };
  }, [user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for auth queries (mimics useAuthQuery)
export const useAuthQuery = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthQuery must be used within an AuthProvider');
  }
  
  return {
    data: context.user,
    isLoading: context.isLoading,
    isAuthenticated: context.isAuthenticated,
    login: context.login,
    logout: context.logout
  };
};

export default AuthContext;
