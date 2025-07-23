import React from 'react';
import { PluginWidgetWrapper } from './SharedComponents';
import '../styles/components.css';

const Widget: React.FC = () => {
  return (
    <PluginWidgetWrapper
      title="Plugin Widget"
      description="Basic plugin positioning demo"
    >
      {/* Widget content can go here if needed */}
    </PluginWidgetWrapper>
  );
};

export default Widget;
