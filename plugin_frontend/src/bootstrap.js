import React from 'react';
import { createRoot } from 'react-dom/client';
import Widget from './components/Widget';
import HostConsumerWidget from './components/HostConsumerWidget';

const App = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Plugin Frontend Standalone</h1>
      <p>This plugin can run standalone or be loaded by the host.</p>
      
      <div style={{ marginTop: '2rem' }}>
        <h2>Available Plugin Components:</h2>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3>1. Basic Widget</h3>
          <Widget />
        </div>
        
        <div>
          <h3>2. Bidirectional Widget (uses host components)</h3>
          <HostConsumerWidget />
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
