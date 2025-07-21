import React, { lazy, Suspense } from 'react';

// Import host Card component only
const HostCard = lazy(() => 
  import('host_frontend/Card').catch(() => ({
    default: ({ children }) => <div style={{ color: '#999' }}>Host Card unavailable: {children}</div>
  }))
);

const HostConsumerWidget = () => {
  return (
    <div style={{
      padding: '16px',
      border: '2px solid #ff9800', 
      borderRadius: '8px',
      backgroundColor: '#fff3e0',
      margin: '16px 0'
    }}>
      <h4 style={{ margin: '0 0 12px 0', color: '#f57c00' }}>
        Remote Plugin widget
      </h4>
      <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666' }}>
        (using host Card component)
      </p>
      
      <Suspense fallback={<div>Loading host component...</div>}>
        <HostCard 
          title="Card 4" 
          backgroundColor="#f3e5f5"
          borderColor="#9c27b0" 
          textColor="#7b1fa2"
        >
          This card is defined in host app but rendered in plugin app!
        </HostCard>
      </Suspense>
    </div>
  );
};

export default HostConsumerWidget;
