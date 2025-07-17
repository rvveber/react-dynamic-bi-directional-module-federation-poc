import React, { lazy, Suspense, useState, useEffect } from 'react';

// Import Host-Komponenten für erweiterte Integration
const HostHeader = lazy(() => import('app1/Header').catch(err => {
  console.error('Failed to load Host Header:', err);
  return { 
    default: () => <div style={{color: '#666', fontStyle: 'italic'}}>Host Header component not available</div> 
  };
}));

const HostColoredRect = lazy(() => import('app1/ColoredRect').catch(err => {
  console.error('Failed to load Host ColoredRect:', err);
  return { 
    default: () => <div style={{color: '#666', fontStyle: 'italic'}}>Host ColoredRect component not available</div> 
  };
}));

const AdvancedSidebarWidget = () => {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());
  const [showHostComponents, setShowHostComponents] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString());
      setCounter(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      padding: '1rem',
      backgroundColor: '#e8f5e8',
      borderRadius: '8px',
      border: '2px solid #4caf50',
      fontSize: '0.9rem',
      maxWidth: '300px'
    }}>
      <div style={{ 
        fontWeight: '600', 
        color: '#2e7d32',
        marginBottom: '0.75rem',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>🔗 App4 Advanced Widget</span>
        <span style={{ fontSize: '0.7em', opacity: 0.7 }}>#{counter}</span>
      </div>
      
      <div style={{ 
        color: '#424242', 
        fontFamily: 'monospace',
        marginBottom: '0.75rem',
        padding: '0.5rem',
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: '4px'
      }}>
        🕒 {timestamp}
      </div>
      
      <button 
        onClick={() => setShowHostComponents(!showHostComponents)}
        style={{
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          padding: '0.5rem 0.75rem',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.8rem',
          marginBottom: '0.75rem',
          width: '100%'
        }}
      >
        {showHostComponents ? 'Hide' : 'Show'} Host Components
      </button>

      {showHostComponents && (
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.5)',
          padding: '0.75rem',
          borderRadius: '4px',
          border: '1px solid rgba(76, 175, 80, 0.3)'
        }}>
          <h5 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>Host Integration:</h5>
          
          <div style={{ marginBottom: '0.5rem' }}>
            <strong style={{ fontSize: '0.8em', color: '#666' }}>Header:</strong>
            <Suspense fallback={<div style={{ fontSize: '0.8em', fontStyle: 'italic' }}>Loading...</div>}>
              <div style={{ transform: 'scale(0.8)', transformOrigin: 'top left' }}>
                <HostHeader />
              </div>
            </Suspense>
          </div>

          <div>
            <strong style={{ fontSize: '0.8em', color: '#666' }}>ColoredRect:</strong>
            <Suspense fallback={<div style={{ fontSize: '0.8em', fontStyle: 'italic' }}>Loading...</div>}>
              <div style={{ transform: 'scale(0.6)', transformOrigin: 'top left' }}>
                <HostColoredRect />
              </div>
            </Suspense>
          </div>
        </div>
      )}
      
      <div style={{ 
        marginTop: '0.75rem', 
        fontSize: '0.75rem', 
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        Bidirectional MF Active ✅
      </div>
    </div>
  );
};

export default AdvancedSidebarWidget;
