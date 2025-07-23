import React from "react";
import { useCounter } from "../contexts/CounterContext";
import { useAuth } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const { count } = useCounter();
  const { isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    // Simple fake login without form
    await login("test@admin.com", "password");
  };

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
          <div className="status-badge status-badge-success" onClick={logout} style={{ cursor: 'pointer' }}>
            Logout
          </div>
        ) : (
          <div className="status-badge status-badge-info" onClick={handleLogin} style={{ cursor: 'pointer' }}>
            Login
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
