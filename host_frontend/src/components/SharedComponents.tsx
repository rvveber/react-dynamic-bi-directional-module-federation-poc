import React from 'react';

// Standardized loading component for host
export const LoadingState: React.FC<{ message?: string }> = ({ 
  message = "Loading..." 
}) => (
  <div className="loading-state">
    {message}
  </div>
);

// Standardized error component for host
export const ErrorState: React.FC<{ message?: string }> = ({ 
  message = "Something went wrong" 
}) => (
  <div className="error-state">
    {message}
  </div>
);
