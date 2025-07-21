import React from 'react';
import { useAuthQuery } from '../contexts/AuthContext';

const Header = () => {
  const { data: user, isLoading, isAuthenticated, login, logout } = useAuthQuery();

  return (
    <header style={{
      padding: '1rem 2rem',
      backgroundColor: '#fff',
      borderBottom: '2px solid #e9ecef',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>Module Federation Host</h1>
        <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
          Dynamic plugin loading demonstration
        </p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isAuthenticated ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src={user.image} 
                alt={user.name}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #007acc'
                }}
              />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {user.title}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={login}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: isLoading ? '#6c757d' : '#007acc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
