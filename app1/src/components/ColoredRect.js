import React from 'react';

const ColoredRect = ({ color = '#e9ecef', text = 'Dummy Component', height = '60px' }) => {
  return (
    <div style={{
      backgroundColor: color,
      border: '2px dashed #6c757d',
      borderRadius: '4px',
      padding: '1rem',
      textAlign: 'center',
      height: height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.85rem',
      fontWeight: '500',
      color: '#495057',
      margin: '0.5rem 0'
    }}>
      {text}
    </div>
  );
};

export default ColoredRect;
