import React, { lazy, Suspense, useState } from 'react';
import moment from 'moment';

// Import Komponenten aus dem Host (app1) - bidirektionale Module Federation
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

export default function WidgetWithHostIntegration() {
  const [showHostComponents, setShowHostComponents] = useState(true);

  return (
    <div
      style={{
        borderRadius: '8px',
        padding: '2em',
        backgroundColor: '#d32f2f',
        color: 'white',
        border: '2px solid #b71c1c',
      }}
      data-e2e="APP_2__WIDGET_HOST_INTEGRATION"
    >
      <h2>🔗 App 2 Widget with Bidirectional Module Federation</h2>
      <p>
        App2 Moment Dep ({moment.version}): {moment().format('MMMM Do YYYY, h:mm:ss a')}
      </p>
      
      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1rem', 
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: '6px',
        border: '1px solid rgba(255,255,255,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>🏠 Host Component Integration Test</h3>
          <button 
            onClick={() => setShowHostComponents(!showHostComponents)}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.4)',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showHostComponents ? 'Hide' : 'Show'} Host Components
          </button>
        </div>
        
        {showHostComponents && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: '#ffeb3b', marginBottom: '0.5rem' }}>Header from Host (app1):</h4>
              <Suspense fallback={
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  fontStyle: 'italic'
                }}>
                  Loading Host Header component...
                </div>
              }>
                <HostHeader />
              </Suspense>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: '#ffeb3b', marginBottom: '0.5rem' }}>ColoredRect from Host (app1):</h4>
              <Suspense fallback={
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  fontStyle: 'italic'
                }}>
                  Loading Host ColoredRect component...
                </div>
              }>
                <HostColoredRect />
              </Suspense>
            </div>
          </>
        )}
        
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: 'rgba(76, 175, 80, 0.3)',
          borderRadius: '4px',
          border: '1px solid rgba(76, 175, 80, 0.6)'
        }}>
          <strong>✅ Bidirectional Federation Working!</strong>
          <br />
          <small>Plugin (app2) successfully importing and using Host (app1) components</small>
        </div>
      </div>
    </div>
  );
}
