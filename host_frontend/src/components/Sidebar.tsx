import React from 'react';
import Card from './Card';

const Sidebar: React.FC = () => {
  return (
    <aside className="app-sidebar">
      <h3 className="sidebar-title">Plugin Targets</h3>
      
      <Card id="first-card" title="Card 1">
        Plugin will inject widget BEFORE this
      </Card>
      
      <Card id="middle-card" title="Card 2">
        Plugin will REPLACE this with widget.
      </Card>
      
      <Card id="last-card" title="Card 3">
        Plugin will inject widget AFTER this
      </Card>
    </aside>
  );
};

export default Sidebar;
