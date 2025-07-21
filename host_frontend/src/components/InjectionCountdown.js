import React, { useState, useEffect } from 'react';

const InjectionCountdown = ({ position, onComplete }) => {
  const [count, setCount] = useState(4);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [count, onComplete]);

  if (count === 0) return null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Circular countdown */}
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#007acc',
        boxShadow: '0 8px 32px rgba(0, 122, 204, 0.3)',
        background: 'transparent'
      }}>
        {count}
      </div>
      
      {/* Subtitle */}
      <div style={{
        marginTop: '16px',
        fontSize: '16px',
        color: '#666',
        textAlign: 'center',
        fontWeight: '500'
      }}>
        Plugin injection starting...
      </div>
      
      <div style={{
        marginTop: '8px',
        fontSize: '14px',
        color: '#999',
        textAlign: 'center'
      }}>
        Plugins will automatically inject into the page
      </div>
    </div>
  );
};

export default InjectionCountdown;
