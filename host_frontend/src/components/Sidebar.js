import React from 'react';

const Sidebar = () => {
  return (
    <aside style={{ 
      width: '250px', 
      padding: '1rem', 
      backgroundColor: '#f8f9fa',
      borderRight: '2px solid #e9ecef',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#495057' }}>Plugin Targets</h3>
      
      {/* First card - Red */}
      <div id="first-card" style={{
        padding: '1rem',
        backgroundColor: '#ffebee',
        border: '2px solid #f44336',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#d32f2f' }}>Card 1</h4>
        <p style={{ margin: '0', fontSize: '14px', color: '#757575' }}>
          Plugin will inject BEFORE this
        </p>
      </div>
      
      {/* Second card - Blue (will be replaced) */}
      <div id="middle-card" style={{
        padding: '1rem',
        backgroundColor: '#e3f2fd',
        border: '2px solid #2196f3',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>Card 2</h4>
        <p style={{ margin: '0', fontSize: '14px', color: '#757575' }}>
          Plugin will REPLACE this
        </p>
      </div>
      
      {/* Third card - Green */}
      <div id="last-card" style={{
        padding: '1rem',
        backgroundColor: '#e8f5e8',
        border: '2px solid #4caf50',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#388e3c' }}>Card 3</h4>
        <p style={{ margin: '0', fontSize: '14px', color: '#757575' }}>
          Plugin will inject AFTER this
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
