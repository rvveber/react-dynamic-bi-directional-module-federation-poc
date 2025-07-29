import React from 'react';
import { PluginWidgetWrapper } from './common';
import '../styles/components.css';

const Widget: React.FC = () => {
  return (
    <PluginWidgetWrapper
      title="Widget (from Plugin)"
      description="Basic plugin positioning demo"
    >
      {/* Widget content can go here if needed */}
    </PluginWidgetWrapper>
  );
};

export default Widget;
