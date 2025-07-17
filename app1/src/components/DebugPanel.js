import React, { useState, useEffect } from 'react';
import { reactTreeIntegrator } from '../utils/ReactComponentTreeIntegrator';

const DebugPanel = () => {
  const [debugInfo, setDebugInfo] = useState({
    plugins: 0,
    manualPlugins: 0,
    injectionRules: {},
    isPatched: false
  });

  const updateDebugInfo = () => {
    setDebugInfo({
      plugins: reactTreeIntegrator.plugins ? reactTreeIntegrator.plugins.size : 0,
      manualPlugins: reactTreeIntegrator.manualPlugins ? reactTreeIntegrator.manualPlugins.size : 0,
      injectionRules: Object.fromEntries(reactTreeIntegrator.injectionRules || []),
      isPatched: reactTreeIntegrator.isPatched || false
    });
  };

  useEffect(() => {
    updateDebugInfo();
    
    const interval = setInterval(updateDebugInfo, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerDebug = () => {
    console.log('🔍 Manual Debug Trigger');
    reactTreeIntegrator.debug();
    updateDebugInfo();
  };

  const forcePluginReload = () => {
    console.log('🔄 Force Plugin Reload');
    window.dispatchEvent(new CustomEvent('react-tree-plugins-updated'));
    window.dispatchEvent(new CustomEvent('app-plugin-update'));
  };

  const testManualInjection = () => {
    console.log('🧪 Test Manual Injection');
    // Manually add a test plugin to verify the system works
    const testPlugin = {
      id: 'test-plugin',
      name: 'Test Plugin',
      scope: 'test',
      module: 'TestComponent',
      injection: {
        target: 'sidebar',
        method: 'append',
        order: 5
      }
    };
    
    reactTreeIntegrator.addPlugin(testPlugin);
    reactTreeIntegrator.forceUpdate();
    updateDebugInfo();
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#fff',
      border: '2px solid #007acc',
      borderRadius: '8px',
      padding: '1rem',
      fontSize: '0.8rem',
      maxWidth: '300px',
      zIndex: 1000,
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#007acc' }}>Debug Panel</h4>
      <div>🔧 React Patched: {debugInfo.isPatched ? '✅' : '❌'}</div>
      <div>📦 Auto Plugins: {debugInfo.plugins}</div>
      <div>🎯 Manual Plugins: {debugInfo.manualPlugins}</div>
      <div>📝 Injection Rules: {Object.keys(debugInfo.injectionRules).length}</div>
      
      {Object.keys(debugInfo.injectionRules).length > 0 && (
        <details style={{ marginTop: '0.5rem' }}>
          <summary style={{ cursor: 'pointer', color: '#007acc' }}>Rules</summary>
          <pre style={{ fontSize: '0.7rem', overflow: 'auto', maxHeight: '100px' }}>
            {JSON.stringify(debugInfo.injectionRules, null, 2)}
          </pre>
        </details>
      )}
      
      <button 
        onClick={triggerDebug}
        style={{
          marginTop: '0.5rem',
          padding: '0.25rem 0.5rem',
          background: '#007acc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.7rem',
          marginRight: '0.25rem'
        }}
      >
        Debug Console
      </button>
      
      <button 
        onClick={forcePluginReload}
        style={{
          padding: '0.25rem 0.5rem',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.7rem',
          marginRight: '0.25rem'
        }}
      >
        Force Reload
      </button>
      
      <button 
        onClick={testManualInjection}
        style={{
          padding: '0.25rem 0.5rem',
          background: '#ffc107',
          color: 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.7rem'
        }}
      >
        Test Injection
      </button>
    </div>
  );
};

export default DebugPanel;
