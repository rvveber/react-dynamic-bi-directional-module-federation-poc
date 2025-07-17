import React from 'react';
import Widget from './Widget';
import Dashboard from './Dashboard';

const App = () => {
  return (
    <div style={{ padding: '2em' }}>
      <h1>App 4 - Dynamic Plugin</h1>
      <Widget />
      <Dashboard />
    </div>
  );
};

export default App;
