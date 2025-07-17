import React, { useState, useEffect } from 'react';
import moment from 'moment';

export default function Widget() {
  const [currentTime, setCurrentTime] = useState(moment());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        borderRadius: '8px',
        padding: '2em',
        backgroundColor: '#28a745',
        color: 'white',
        marginBottom: '1em',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
      data-e2e="APP_4__WIDGET"
    >
      <h2>🚀 App 4 Widget - Dynamic Plugin</h2>
      <p>
        <strong>Using Host's Moment.js ({moment.version})</strong>
      </p>
      <p>
        Current Time: {currentTime.format('MMMM Do YYYY, h:mm:ss a')}
      </p>
      
      <div style={{ marginTop: '1.5em', padding: '1em', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '6px' }}>
        <h4 style={{ margin: '0 0 0.5em 0' }}>🎯 Plugin Features</h4>
        <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
          <li>Real-time clock using shared Moment.js</li>
          <li>Dynamically loaded via Module Federation</li>
          <li>Universal injection system</li>
          <li>Clean, isolated component</li>
        </ul>
      </div>
      
      <p style={{ fontSize: '0.9em', marginTop: '1em', opacity: 0.9 }}>
        ✨ This plugin was loaded dynamically from JSON configuration!
      </p>
    </div>
  );
}
