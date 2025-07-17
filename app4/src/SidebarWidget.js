import React, { useState, useEffect } from 'react';

const SidebarWidget = () => {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      padding: '0.75rem',
      backgroundColor: '#e3f2fd',
      borderRadius: '6px',
      border: '1px solid #2196f3',
      fontSize: '0.85rem',
    }}>
      <div style={{ 
        fontWeight: '600', 
        color: '#1976d2',
        marginBottom: '0.5rem',
        fontSize: '0.9rem',
      }}>
        🕒 App4 Clock
      </div>
      <div style={{ color: '#424242', fontFamily: 'monospace' }}>
        {timestamp}
      </div>
      <div style={{ 
        marginTop: '0.5rem', 
        fontSize: '0.75rem', 
        color: '#666',
      }}>
        Live from sidebar
      </div>
    </div>
  );
};

export default SidebarWidget;
