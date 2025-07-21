import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import InjectionCountdown from './components/InjectionCountdown';
import { initializePluginSystem } from './utils/PluginSystem';

const App = () => {
  const [showCountdown, setShowCountdown] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      // Wait 5 seconds for countdown, then initialize plugins
      setTimeout(async () => {
        setShowCountdown(false);
        await initializePluginSystem();
      }, 5000);
    };

    initialize();
  }, []);

  return (
    <AuthProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'system-ui', position: 'relative' }}>
        {/* Floating countdown timer in center of page */}
        {showCountdown && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000
          }}>
            <InjectionCountdown 
              position="Plugin injection starting..." 
              onComplete={() => {}} 
            />
          </div>
        )}
        
        <Header />
        
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />
          
          <main style={{ 
            flex: 1, 
            overflow: 'hidden',
            padding: '2rem',
            backgroundColor: '#fafafa'
          }}>
            <h1 style={{ margin: '0 0 1rem 0', color: '#333' }}>
              Module Federation Demo
            </h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              Plugins will inject automatically after countdown completes.
            </p>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;
