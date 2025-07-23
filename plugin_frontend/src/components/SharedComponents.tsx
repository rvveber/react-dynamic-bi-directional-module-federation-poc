import React from 'react';

// Standardized loading component
export const LoadingState: React.FC<{ message?: string }> = ({ 
  message = "Loading..." 
}) => (
  <div className="loading-state">
    {message}
  </div>
);

// Standardized error component
export const ErrorState: React.FC<{ message?: string }> = ({ 
  message = "Something went wrong" 
}) => (
  <div className="error-state">
    {message}
  </div>
);

// Shared plugin widget wrapper
export const PluginWidgetWrapper: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <div className="plugin-widget">
    <div className="plugin-widget-title">{title}</div>
    <div className="plugin-widget-description">{description}</div>
    {children}
  </div>
);
