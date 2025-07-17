import React, { lazy, Suspense, useEffect, useState } from 'react';
import moment from 'moment';

// Import Komponenten aus dem Host (app1)
const HostSidebar = lazy(() => import('app1/Sidebar').catch(err => {
  console.error('Failed to load Host Sidebar:', err);
  return { 
    default: () => <div style={{color: '#666', fontStyle: 'italic'}}>Host Sidebar component not available</div> 
  };
}));

const HostColoredRect = lazy(() => import('app1/ColoredRect').catch(err => {
  console.error('Failed to load Host ColoredRect:', err);
  return { 
    default: () => <div style={{color: '#666', fontStyle: 'italic'}}>Host ColoredRect component not available</div> 
  };
}));

export default function WidgetWithHostIntegration() {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        borderRadius: '8px',
        padding: '2em',
        backgroundColor: '#1976d2',
        color: 'white',
        border: '2px solid #0d47a1',
      }}
      data-e2e="APP_3__WIDGET_HOST_INTEGRATION"
    >
      <h2>🔗 App 3 Widget with Host Component Usage</h2>
      <p>
        App3 Moment Dep ({moment.version}): {moment().format('MMMM Do YYYY, h:mm:ss a')}
      </p>
      <p style={{ fontFamily: 'monospace', fontSize: '1.1em' }}>
        Live Time: {timestamp}
      </p>
      
      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1rem', 
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: '6px',
        border: '1px solid rgba(255,255,255,0.3)'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <h3>🏠 Host Component Showcase</h3>
          <p style={{ fontSize: '0.9em', opacity: 0.9 }}>
            Demonstrating how Plugin 3 can import and use components from the Host
          </p>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ color: '#ffeb3b', marginBottom: '0.5rem' }}>ColoredRect from Host:</h4>
          <Suspense fallback={
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              fontStyle: 'italic'
            }}>
              Loading Host ColoredRect...
            </div>
          }>
            <HostColoredRect color='rgb(191 255 167)' text='Custom ColoredRect' />
          </Suspense>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.4)',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '0.5rem'
            }}
          >
            {showSidebar ? 'Hide' : 'Show'} Host Sidebar
          </button>
          
          {showSidebar && (
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '4px',
              padding: '0.5rem'
            }}>
              <h4 style={{ color: '#ffeb3b', marginBottom: '0.5rem' }}>Sidebar from Host:</h4>
              <Suspense fallback={
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  fontStyle: 'italic'
                }}>
                  Loading Host Sidebar...
                </div>
              }>
                <HostSidebar />
              </Suspense>
            </div>
          )}
        </div>
        
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: 'rgba(76, 175, 80, 0.3)',
          borderRadius: '4px',
          border: '1px solid rgba(76, 175, 80, 0.6)'
        }}>
          <strong>✅ Plugin 3 ↔ Host Integration Active!</strong>
          <br />
          <small>Bidirectional module federation enables rich component sharing</small>
        </div>
      </div>
    </div>
  );
}
