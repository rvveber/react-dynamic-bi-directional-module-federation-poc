import React from 'react';

const Header = () => {
  return (
    <header style={{
      padding: '1rem 2rem',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #dee2e6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: '60px',
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>
          Dynamic System Host
        </h1>
      </div>
    </header>
  );
};

export default Header;
