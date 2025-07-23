import React from 'react';

interface CardProps {
  id?: string;
  title?: string;
  children: React.ReactNode;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}

const Card: React.FC<CardProps> = ({ 
  id,
  title, 
  children, 
  backgroundColor = '#f5f5f5', 
  borderColor = '#999', 
  textColor = '#666' 
}) => {
  return (
    <div id={id} style={{
      padding: '16px',
      margin: '12px 0', 
      backgroundColor,
      border: `2px dashed ${borderColor}`,
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      {title && <h4 style={{ margin: '0 0 0.5rem 0', color: textColor }}>{title}</h4>}
      <div style={{ fontSize: '14px', color: '#888' }}>
        {children}
      </div>
    </div>
  );
};

export default Card;
