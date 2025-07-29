import React from "react";
import { useCounter } from "../contexts/CounterContext";
import { useAuth, useAuthQuery } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const { count } = useCounter();
  const { login, logout } = useAuth();
  const { data, isLoading } = useAuthQuery(); 

  const isAuthenticated = data?.authenticated || false;

  return (
    <header className="app-header">
      <div>
        <h1 className="header-title">Module Federation Host</h1>
        <p className="header-subtitle">
          Plugin system with selector based DOM injection and host
          component/state access.
        </p>
      </div>

      <div className="header-actions">
        <div className="status-badge status-badge-info">
          Count: {count}
        </div>

        {/* Auth Section - Simple login/logout */}
        {isAuthenticated ? (
          <div 
            className={`status-badge ${isLoading ? 'status-badge-warning' : 'status-badge-success'}`}
            onClick={isLoading ? undefined : logout} 
            style={{ cursor: isLoading ? 'default' : 'pointer' }}
          >
            {isLoading ? 'Loading...' : 'Logout'}
          </div>
        ) : (
          <div 
            className={`status-badge ${isLoading ? 'status-badge-warning' : 'status-badge-info'}`}
            onClick={isLoading ? undefined : login} 
            style={{ cursor: isLoading ? 'default' : 'pointer' }}
          >
            {isLoading ? 'Loading...' : 'Login'}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
