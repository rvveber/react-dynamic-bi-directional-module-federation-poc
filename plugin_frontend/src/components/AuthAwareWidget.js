import React, { lazy, Suspense, useState, useEffect } from 'react';

// Import host auth hook
const useHostAuth = lazy(() => 
  import('host_frontend/AuthContext').then(module => ({
    default: module.useAuthQuery
  })).catch(() => ({
    default: () => ({ data: null, isAuthenticated: false, isLoading: false })
  }))
);

const AuthAwareWidget = () => {
  const [authState, setAuthState] = useState({
    data: null,
    isAuthenticated: false,
    isLoading: false
  });

  // Polling to get auth state from host (simple demo approach)
  useEffect(() => {
    const pollAuthState = () => {
      try {
        // Check if there's auth data in global scope (we'll add this to host)
        if (window.hostAuthState) {
          setAuthState(window.hostAuthState);
        }
      } catch (e) {
        console.log('Could not access host auth state');
      }
    };

    pollAuthState();
    const interval = setInterval(pollAuthState, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      padding: '16px',
      border: '2px solid #ff9800',
      borderRadius: '8px',
      backgroundColor: '#fff3e0',
      margin: '8px 0'
    }}>
      <h4 style={{ margin: '0 0 12px 0', color: '#f57c00' }}>
        Remote Plugin widget
      </h4>
      
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '12px',
        borderRadius: '4px',
        border: '1px solid #ddd'
      }}>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
          Host Auth State (live updates):
        </div>
        <pre style={{
          margin: 0,
          fontSize: '11px',
          color: '#333',
          backgroundColor: '#fff',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #eee',
          overflow: 'auto',
          maxHeight: '150px'
        }}>
          {JSON.stringify({
            isAuthenticated: authState.isAuthenticated,
            isLoading: authState.isLoading,
            user: authState.data ? {
              name: authState.data.name,
              title: authState.data.title,
              image: authState.data.image,
              loginTime: authState.data.loginTime
            } : null
          }, null, 2)}
        </pre>
      </div>
      
      <div style={{
        marginTop: '12px',
        fontSize: '13px',
        color: authState.isAuthenticated ? '#2e7d32' : '#d32f2f',
        fontWeight: 'bold',
        padding: '8px',
        backgroundColor: authState.isAuthenticated ? '#e8f5e8' : '#ffebee',
        borderRadius: '4px',
        border: `1px solid ${authState.isAuthenticated ? '#4caf50' : '#f44336'}`
      }}>
        {authState.isLoading 
          ? '⏳ Authentication in progress...'
          : authState.isAuthenticated 
            ? `✅ Remote plugin sees: ${authState.data?.name} is logged in!`
            : '❌ Remote plugin detects: No user logged in'
        }
      </div>
    </div>
  );
};

export default AuthAwareWidget;
