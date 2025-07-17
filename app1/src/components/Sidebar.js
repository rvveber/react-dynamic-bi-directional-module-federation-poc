import React from 'react';
import ColoredRect from './ColoredRect';

const Sidebar = () => {
  return (
    <aside 
      style={{
        width: '250px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '1rem',
        border: '1px solid #dee2e6',
      }}
    >
      <h4 style={{ margin: '0 0 1rem 0', color: '#495057' }}>Plugin Sidebar</h4>
      
      <ColoredRect 
        color="#ffeaa7" 
        text="First ColoredRect" 
      />
      
      <ColoredRect 
        color="#fab1a0" 
        text="Second ColoredRect" 
      />
      
    </aside>
  );
};

export default Sidebar;
