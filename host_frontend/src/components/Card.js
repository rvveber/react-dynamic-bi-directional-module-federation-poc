import React from 'react';

const Card = ({ title, children, backgroundColor = '#fff', borderColor = '#ddd', textColor = '#333' }) => {
  return (
    <div style={{
      padding: '16px',
      margin: '12px 0', 
      backgroundColor,
      border: `2px solid ${borderColor}`,
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      {title && <h4 style={{ margin: '0 0 0.5rem 0', color: textColor }}>{title}</h4>}
      <div style={{ fontSize: '14px', color: '#757575' }}>
        {children}
      </div>
    </div>
  );
};

export default Card;
