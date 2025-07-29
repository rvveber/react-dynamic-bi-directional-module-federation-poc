import React from 'react';

/**
 * Plugin widget wrapper for consistent styling across all plugins
 */
export const PluginWidgetWrapper: React.FC<{
  title: string;
  description: string;
  children?: React.ReactNode;
}> = ({ title, description, children }) => (
  <div className="plugin-scope">
    <div className="plugin-widget">
      <div className="plugin-widget-title">{title}</div>
      <div className="plugin-widget-description">{description}</div>
      {children}
    </div>
  </div>
);
