import React, { useState, lazy, Suspense, useEffect } from 'react';
import { loadRemote, init, registerRemotes } from '@module-federation/runtime';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { loadPluginsWithReactIntegration, testFunction } from './utils/ReactComponentTreeIntegrator';

// Keep track of registered remotes to avoid duplicates
const registeredRemotes = new Set();

const ensureRemoteRegistered = async (plugin) => {
  if (registeredRemotes.has(plugin.scope)) {
    return; // Already registered
  }
  
  console.log(`📡 Registering remote for manual plugin: ${plugin.scope} -> ${plugin.entry}`);
  
  try {
    registerRemotes([
      {
        name: plugin.scope,
        entry: plugin.entry,
      }
    ]);
    
    registeredRemotes.add(plugin.scope);
    console.log(`✅ Remote registered: ${plugin.scope}`);
  } catch (error) {
    console.error(`❌ Failed to register remote ${plugin.scope}:`, error);
    throw error;
  }
};

const DynamicComponent = ({ plugin }) => {
  if (!plugin) {
    return null;
  }

  const modulePath = `${plugin.scope}/${plugin.module}`;
  console.log('Loading module:', modulePath, 'for plugin:', plugin);

  const Component = lazy(() => {
    console.log('Attempting to load remote module:', modulePath);
    
    // Ensure remote is registered before loading
    return ensureRemoteRegistered(plugin).then(() => {
      return loadRemote(modulePath);
    }).catch(err => {
      console.error('Failed to load remote module:', modulePath, err);
      throw err;
    });
  });

  return (
    <Suspense fallback={<div>Loading {plugin.name}...</div>}>
      <Component />
    </Suspense>
  );
};

const App = () => {
  const [manualPlugins, setManualPlugins] = useState([]);
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        console.log('🚀 Initializing App...');

        // Initialize federation without hardcoded remotes
        await init({
          name: 'host',
          remotes: [] // Dynamic plugins will be registered at runtime
        });

        // Test if imports work
        console.log('Testing function import:', typeof testFunction);
        console.log('Testing main function import:', typeof loadPluginsWithReactIntegration);
        
        if (typeof testFunction === 'function') {
          testFunction();
        }

        // Load plugins configuration and initialize React tree integration
        const manualPlugins = await loadPluginsWithReactIntegration();
        setManualPlugins(manualPlugins);

        console.log('✅ App initialization complete');
        setLoading(false);
      } catch (err) {
        console.error('❌ App initialization failed:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Dynamic Module Federation System</h1>
        <p>Initializing system...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      
      <div style={{ flex: 1, padding: '1rem' }}>
        <Header />
        
        <div style={{ margin: '2rem 0' }}>
          <h2>Manual Plugin Loading</h2>
          <div style={{ marginBottom: '1rem' }}>
            {manualPlugins.map(plugin => (
              <button
                key={plugin.id}
                onClick={() => setSelectedPlugin(plugin)}
                style={{
                  margin: '0.25rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: selectedPlugin?.id === plugin.id ? '#007bff' : '#f8f9fa',
                  color: selectedPlugin?.id === plugin.id ? 'white' : '#333',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {plugin.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ 
          minHeight: '200px', 
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '1rem',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Plugin Content</h3>
          <DynamicComponent plugin={selectedPlugin} />
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
          <h4>System Status</h4>
          <p>Manual plugins loaded: {manualPlugins.length}</p>
          <p>React Component Tree Integration: ✅ ACTIVE</p>
          <p>Selected plugin: {selectedPlugin?.name || 'None'}</p>
        </div>
      </div>
    </div>
  );
};

export default App;
