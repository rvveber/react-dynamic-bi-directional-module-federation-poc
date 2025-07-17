import React from 'react';
import { Button, DialogTrigger, Popover, Dialog } from 'react-aria-components';

const HeaderAction = () => {
  return (
    <DialogTrigger>
      <Button
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#6f42c1',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '0.9rem',
        }}
      >
        App4 Menu
      </Button>
      <Popover
        style={{
          backgroundColor: 'white',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          padding: '1rem',
          minWidth: '200px',
          zIndex: 1000,
        }}
      >
        <Dialog>
          <div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#333' }}>
              App4 Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Button
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onPress={() => alert('Action 1 from App4!')}
              >
                Action 1
              </Button>
              <Button
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onPress={() => alert('Action 2 from App4!')}
              >
                Action 2
              </Button>
              <Button
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ffc107',
                  color: '#212529',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onPress={() => alert('Settings from App4!')}
              >
                Settings
              </Button>
            </div>
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
};

export default HeaderAction;
